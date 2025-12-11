// app/(main)/trips/[id]/map.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { useTheme } from '@/hooks/useTheme';

export default function TripMapPlaceholderScreen() {
    const { theme } = useTheme();
    const { trip } = useCurrentTrip();

    if (!trip) {
        // Se não achou a viagem, não renderiza nada
        return null;
    }

    const hasPlaces = trip.places.length > 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons name="map-outline" size={26} color={theme.colors.primary} />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        Mapa da viagem
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: theme.colors.textSoft },
                        ]}
                    >
                        Aqui você verá seus locais plotados em um mapa interativo assim que
                        configurarmos o módulo nativo de mapas.
                    </Text>
                </View>

                {/* CARD DE STATUS */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 6,
                        }}
                    >
                        Status atual
                    </Text>

                    <View style={styles.row}>
                        <Ionicons
                            name={hasPlaces ? 'checkmark-circle-outline' : 'information-circle-outline'}
                            size={18}
                            color={hasPlaces ? theme.colors.primary : theme.colors.textSoft}
                        />
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 13,
                                marginLeft: 6,
                                color: theme.colors.textSoft,
                            }}
                        >
                            {hasPlaces
                                ? `Você já tem ${trip.places.length} locais cadastrados nesta viagem. Em breve eles aparecerão organizados em um mapa interativo aqui.`
                                : 'Ainda não há locais cadastrados nesta viagem. Adicione pelo menos um local na aba de Linha do tempo para visualizar no mapa futuramente.'}
                        </Text>
                    </View>
                </View>

                {/* CARD DE ORIENTAÇÃO TÉCNICA */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Integração com mapa (pendente)
                    </Text>

                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.textSoft,
                            marginBottom: 6,
                        }}
                    >
                        Para ativar o mapa com pins reais, vamos precisar:
                    </Text>

                    <View style={styles.bulletRow}>
                        <Text style={[styles.bulletDot, { color: theme.colors.primary }]}>
                            •
                        </Text>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 13,
                                color: theme.colors.textSoft,
                            }}
                        >
                            Configurar um build de desenvolvimento (dev client) com suporte ao{' '}
                            <Text style={{ fontWeight: '600' }}>react-native-maps</Text>.
                        </Text>
                    </View>

                    <View style={styles.bulletRow}>
                        <Text style={[styles.bulletDot, { color: theme.colors.primary }]}>
                            •
                        </Text>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 13,
                                color: theme.colors.textSoft,
                            }}
                        >
                            Ajustar o arquivo <Text style={{ fontWeight: '600' }}>map.tsx</Text>{' '}
                            para usar o componente <Text style={{ fontWeight: '600' }}>MapView</Text>{' '}
                            com markers baseado na lista de locais da viagem.
                        </Text>
                    </View>

                    <View style={styles.bulletRow}>
                        <Text style={[styles.bulletDot, { color: theme.colors.primary }]}>
                            •
                        </Text>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 13,
                                color: theme.colors.textSoft,
                            }}
                        >
                            Opcionalmente, registrar uma chave do Google Maps (Android / iOS) para
                            estilos avançados.
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.colors.textMuted,
                            marginTop: 10,
                        }}
                    >
                        Enquanto isso, você pode continuar usando normalmente as outras abas da
                        viagem (Linha do tempo, Galeria, Notas, Stats).
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
    },
    card: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    bulletDot: {
        marginRight: 6,
        fontSize: 14,
    },
});
