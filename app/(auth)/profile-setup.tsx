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
    const { user, updateProfile } = useAuthStore();

    const [displayName, setDisplayName] = useState(user?.name ?? '');
    const [homeCountry, setHomeCountry] = useState(user?.homeCountry ?? '');
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
    const [loading, setLoading] = useState(false);

    async function handlePickAvatar() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setAvatarUrl(result.assets[0].uri);
        }
    }

    function handleContinue() {
        setLoading(true);
        updateProfile({
            name: displayName.trim() || user?.name,
            avatarUrl,
            homeCountry: homeCountry.trim(),
        });
        setLoading(false);
        router.replace('/(main)');
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
                        Adicione uma foto e alguns detalhes para deixar seu diário de viagem com a sua cara.
                    </Text>

                    <View style={styles.avatarContainer}>
                        <TouchableOpacity
                            onPress={handlePickAvatar}
                            style={[
                                styles.avatarButton,
                                {
                                    borderColor: theme.colors.primary,
                                    backgroundColor: theme.colors.cardSoft,
                                },
                            ]}
                        >
                            {avatarUrl ? (
                                <View
                                    style={[
                                        styles.avatarPreview,
                                        { backgroundColor: theme.colors.card },
                                    ]}
                                >
                                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.textSoft,
                                            marginTop: 6,
                                        }}
                                    >
                                        Foto selecionada
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <Ionicons name="camera-outline" size={22} color={theme.colors.primary} />
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
                                placeholderTextColor={theme.colors.textMuted}
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
    },
    form: {
        marginTop: 4,
    },
});
