// app/(main)/create-trip.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { DateField } from '@/components/form/DateField';
import { InputField } from '@/components/ui/InputField';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useTripStore } from '@/stores/tripStore';
import type { Trip } from '@/types/trip';
import * as ImagePicker from 'expo-image-picker';

export default function CreateTripScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { addTrip, setSelectedTrip } = useTripStore();

    const [titulo, setTitulo] = useState('');
    const [destino, setDestino] = useState('');
    const [inicio, setInicio] = useState<string | null>(null);
    const [fim, setFim] = useState<string | null>(null);
    const [tagsText, setTagsText] = useState('');
    const [coverUri, setCoverUri] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    function gerarId() {
        return `trip-${Date.now()}`;
    }

    function parseTags(t: string): string[] {
        return t
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
    }

    async function handlePickCover() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 0.9,
        });

        if (!result.canceled && result.assets[0]) {
            setCoverUri(result.assets[0].uri);
        }
    }

    function isValid() {
        return !!titulo && !!destino && !!inicio && !!fim;
    }

    async function handleCreate() {
        if (!isValid()) {
            // aqui depois podemos colocar feedback visual/toast
            return;
        }

        setLoading(true);

        const id = gerarId();

        const trip: Trip = {
            id,
            title: titulo.trim(),
            destination: destino.trim(),
            startDate: inicio!,
            endDate: fim!,
            coverPhotoUrl:
                coverUri ||
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            tags: parseTags(tagsText),
            status: 'Upcoming',
            places: [],
        };

        addTrip(trip);
        setSelectedTrip(id);

        setLoading(false);

        router.replace({
            pathname: '/(main)/trips/[id]',
            params: { id },
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
                    {/* HEADER */}
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
                            Nova viagem
                        </Text>

                        <View style={{ width: 36 }} />
                    </View>

                    {/* TÍTULO */}
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        Planejar nova jornada ✈️
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: theme.colors.textSoft },
                        ]}
                    >
                        Defina o destino, as datas e uma capa. Depois você adiciona os locais aos poucos.
                    </Text>

                    {/* CAPA */}
                    <View style={styles.coverWrapper}>
                        {coverUri ? (
                            <Image
                                source={{ uri: coverUri }}
                                style={styles.coverImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.coverPlaceholder,
                                    { backgroundColor: theme.colors.cardSoft },
                                ]}
                            >
                                <Ionicons
                                    name="image-outline"
                                    size={32}
                                    color={theme.colors.textMuted}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.textSoft,
                                        marginTop: 6,
                                    }}
                                >
                                    Escolha uma foto de capa da viagem
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handlePickCover}
                            style={[
                                styles.coverButton,
                                { backgroundColor: theme.colors.card },
                            ]}
                        >
                            <Ionicons
                                name="camera-outline"
                                size={16}
                                color={theme.colors.primary}
                            />
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.primary,
                                    marginLeft: 6,
                                    fontWeight: '500',
                                }}
                            >
                                Trocar capa
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>
                        <InputField
                            label="Título da viagem"
                            value={titulo}
                            onChangeText={setTitulo}
                            placeholder="Ex: Rota do Sol pelo Nordeste"
                        />

                        <InputField
                            label="Destino principal"
                            value={destino}
                            onChangeText={setDestino}
                            placeholder="Cidade, estado, país"
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <DateField
                                    label="Data de início"
                                    value={inicio}
                                    onChange={setInicio}
                                    placeholder="Início"
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <DateField
                                    label="Data de término"
                                    value={fim}
                                    onChange={setFim}
                                    placeholder="Término"
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginBottom: 6,
                                    fontWeight: '500',
                                    color: theme.colors.textSoft,
                                }}
                            >
                                Tags (separadas por vírgula)
                            </Text>
                            <TextInput
                                placeholder="Ex: Praia, Mochilão, Família"
                                placeholderTextColor={theme.colors.textMuted}
                                value={tagsText}
                                onChangeText={setTagsText}
                                style={[
                                    styles.tagsInput,
                                    {
                                        borderColor: theme.colors.border,
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    },
                                ]}
                            />
                            {parseTags(tagsText).length > 0 && (
                                <View style={styles.tagsPreviewRow}>
                                    {parseTags(tagsText).slice(0, 4).map((tag) => (
                                        <View
                                            key={tag}
                                            style={[
                                                styles.tagChip,
                                                { backgroundColor: theme.colors.cardSoft },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: theme.colors.textSoft,
                                                }}
                                            >
                                                #{tag}
                                            </Text>
                                        </View>
                                    ))}
                                    {parseTags(tagsText).length > 4 && (
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                color: theme.colors.textMuted,
                                            }}
                                        >
                                            +{parseTags(tagsText).length - 4}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>

                        <ThemedButton
                            title="Criar viagem"
                            onPress={handleCreate}
                            loading={loading}
                            style={{ marginTop: 8, marginBottom: 20 }}
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
        paddingBottom: 32,
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
    coverWrapper: {
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 180,
        borderRadius: 18,
    },
    coverPlaceholder: {
        width: '100%',
        height: 180,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverButton: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    form: {
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
    },
    tagsInput: {
        height: 48,
        borderRadius: 999,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 15,
    },
    tagsPreviewRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    tagChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 6,
        marginBottom: 4,
    },
});
