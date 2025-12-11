// app/(auth)/index.tsx
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const heroImage =
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80';

export default function OnboardingScreen() {
    const { theme, toggleTheme, isDark } = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ImageBackground source={{ uri: heroImage }} style={styles.hero} resizeMode="cover">
                <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]} />

                <SafeAreaView style={styles.safe}>
                    {/* HEADER */}
                    <View style={styles.headerRow}>
                        <View style={{ width: 36 }} />

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
                            <Text style={[styles.logoText, { color: '#F9FAFB' }]}>ODYSSEA</Text>
                        </View>

                        <TouchableOpacity
                            onPress={toggleTheme}
                            style={[
                                styles.themeToggle,
                                { backgroundColor: theme.colors.cardSoft },
                            ]}
                        >
                            <Ionicons
                                name={isDark ? 'sunny-outline' : 'moon-outline'}
                                size={18}
                                color={theme.colors.textSoft}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* CONTEÚDO CENTRAL */}
                    <View style={styles.main}>
                        <View style={styles.copyContainer}>
                            <Text style={styles.kickerText}>Seu diário de viagem visual</Text>

                            <Text style={styles.title}>
                                Sua jornada,{'\n'}
                                <Text style={{ color: theme.colors.primary }}>seu mapa.</Text>
                            </Text>

                            <View style={styles.subtitleWrapper}>
                                <Text style={styles.subtitleTitle}>Acompanhe seus lugares</Text>
                                <Text style={styles.subtitle}>
                                    Marque seus pontos favoritos no mapa e nunca esqueça os
                                    cantinhos que você descobriu pelo caminho.
                                </Text>
                            </View>
                        </View>

                        {/* CTA / BOTÕES */}
                        <View style={styles.footer}>
                            <ThemedButton
                                title="Criar conta"
                                onPress={() => router.push('/(auth)/signup')}
                                variant="primary"
                                style={styles.primaryButton}
                                rightIcon={
                                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                                }
                            />

                            <ThemedButton
                                title="Login"
                                onPress={() => router.push('/(auth)/login')}
                                variant="ghost"
                                style={{
                                    marginBottom: 12,
                                    backgroundColor: 'rgba(15,23,42,0.7)',
                                    borderColor: 'rgba(148,163,184,0.85)',
                                }}
                                textStyle={{ color: '#F9FAFB' }}
                            />

                            <Text style={styles.termsText}>
                                Ao continuar, você concorda com nossos{' '}
                                <Text style={styles.termsLink}>Termos</Text> &{' '}
                                <Text style={styles.termsLink}>Política de Privacidade</Text>.
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hero: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    safe: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
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
    themeToggle: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    main: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    copyContainer: {
        marginTop: 40,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    kickerText: {
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: '#E5E7EB',
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 34,
        textAlign: 'center',
        color: '#F9FAFB',
        marginBottom: 16,
    },
    subtitleWrapper: {
        maxWidth: 280,
        alignItems: 'center',
    },
    subtitleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        color: '#E5E7EB',
    },
    footer: {
        marginTop: 16,
    },
    primaryButton: {
        marginBottom: 10,
    },
    termsText: {
        fontSize: 11,
        textAlign: 'center',
        color: '#D1D5DB',
    },
    termsLink: {
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
});
