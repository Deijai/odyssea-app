// app/(main)/trips/[id]/index.tsx
import { useTheme } from '@/hooks/useTheme';
import { useTripStore } from '@/stores/tripStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripTimelineScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme } = useTheme();
    const router = useRouter();
    const trip = useTripStore((s) => (id ? s.getTripById(id) : undefined));

    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    if (!id || !trip) {
        return null;
    }

    const hasPlaces = trip.places.length > 0;

    // Agrupar lugares por dia
    const placesByDay = useMemo(() => {
        if (!trip.places || trip.places.length === 0) return [];

        const sortedPlaces = [...trip.places].sort((a, b) =>
            a.dateTime.localeCompare(b.dateTime)
        );

        const days: { date: string; places: typeof trip.places }[] = [];

        sortedPlaces.forEach((place) => {
            const date = new Date(place.dateTime).toDateString();
            const existingDay = days.find((d) => d.date === date);

            if (existingDay) {
                existingDay.places.push(place);
            } else {
                days.push({ date, places: [place] });
            }
        });

        return days;
    }, [trip.places]);

    function handleAddFirst() {
        router.push({
            pathname: '/(main)/trips/places/add',
            params: { tripId: id },
        });
    }

    function handleOpenPlace(placeId: string) {
        router.push({
            pathname: '/(main)/trips/places/[placeId]',
            params: { placeId },
        });
    }

    if (!hasPlaces) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.emptyCard}>
                    <View
                        style={[
                            styles.emptyIconWrapper,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons name="pin-outline" size={28} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                        Comece registrando o primeiro lugar
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSoft }]}>
                        Adicione restaurantes, passeios, praias e todas as paradas que fizeram parte
                        dessa viagem.
                    </Text>

                    <TouchableOpacity
                        onPress={handleAddFirst}
                        activeOpacity={0.9}
                        style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
                    >
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                        <Text style={styles.emptyButtonText}>Adicionar primeiro local</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (placesByDay.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text, padding: 20 }}>Carregando...</Text>
            </View>
        );
    }

    const validDayIndex = Math.min(selectedDayIndex, placesByDay.length - 1);
    const currentDay = placesByDay[validDayIndex];

    if (!currentDay) {
        return null;
    }

    const currentDayDate = new Date(currentDay.date);

    // Dividir lugares em 2 colunas para layout masonry
    const leftColumn: typeof currentDay.places = [];
    const rightColumn: typeof currentDay.places = [];

    currentDay.places.forEach((place, index) => {
        if (index % 2 === 0) {
            leftColumn.push(place);
        } else {
            rightColumn.push(place);
        }
    });

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            edges={['top']}
        >
            {/* Header fixo */}
            <View style={styles.header}>
                <Text style={[styles.tripSubtitle, { color: theme.colors.textMuted }]}>
                    TRIP TO {trip.destination.toUpperCase()}
                </Text>
                <Text style={[styles.tripTitle, { color: theme.colors.text }]}>
                    {trip.title}
                </Text>

                {/* Navegador de dias */}
                <View
                    style={[
                        styles.dayNavigator,
                        {
                            backgroundColor: theme.colors.cardSoft,
                            borderColor: theme.colors.border,
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedDayIndex(Math.max(0, validDayIndex - 1))}
                        disabled={validDayIndex === 0}
                        style={styles.dayNavButton}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={18}
                            color={
                                validDayIndex === 0
                                    ? theme.colors.textMuted
                                    : theme.colors.textSoft
                            }
                        />
                    </TouchableOpacity>

                    <View style={styles.dayInfo}>
                        <Text style={[styles.dayDate, { color: theme.colors.textMuted }]}>
                            {currentDayDate
                                .toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    day: '2-digit',
                                })
                                .toUpperCase()}
                        </Text>
                        <Text style={[styles.dayNumber, { color: theme.colors.primary }]}>
                            Dia {validDayIndex + 1}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            setSelectedDayIndex(
                                Math.min(placesByDay.length - 1, validDayIndex + 1)
                            )
                        }
                        disabled={validDayIndex === placesByDay.length - 1}
                        style={styles.dayNavButton}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={
                                validDayIndex === placesByDay.length - 1
                                    ? theme.colors.textMuted
                                    : theme.colors.textSoft
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Grid Pinterest */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.masonryContainer}>
                    {/* Coluna esquerda */}
                    <View style={styles.column}>
                        {leftColumn.map((item) => (
                            <PlaceCard
                                key={item.id}
                                place={item}
                                theme={theme}
                                onPress={() => handleOpenPlace(item.id)}
                            />
                        ))}
                    </View>

                    {/* Coluna direita */}
                    <View style={styles.column}>
                        {rightColumn.map((item) => (
                            <PlaceCard
                                key={item.id}
                                place={item}
                                theme={theme}
                                onPress={() => handleOpenPlace(item.id)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                    router.push({
                        pathname: '/(main)/trips/places/add',
                        params: { tripId: id },
                    })
                }
                style={[
                    styles.fab,
                    {
                        backgroundColor: theme.colors.primary,
                        shadowColor: theme.colors.primary,
                    },
                ]}
            >
                <Ionicons name="add" size={26} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// Componente de Card individual
function PlaceCard({ place, theme, onPress }: any) {
    const date = new Date(place.dateTime);
    const hourText = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Altura aleatória para efeito masonry (entre 200-300)
    const hasImage = place.mediaUrls && place.mediaUrls[0];
    const imageHeight = hasImage ? Math.floor(Math.random() * 100) + 200 : 140;

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.card,
                },
            ]}
            onPress={onPress}
        >
            {/* Imagem */}
            {hasImage ? (
                <Image
                    source={{ uri: place.mediaUrls[0] }}
                    style={[styles.cardImage, { height: imageHeight }]}
                />
            ) : (
                <View
                    style={[
                        styles.cardImagePlaceholder,
                        { backgroundColor: theme.colors.cardSoft, height: imageHeight },
                    ]}
                >
                    <Ionicons
                        name={getCategoryIcon(place.category)}
                        size={32}
                        color={theme.colors.primary}
                    />
                </View>
            )}

            {/* Badge de categoria */}
            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                <Ionicons
                    name={getCategoryIcon(place.category)}
                    size={10}
                    color="#FFFFFF"
                />
                <Text style={styles.categoryText}>{place.category}</Text>
            </View>

            {/* Conteúdo */}
            <View style={styles.cardContent}>
                <Text style={[styles.cardTime, { color: theme.colors.primary }]}>
                    {hourText}
                </Text>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                    {place.name}
                </Text>
                <View style={styles.cardLocation}>
                    <Ionicons name="location" size={11} color={theme.colors.textMuted} />
                    <Text
                        style={[styles.cardLocationText, { color: theme.colors.textMuted }]}
                        numberOfLines={1}
                    >
                        {place.location.address.split(',')[0]}
                    </Text>
                </View>

                {/* Rating stars */}
                {place.rating > 0 && (
                    <View style={styles.ratingRow}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons
                                key={i}
                                name={i < place.rating ? 'star' : 'star-outline'}
                                size={11}
                                color={i < place.rating ? '#F59E0B' : theme.colors.border}
                            />
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

function getCategoryIcon(category: string): any {
    const icons: Record<string, any> = {
        Restaurante: 'restaurant',
        Praia: 'water',
        Passeio: 'walk',
        Hotel: 'bed',
        Transporte: 'car',
        Mirante: 'eye',
        Museu: 'business',
        Shopping: 'storefront',
        Outro: 'location',
    };
    return icons[category] || 'location';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    tripSubtitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    tripTitle: {
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 30,
        marginBottom: 16,
    },
    dayNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    dayNavButton: {
        padding: 8,
    },
    dayInfo: {
        alignItems: 'center',
    },
    dayDate: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingBottom: 100,
    },
    masonryContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    column: {
        flex: 1,
        gap: 12,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
    },
    cardImagePlaceholder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        gap: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cardContent: {
        padding: 12,
    },
    cardTime: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
        lineHeight: 20,
    },
    cardLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    cardLocationText: {
        fontSize: 11,
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    emptyCard: {
        marginTop: 80,
        marginHorizontal: 32,
        alignItems: 'center',
    },
    emptyIconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 18,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 999,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
});