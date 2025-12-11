// app/(main)/index.tsx
import { useTheme } from '@/hooks/useTheme';
import { useTripStore } from '@/stores/tripStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterKey = 'todas' | 'upcoming' | 'current' | 'completed';

const NUM_COLUMNS = 2;

export default function TripsHomeScreen() {
    const { theme, toggleTheme, isDark } = useTheme();
    const { trips, setSelectedTrip } = useTripStore();
    const router = useRouter();

    const [filter, setFilter] = useState<FilterKey>('todas');

    function handleOpenTrip(id: string) {
        setSelectedTrip(id);
        router.push({
            pathname: '/(main)/trips/[id]',
            params: { id },
        });
    }

    const filteredTrips = useMemo(() => {
        if (filter === 'todas') return trips;
        if (filter === 'upcoming') return trips.filter((t) => t.status === 'Upcoming');
        if (filter === 'current') return trips.filter((t) => t.status === 'Current');
        if (filter === 'completed') return trips.filter((t) => t.status === 'Completed');
        return trips;
    }, [filter, trips]);

    function mapStatusToLabel(status: string) {
        switch (status) {
            case 'Upcoming':
                return 'Em breve';
            case 'Current':
                return 'Em andamento';
            case 'Completed':
                return 'Concluída';
            default:
                return status;
        }
    }

    function mapStatusToColor(status: string) {
        switch (status) {
            case 'Upcoming':
                return theme.colors.primarySoft;
            case 'Current':
                return '#22c55e55';
            case 'Completed':
                return '#10b98155';
            default:
                return 'rgba(15,23,42,0.5)';
        }
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text
                        style={[
                            styles.greeting,
                            { color: theme.colors.textSoft },
                        ]}
                    >
                        Olá, viajante 👋
                    </Text>
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.text },
                        ]}
                    >
                        Seu diário de bordo
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[
                            styles.iconButton,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                        activeOpacity={0.9}
                    >
                        <Ionicons
                            name={isDark ? 'sunny-outline' : 'moon-outline'}
                            size={18}
                            color={theme.colors.textSoft}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* RESUMO */}
            <View
                style={[
                    styles.summaryCard,
                    { backgroundColor: theme.colors.card },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.colors.textSoft,
                            marginBottom: 4,
                        }}
                    >
                        Viagens registradas
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: theme.colors.text,
                        }}
                    >
                        {trips.length}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.colors.textMuted,
                            marginTop: 2,
                        }}
                    >
                        Continue registrando seus momentos pelo mundo.
                    </Text>
                </View>

                <View style={styles.summaryIconBox}>
                    <Ionicons name="earth-outline" size={24} color="#FFFFFF" />
                </View>
            </View>

            {/* FILTROS */}
            <View style={styles.filtersRow}>
                <FilterChip
                    label="Todas"
                    active={filter === 'todas'}
                    onPress={() => setFilter('todas')}
                    theme={theme}
                />
                <FilterChip
                    label="Em breve"
                    active={filter === 'upcoming'}
                    onPress={() => setFilter('upcoming')}
                    theme={theme}
                />
                <FilterChip
                    label="Em andamento"
                    active={filter === 'current'}
                    onPress={() => setFilter('current')}
                    theme={theme}
                />
                <FilterChip
                    label="Concluídas"
                    active={filter === 'completed'}
                    onPress={() => setFilter('completed')}
                    theme={theme}
                />
            </View>

            {/* LISTA DE VIAGENS - ESTILO PINTEREST */}
            <FlatList
                key={`trips-grid-${NUM_COLUMNS}`} // 👈 força recriar se NUM_COLUMNS mudar
                data={filteredTrips}
                keyExtractor={(item) => item.id}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={styles.masonryRow}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    // alturas variáveis para efeito "masonry"
                    const cardHeight =
                        index % 3 === 0 ? 230 : index % 3 === 1 ? 180 : 260;

                    return (
                        <TouchableOpacity
                            onPress={() => handleOpenTrip(item.id)}
                            activeOpacity={0.9}
                            style={styles.masonryItem}
                        >
                            <ImageBackground
                                source={{ uri: item.coverPhotoUrl }}
                                style={[styles.cardImage, { height: cardHeight }]}
                                imageStyle={{ borderRadius: 18 }}
                            >
                                <View
                                    style={[
                                        styles.cardOverlay,
                                        { backgroundColor: theme.colors.overlay },
                                    ]}
                                />

                                <View style={styles.cardContent}>
                                    <View>
                                        <Text
                                            style={[
                                                styles.cardDestination,
                                                { color: '#E5E7EB' },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {item.destination}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.cardTitle,
                                                { color: '#FFFFFF' },
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.chipRow}>
                                            <View
                                                style={[
                                                    styles.chip,
                                                    {
                                                        backgroundColor: mapStatusToColor(
                                                            item.status,
                                                        ),
                                                    },
                                                ]}
                                            >
                                                <Ionicons
                                                    name="time-outline"
                                                    size={14}
                                                    color="#F9FAFB"
                                                />
                                                <Text style={styles.chipText}>
                                                    {mapStatusToLabel(item.status)}
                                                </Text>
                                            </View>

                                            {item.tags.slice(0, 1).map((tag) => (
                                                <View
                                                    key={tag}
                                                    style={styles.chipSoft}
                                                >
                                                    <Text style={styles.chipSoftText}>
                                                        #{tag}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: theme.colors.textSoft,
                                marginBottom: 6,
                            }}
                        >
                            Nenhuma viagem por aqui ainda.
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textMuted,
                            }}
                        >
                            Toque no botão + para criar sua primeira jornada e começar o
                            diário de bordo.
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/(main)/create-trip')}
                style={[
                    styles.fab,
                    {
                        backgroundColor: theme.colors.primary,
                        ...(theme.shadow?.soft ?? {}),
                    },
                ]}
            >
                <Ionicons name="add" size={26} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

type FilterChipProps = {
    label: string;
    active: boolean;
    onPress: () => void;
    theme: ReturnType<typeof useTheme>['theme'];
};

function FilterChip({ label, active, onPress, theme }: FilterChipProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[
                styles.filterChip,
                {
                    backgroundColor: active
                        ? theme.colors.primary
                        : theme.colors.cardSoft,
                },
            ]}
        >
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: active ? '#FFFFFF' : theme.colors.textSoft,
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 13,
        fontWeight: '500',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryCard: {
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIconBox: {
        width: 44,
        height: 44,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        backgroundColor: '#E07A5F',
    },
    filtersRow: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        marginBottom: 10,
        gap: 8,
        flexWrap: 'wrap',
    },
    filterChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    // GRID / PINTEREST
    masonryRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    masonryItem: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 18,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    cardDestination: {
        fontSize: 12,
        fontWeight: '500',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    chipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 6,
    },
    chipText: {
        fontSize: 11,
        color: '#F9FAFB',
        marginLeft: 4,
    },
    chipSoft: {
        backgroundColor: 'rgba(249, 250, 251, 0.20)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 6,
        marginTop: 4,
    },
    chipSoftText: {
        fontSize: 11,
        color: '#F9FAFB',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
