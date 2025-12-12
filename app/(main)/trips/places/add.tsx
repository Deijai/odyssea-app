// app/(main)/trips/places/add.tsx
import { DateField } from '@/components/form/DateField';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { RatingStars } from '@/components/ui/RatingStars';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useTripStore } from '@/stores/tripStore';
import { VisitedPlace, VisitedPlaceCategory } from '@/types/trip';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES: VisitedPlaceCategory[] = [
    'Passeio',
    'Restaurante',
    'Praia',
    'Hotel',
    'Transporte',
    'Mirante',
    'Museu',
    'Shopping',
    'Outro',
];

export default function AddPlaceScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const { getTripById, addPlaceToTrip } = useTripStore();

    const trip = tripId ? getTripById(tripId) : undefined;

    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState<VisitedPlaceCategory>('Passeio');
    const [dataHora, setDataHora] = useState<string | null>(new Date().toISOString());
    const [endereco, setEndereco] = useState('');
    const [notas, setNotas] = useState('');
    const [rating, setRating] = useState(4);
    const [tagsText, setTagsText] = useState('');
    const [medias, setMedias] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    if (!tripId || !trip) {
        // se algo errado, volta
        router.replace('/(main)');
        return null;
    }

    function gerarId() {
        return `place-${Date.now()}`;
    }

    function parseTags(t: string): string[] {
        return t
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
    }

    async function handleAddMedia() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const uris = result.assets.map((a) => a.uri);
            setMedias((prev) => [...prev, ...uris]);
        }
    }

    async function handleSave() {
        if (!nome || !dataHora) return;

        setLoading(true);

        const place: VisitedPlace = {
            id: gerarId(),
            name: nome.trim(),
            category: categoria,
            location: {
                latitude: 0, // placeholder - depois integramos com mapa/localização
                longitude: 0,
                address: endereco.trim() || trip?.destination!,
            },
            dateTime: dataHora,
            rating,
            notes: notas.trim(),
            mediaUrls: medias,
            tags: parseTags(tagsText),
        };

        addPlaceToTrip(trip!.id, place);

        setLoading(false);
        router.replace({
            pathname: '/(main)/trips/places/success',
            params: { tripId: trip!.id },
        });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[
                                styles.iconButton,
                                { backgroundColor: theme.colors.cardSoft },
                            ]}
                        >
                            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                        </TouchableOpacity>

                        <Text
                            style={[
                                styles.headerTitle,
                                { color: theme.colors.text },
                            ]}
                        >
                            Novo local
                        </Text>

                        <View style={{ width: 36 }} />
                    </View>

                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        Adicionar memória de viagem 📍
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: theme.colors.textSoft },
                        ]}
                    >
                        Registre o que você visitou, como se sentiu e os detalhes que não quer esquecer.
                    </Text>

                    <View style={styles.form}>
                        <Text
                            style={[
                                styles.sectionLabel,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Informações principais
                        </Text>

                        <TextInput
                            placeholder="Nome do local"
                            placeholderTextColor={theme.colors.textMuted}
                            value={nome}
                            onChangeText={setNome}
                            style={[
                                styles.input,
                                {
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                    color: theme.colors.text,
                                },
                            ]}
                        />

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginVertical: 10 }}
                        >
                            {CATEGORIES.map((cat) => (
                                <CategoryChip
                                    key={cat}
                                    label={cat}
                                    selected={cat === categoria}
                                    onPress={() => setCategoria(cat)}
                                />
                            ))}
                        </ScrollView>

                        <DateField
                            label="Data da visita"
                            value={dataHora}
                            onChange={setDataHora}
                            placeholder="Quando você esteve aqui?"
                        />

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    { color: theme.colors.textSoft },
                                ]}
                            >
                                Endereço / referência
                            </Text>
                            <TextInput
                                placeholder="Ex: Orla da Praia de Iracema"
                                placeholderTextColor={theme.colors.textMuted}
                                value={endereco}
                                onChangeText={setEndereco}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    },
                                ]}
                            />
                        </View>

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    { color: theme.colors.textSoft },
                                ]}
                            >
                                Como foi essa experiência?
                            </Text>
                            <TextInput
                                placeholder="Escreva suas impressões, sensações, detalhes marcantes..."
                                placeholderTextColor={theme.colors.textMuted}
                                value={notas}
                                onChangeText={setNotas}
                                multiline
                                style={[
                                    styles.textArea,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    },
                                ]}
                            />
                        </View>

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    { color: theme.colors.textSoft },
                                ]}
                            >
                                Avaliação
                            </Text>
                            <RatingStars value={rating} onChange={setRating} />
                        </View>

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    { color: theme.colors.textSoft },
                                ]}
                            >
                                Tags (separadas por vírgula)
                            </Text>
                            <TextInput
                                placeholder="Ex: Pôr-do-sol, Fotografias, Família"
                                placeholderTextColor={theme.colors.textMuted}
                                value={tagsText}
                                onChangeText={setTagsText}
                                style={[
                                    styles.input,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    },
                                ]}
                            />
                        </View>

                        <Text
                            style={[
                                styles.sectionLabel,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Fotos e vídeos
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 10 }}
                        >
                            <TouchableOpacity
                                onPress={handleAddMedia}
                                style={[
                                    styles.mediaAdd,
                                    { borderColor: theme.colors.border, backgroundColor: theme.colors.cardSoft },
                                ]}
                            >
                                <Ionicons name="camera-outline" size={22} color={theme.colors.primary} />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.textSoft,
                                        marginTop: 4,
                                    }}
                                >
                                    Adicionar mídia
                                </Text>
                            </TouchableOpacity>

                            {medias.map((uri) => (
                                <Image
                                    key={uri}
                                    source={{ uri }}
                                    style={styles.mediaThumb}
                                />
                            ))}
                        </ScrollView>

                        <ThemedButton
                            title="Salvar memória"
                            onPress={handleSave}
                            loading={loading}
                            style={{ marginTop: 6, marginBottom: 20 }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 18,
    },
    form: {
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 6,
    },
    fieldLabel: {
        fontSize: 13,
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderRadius: 999,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 15,
    },
    textArea: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    mediaAdd: {
        width: 90,
        height: 90,
        marginRight: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediaThumb: {
        width: 90,
        height: 90,
        borderRadius: 16,
        marginRight: 10,
    },
});
