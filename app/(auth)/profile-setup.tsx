// app/(auth)/profile-setup.tsx
import { InputField } from '@/components/ui/InputField';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

export default function ProfileSetupScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    const { profile, updateProfile, updateAvatar } = useAuthStore();

    const [displayName, setDisplayName] = useState(
        profile?.displayName ?? ''
    );
    const [homeCountry, setHomeCountry] = useState(
        profile?.homeCountry ?? ''
    );
    const [bio, setBio] = useState(profile?.bio ?? '');
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
        profile?.avatarUrl
    );
    const [loading, setLoading] = useState(false);

    const effectiveAvatarUri = avatarUrl || profile?.avatarUrl;

    async function handlePickAvatar() {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // opção nova:
            // mediaTypes: [ImagePicker.MediaType.IMAGE],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setLoading(true);
            try {
                await updateAvatar(uri);
                setAvatarUrl(uri);
            } finally {
                setLoading(false);
            }
        }
    }

    async function handleContinue() {
        setLoading(true);
        try {
            await updateProfile({
                displayName:
                    displayName.trim() ||
                    profile?.displayName ||
                    '',
                homeCountry: homeCountry.trim(),
                bio: bio.trim(),
            });

            // Aqui já manda pro main; o RootLayout só vai deixar
            // se isProfileComplete(profile) for true
            router.replace('/(main)');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scroll}
                >
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        Personalize seu perfil 🌍
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: theme.colors.textSoft },
                        ]}
                    >
                        Adicione uma foto e alguns detalhes para
                        deixar seu diário de viagem com a sua cara.
                    </Text>

                    <View style={styles.avatarContainer}>
                        <TouchableOpacity
                            onPress={handlePickAvatar}
                            style={[
                                styles.avatarButton,
                                {
                                    borderColor: theme.colors.primary,
                                    backgroundColor:
                                        theme.colors.cardSoft,
                                },
                            ]}
                            disabled={loading}
                        >
                            {effectiveAvatarUri ? (
                                <View style={styles.avatarPreview}>
                                    <Image
                                        source={{ uri: effectiveAvatarUri }}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: 999,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={theme.colors.primary}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: theme.colors.textSoft,
                                                marginLeft: 6,
                                            }}
                                        >
                                            Foto selecionada
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Ionicons
                                        name="camera-outline"
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                    <Text
                                        style={{
                                            marginTop: 6,
                                            fontSize: 13,
                                            color: theme.colors.text,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Adicionar foto
                                    </Text>
                                    <Text
                                        style={{
                                            marginTop: 2,
                                            fontSize: 11,
                                            color: theme.colors.textMuted,
                                        }}
                                    >
                                        Recomendo quadrada • 1:1
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <InputField
                            label="Como devemos te chamar?"
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Nome para exibir"
                        />

                        <View style={{ marginBottom: 14 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginBottom: 6,
                                    fontWeight: '500',
                                    color: theme.colors.textSoft,
                                }}
                            >
                                País base
                            </Text>
                            <TextInput
                                placeholder="Ex: Brasil"
                                placeholderTextColor={
                                    theme.colors.textMuted
                                }
                                value={homeCountry}
                                onChangeText={setHomeCountry}
                                style={{
                                    height: 48,
                                    borderRadius: 999,
                                    paddingHorizontal: 16,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                    color: theme.colors.text,
                                    fontSize: 15,
                                }}
                            />
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
                                Bio
                            </Text>
                            <TextInput
                                placeholder="Conte um pouco sobre você, seu estilo de viagem..."
                                placeholderTextColor={
                                    theme.colors.textMuted
                                }
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                                style={{
                                    minHeight: 90,
                                    borderRadius: 16,
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.card,
                                    color: theme.colors.text,
                                    fontSize: 14,
                                    textAlignVertical: 'top',
                                }}
                            />
                        </View>

                        <ThemedButton
                            title="Concluir"
                            onPress={handleContinue}
                            loading={loading}
                            style={{ marginTop: 10 }}
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
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarButton: {
        width: 160,
        height: 160,
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPreview: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        marginTop: 4,
    },
});
