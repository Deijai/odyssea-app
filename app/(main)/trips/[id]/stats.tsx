// app/(main)/trips/[id]/stats.tsx
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { useTheme } from '@/hooks/useTheme';
import { VisitedPlaceCategory } from '@/types/trip';

type CategoryStat = {
    category: VisitedPlaceCategory;
    count: number;
    color: string;
};

const CATEGORY_COLORS: Record<VisitedPlaceCategory, string> = {
    Passeio: '#F59E0B',
    Restaurante: '#EF4444',
    Praia: '#E07A5F',
    Hotel: '#6366F1',
    Transporte: '#0EA5E9',
    Mirante: '#22C55E',
    Museu: '#EC4899',
    Shopping: '#8B5CF6',
    Outro: '#6B7280',
};

export default function TripStatsScreen() {
    const { theme } = useTheme();
    const { trip } = useCurrentTrip();

    if (!trip) {
        return null;
    }

    const stats = useMemo(() => {
        const map = new Map<VisitedPlaceCategory, number>();
        trip.places.forEach((p) => {
            map.set(p.category, (map.get(p.category) ?? 0) + 1);
        });

        const result: CategoryStat[] = [];
        map.forEach((count, cat) => {
            result.push({
                category: cat,
                count,
                color: CATEGORY_COLORS[cat],
            });
        });
        return result.sort((a, b) => b.count - a.count);
    }, [trip.places]);

    const totalPlaces = trip.places.length;

    const sortedDates = trip.places
        .map((p) => p.dateTime)
        .sort((a, b) => a.localeCompare(b));

    const firstDate = sortedDates[0]
        ? new Date(sortedDates[0])
        : new Date(trip.startDate);
    const lastDate = sortedDates[sortedDates.length - 1]
        ? new Date(sortedDates[sortedDates.length - 1])
        : new Date(trip.endDate);

    const days =
        Math.max(
            1,
            Math.round(
                (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1
        ) || 1;

    const avgPerDay = totalPlaces === 0 ? 0 : totalPlaces / days;

    // Donut chart
    const radius = 46;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;

    let offsetAccumulator = 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ padding: 20 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: theme.colors.text,
                        marginBottom: 4,
                    }}
                >
                    Estatísticas da viagem
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        color: theme.colors.textSoft,
                        marginBottom: 16,
                    }}
                >
                    Uma visão geral de como você explorou este destino.
                </Text>

                <View style={styles.row}>
                    <View
                        style={[
                            styles.metricCard,
                            { backgroundColor: theme.colors.card },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textSoft,
                                marginBottom: 4,
                            }}
                        >
                            Locais visitados
                        </Text>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            {totalPlaces}
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                color: theme.colors.textMuted,
                                marginTop: 2,
                            }}
                        >
                            {days} dia(s) de viagem
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.metricCard,
                            { backgroundColor: theme.colors.card },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textSoft,
                                marginBottom: 4,
                            }}
                        >
                            Média por dia
                        </Text>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: '700',
                                color: theme.colors.text,
                            }}
                        >
                            {avgPerDay.toFixed(1)}
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                color: theme.colors.textMuted,
                                marginTop: 2,
                            }}
                        >
                            Locais adicionados
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.chartCard,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 10,
                        }}
                    >
                        Distribuição por categoria
                    </Text>

                    {totalPlaces === 0 ? (
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textSoft,
                            }}
                        >
                            Ainda não há dados suficientes. Adicione alguns locais para ver a
                            distribuição.
                        </Text>
                    ) : (
                        <View style={styles.chartRow}>
                            <Svg height={120} width={120} viewBox="0 0 120 120">
                                <G rotation="-90" origin="60,60">
                                    <Circle
                                        cx="60"
                                        cy="60"
                                        r={radius}
                                        stroke={theme.colors.cardSoft}
                                        strokeWidth={strokeWidth}
                                        fill="transparent"
                                    />
                                    {stats.map((s) => {
                                        const pct = s.count / totalPlaces;
                                        const dash = pct * circumference;
                                        const strokeDasharray = `${dash} ${circumference - dash}`;
                                        const strokeDashoffset = offsetAccumulator;
                                        offsetAccumulator -= dash;

                                        return (
                                            <Circle
                                                key={s.category}
                                                cx="60"
                                                cy="60"
                                                r={radius}
                                                stroke={s.color}
                                                strokeWidth={strokeWidth}
                                                strokeDasharray={strokeDasharray}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                fill="transparent"
                                            />
                                        );
                                    })}
                                </G>
                            </Svg>

                            <View style={{ marginLeft: 16, flex: 1 }}>
                                {stats.map((s) => {
                                    const pct = (s.count / totalPlaces) * 100;
                                    return (
                                        <View key={s.category} style={styles.legendRow}>
                                            <View
                                                style={[
                                                    styles.legendDot,
                                                    { backgroundColor: s.color },
                                                ]}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: theme.colors.text,
                                                    flex: 1,
                                                }}
                                            >
                                                {s.category}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: theme.colors.textSoft,
                                                }}
                                            >
                                                {s.count} ({pct.toFixed(0)}%)
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    metricCard: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        marginRight: 10,
    },
    chartCard: {
        borderRadius: 16,
        padding: 12,
        marginTop: 4,
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        marginRight: 6,
    },
});
