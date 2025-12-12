// app/(auth)/sign-in.tsx
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

import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

export default function SignInScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { signIn, status, error, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isLoading = submitting || status === 'checking';

    async function handleSignIn() {
        if (!email || !password) return;

        setSubmitting(true);
        clearError();

        await signIn({ email: email.trim(), password });

        setSubmitting(false);
        // Não navega aqui: RootLayout vai redirecionar conforme status/perfil
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
                    {/* HEADER / LOGO / TÍTULO */}
                    <View style={styles.header}>
                        <Text
                            style={[
                                styles.title,
                                { color: theme.colors.text },
                            ]}
                        >
                            Bem-vindo ao Odyssea 🌍
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Entre para continuar planejando e registrando suas
                            viagens.
                        </Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>
                        <Text
                            style={[
                                styles.label,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            E-mail
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={theme.colors.textMuted}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text,
                                },
                            ]}
                        />

                        <Text
                            style={[
                                styles.label,
                                { color: theme.colors.textSoft },
                            ]}
                        >
                            Senha
                        </Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Sua senha"
                            secureTextEntry
                            placeholderTextColor={theme.colors.textMuted}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text,
                                },
                            ]}
                        />

                        {error && (
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.danger ?? '#ef4444',
                                    marginTop: 4,
                                }}
                            >
                                {error}
                            </Text>
                        )}

                        <ThemedButton
                            title="Entrar"
                            onPress={handleSignIn}
                            loading={isLoading}
                            style={{ marginTop: 20 }}
                        />

                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/signup')}
                            style={{ marginTop: 16, alignItems: 'center' }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.textSoft,
                                }}
                            >
                                Ainda não tem conta?{' '}
                                <Text
                                    style={{
                                        color: theme.colors.primary,
                                        fontWeight: '600',
                                    }}
                                >
                                    Criar conta
                                </Text>
                            </Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
    },
    header: {
        marginBottom: 28,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
    },
    form: {
        marginTop: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderRadius: 999,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 15,
    },
});
