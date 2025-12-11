// app/(main)/trips/places/success.tsx
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PlaceSuccessScreen() {
    const { theme } = useTheme();
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const router = useRouter();

    useEffect(() => {
        if (!tripId) {
            router.replace('/(main)');
        }
    }, [tripId]);

    if (!tripId) return null;

    function goToTimeline() {
        router.replace({
            pathname: '/(main)/trips/[id]',
            params: { id: tripId },
        });
    }

    function addAnother() {
        router.replace({
            pathname: '/(main)/trips/places/add',
            params: { tripId },
        });
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <View
                    style={[
                        styles.iconWrapper,
                        { backgroundColor: theme.colors.cardSoft },
                    ]}
                >
                    <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
                </View>

                <Text
                    style={[
                        styles.title,
                        { color: theme.colors.text },
                    ]}
                >
                    Memória salva com sucesso ✨
                </Text>
                <Text
                    style={[
                        styles.subtitle,
                        { color: theme.colors.textSoft },
                    ]}
                >
                    Sua viagem ganhou mais um capítulo na linha do tempo. Você pode ver o detalhe
                    agora ou continuar adicionando locais.
                </Text>

                <ThemedButton
                    title="Ver na linha do tempo"
                    onPress={goToTimeline}
                    style={{ marginTop: 10 }}
                />

                <TouchableOpacity onPress={addAnother} style={{ marginTop: 14 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.primary,
                            fontWeight: '500',
                        }}
                    >
                        Adicionar outro local
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 18,
    },
});
