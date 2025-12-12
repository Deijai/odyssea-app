// app/(main)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { useTripStore } from '@/stores/tripStore';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const {
        firebaseUser,
        profile,
        status,
        isInitializing,
        updateProfile,
        updateAvatar,
    } = useAuthStore();

    const tripsCount = useTripStore((s) => s.trips.length);

    const [editing, setEditing] = useState(false);
    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
    const [homeCountry, setHomeCountry] = useState(profile?.homeCountry ?? '');
    const [bio, setBio] = useState(profile?.bio ?? '');
    const [saving, setSaving] = useState(false);

    // ---------- ESTADOS DE CARREGAMENTO / ERRO ----------
    if (isInitializing || status === 'checking') {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.centered}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.colors.textSoft,
                        }}
                    >
                        Carregando informações de perfil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!firebaseUser) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.centered}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.colors.textSoft,
                            textAlign: 'center',
                        }}
                    >
                        Nenhum usuário autenticado.
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.smallButton,
                            { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 14,
                                fontWeight: '600',
                            }}
                        >
                            Ir para login
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!profile) {
        // fallback de segurança, mas em condições normais não deve cair aqui
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.centered}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.colors.textSoft,
                        }}
                    >
                        Não foi possível carregar seu perfil.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const avatarUrl = profile.avatarUrl ?? firebaseUser.photoURL ?? null;
    const displayNameFallback =
        profile.displayName ||
        firebaseUser.displayName ||
        'Viajante';
    const emailFallback = profile.email || firebaseUser.email || '';

    const avatarInitial =
        displayNameFallback.trim().length > 0
            ? displayNameFallback.trim().charAt(0).toUpperCase()
            : 'V';

    // ---------- HANDLERS ----------
    async function handlePickAvatar() {
        try {
            const { status: permStatus } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permStatus !== 'granted') {
                Alert.alert(
                    'Permissão necessária',
                    'Precisamos de acesso à sua galeria para atualizar a foto de perfil.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets[0]?.uri) return;

            const uri = result.assets[0].uri;
            await updateAvatar(uri);
        } catch (err: any) {
            console.log('Erro ao atualizar avatar', err);
            Alert.alert(
                'Erro',
                'Não foi possível atualizar a foto de perfil.'
            );
        }
    }

    async function handleSaveProfile() {
        try {
            setSaving(true);
            await updateProfile({
                displayName: displayName.trim(),
                homeCountry: homeCountry.trim(),
                bio: bio.trim(),
            });
            setEditing(false);
        } catch (err: any) {
            console.log('Erro ao salvar perfil', err);
            Alert.alert('Erro', 'Não foi possível salvar suas alterações.');
        } finally {
            setSaving(false);
        }
    }

    // ---------- UI ----------
    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[
                        styles.iconButton,
                        { backgroundColor: theme.colors.cardSoft },
                    ]}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={18}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                <Text
                    style={[
                        styles.headerTitle,
                        { color: theme.colors.text },
                    ]}
                >
                    Meu perfil
                </Text>

                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* AVATAR + NOME */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        onPress={handlePickAvatar}
                        activeOpacity={0.9}
                    >
                        <View
                            style={[
                                styles.avatarBigWrapper,
                                { backgroundColor: theme.colors.cardSoft },
                            ]}
                        >
                            {avatarUrl ? (
                                <Image
                                    source={{ uri: avatarUrl }}
                                    style={styles.avatarBigImage}
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.avatarBigInitial,
                                        { color: theme.colors.text },
                                    ]}
                                >
                                    {avatarInitial}
                                </Text>
                            )}

                            <View
                                style={[
                                    styles.avatarEditBadge,
                                    {
                                        backgroundColor:
                                            theme.colors.primary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="camera-outline"
                                    size={14}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.name,
                            { color: theme.colors.text },
                        ]}
                    >
                        {displayNameFallback}
                    </Text>
                    {emailFallback ? (
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textSoft,
                                marginTop: 2,
                            }}
                        >
                            {emailFallback}
                        </Text>
                    ) : null}
                </View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    <View
                        style={[
                            styles.statCard,
                            { backgroundColor: theme.colors.card },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textSoft,
                                marginBottom: 2,
                            }}
                        >
                            Viagens
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            {tripsCount}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statCard,
                            { backgroundColor: theme.colors.card },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textSoft,
                                marginBottom: 2,
                            }}
                        >
                            Desde
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.colors.text,
                                fontWeight: '600',
                            }}
                        >
                            {new Date(
                                profile.createdAt ?? Date.now()
                            ).toLocaleDateString('pt-BR')}
                        </Text>
                    </View>
                </View>

                {/* FORM PERFIL */}
                <View style={{ marginTop: 20 }}>
                    <View style={styles.formHeaderRow}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: theme.colors.text },
                            ]}
                        >
                            Sobre você
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                editing
                                    ? handleSaveProfile()
                                    : setEditing(true)
                            }
                            activeOpacity={0.9}
                            style={[
                                styles.editButton,
                                {
                                    backgroundColor: editing
                                        ? theme.colors.primary
                                        : theme.colors.cardSoft,
                                },
                            ]}
                        >
                            <Ionicons
                                name={editing ? 'checkmark' : 'pencil'}
                                size={14}
                                color={
                                    editing
                                        ? '#FFFFFF'
                                        : theme.colors.textSoft
                                }
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginLeft: 4,
                                    color: editing
                                        ? '#FFFFFF'
                                        : theme.colors.textSoft,
                                    fontWeight: '500',
                                }}
                            >
                                {editing ? 'Salvar' : 'Editar'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nome */}
                    <View style={{ marginBottom: 14, marginTop: 8 }}>
                        <Text
                            style={[
                                styles.fieldLabel,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Nome
                        </Text>
                        <TextInput
                            editable={editing && !saving}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Seu nome"
                            placeholderTextColor={theme.colors.textMuted}
                            style={[
                                styles.input,
                                {
                                    borderColor: theme.colors.border,
                                    backgroundColor: editing
                                        ? theme.colors.card
                                        : theme.colors.cardSoft,
                                    color: theme.colors.text,
                                },
                            ]}
                        />
                    </View>

                    {/* País / cidade base */}
                    <View style={{ marginBottom: 14 }}>
                        <Text
                            style={[
                                styles.fieldLabel,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            De onde você é?
                        </Text>
                        <TextInput
                            editable={editing && !saving}
                            value={homeCountry}
                            onChangeText={setHomeCountry}
                            placeholder="Ex: Fortaleza, CE"
                            placeholderTextColor={theme.colors.textMuted}
                            style={[
                                styles.input,
                                {
                                    borderColor: theme.colors.border,
                                    backgroundColor: editing
                                        ? theme.colors.card
                                        : theme.colors.cardSoft,
                                    color: theme.colors.text,
                                },
                            ]}
                        />
                    </View>

                    {/* Bio */}
                    <View style={{ marginBottom: 14 }}>
                        <Text
                            style={[
                                styles.fieldLabel,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Bio
                        </Text>
                        <TextInput
                            editable={editing && !saving}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Conte um pouco sobre seu estilo de viagem, preferências, etc."
                            placeholderTextColor={theme.colors.textMuted}
                            multiline
                            style={[
                                styles.textArea,
                                {
                                    borderColor: theme.colors.border,
                                    backgroundColor: editing
                                        ? theme.colors.card
                                        : theme.colors.cardSoft,
                                    color: theme.colors.text,
                                },
                            ]}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    smallButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
    },
    avatarBigWrapper: {
        width: 96,
        height: 96,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarBigImage: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
    },
    avatarBigInitial: {
        fontSize: 34,
        fontWeight: '700',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 10,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    formHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    fieldLabel: {
        fontSize: 13,
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        height: 46,
        borderRadius: 999,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 14,
    },
    textArea: {
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
});
