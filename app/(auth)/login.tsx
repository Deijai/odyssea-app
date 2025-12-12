// app/(auth)/login.tsx
import { InputField } from '@/components/ui/InputField';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const heroImage =
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80';

export default function LoginScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { signIn } = useAuthStore();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        try {
            setLoading(true);
            await signIn({ email: email.trim(), password: senha });
            router.replace('/(main)');
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground source={{ uri: heroImage }} style={styles.hero} resizeMode="cover">
            <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
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
                                    { backgroundColor: 'rgba(255,255,255,0.15)' },
                                ]}
                            >
                                <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.logoContainer}>
                                <View
                                    style={[
                                        styles.logoCircle,
                                        { backgroundColor: theme.colors.primarySoft },
                                    ]}
                                >
                                    <Ionicons
                                        name="leaf-outline"
                                        size={18}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <Text style={[styles.logoText, { color: '#FFFFFF' }]}>
                                    ODYSSEA
                                </Text>
                            </View>

                            <View style={{ width: 36 }} />
                        </View>

                        {/* TÍTULOS */}
                        <View style={styles.copyBlock}>
                            <Text style={[styles.title, { color: '#FFFFFF' }]}>
                                Bem-vindo de volta 👋
                            </Text>
                            <Text style={[styles.subtitle, { color: '#E5E7EB' }]}>
                                Acesse seu diário de viagem e continue registrando suas aventuras.
                            </Text>
                        </View>

                        {/* FORM EM CARD DISCRETO */}
                        <View
                            style={[
                                styles.formCard,
                                {
                                    backgroundColor: 'rgba(15,23,42,0.45)',
                                    borderColor: 'rgba(148,163,184,0.35)',
                                },
                            ]}
                        >
                            <InputField
                                label="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="seu@email.com"
                            />

                            <InputField
                                label="Senha"
                                secureTextEntry
                                value={senha}
                                onChangeText={setSenha}
                                placeholder="••••••••"
                            />

                            <View style={styles.forgotRow}>
                                <TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.primary,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Esqueci minha senha
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <ThemedButton
                                title="Entrar"
                                onPress={handleLogin}
                                loading={loading}
                                style={{ marginTop: 14 }}
                            />
                        </View>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    textAlign: 'center',
                                    color: '#E5E7EB',
                                }}
                            >
                                Ainda não tem conta?{' '}
                                <Text
                                    style={{
                                        color: theme.colors.primary,
                                        fontWeight: '600',
                                    }}
                                    onPress={() => router.push('/(auth)/signup')}
                                >
                                    Criar conta
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    hero: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    scroll: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    logoText: {
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: '600',
    },
    copyBlock: {
        marginBottom: 14,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 260,
    },
    formCard: {
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        marginTop: 8,
        // sombra bem leve
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    forgotRow: {
        marginTop: 6,
        alignItems: 'flex-end',
    },
    footer: {
        marginTop: 20,
    },
});
