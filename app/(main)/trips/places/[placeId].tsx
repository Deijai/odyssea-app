// app/(main)/trips/places/[placeId].tsx
import { RatingStars } from '@/components/ui/RatingStars';
import { useTheme } from '@/hooks/useTheme';
import { useTripStore } from '@/stores/tripStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PlaceDetailScreen() {
    const { placeId } = useLocalSearchParams<{ placeId: string }>();
    const { theme } = useTheme();
    const router = useRouter();

    // ✅ Busca direta sem desestruturação que pode causar loops
    const findTripByPlaceId = useTripStore((s) => s.findTripByPlaceId);
    const result = placeId ? findTripByPlaceId(placeId) : null;

    // ✅ useRef para evitar múltiplas chamadas de navegação
    const hasNavigated = useRef(false);

    useEffect(() => {
        if ((!placeId || !result) && !hasNavigated.current) {
            hasNavigated.current = true;
            router.replace('/(main)');
        }
    }, [placeId, result]);

    if (!placeId || !result) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.text }}>Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { trip, place } = result;

    const date = new Date(place.dateTime);
    const dateText = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    const hourText = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[
                            styles.iconButton,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.headerTitle,
                            { color: theme.colors.text },
                        ]}
                        numberOfLines={1}
                    >
                        Detalhe do local
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {place.mediaUrls && place.mediaUrls[0] ? (
                    <Image
                        source={{ uri: place.mediaUrls[0] }}
                        style={styles.coverImage}
                    />
                ) : (
                    <View
                        style={[
                            styles.coverPlaceholder,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons
                            name="image-outline"
                            size={38}
                            color={theme.colors.textMuted}
                        />
                    </View>
                )}

                <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text
                                style={[
                                    styles.placeName,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {place.name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.textSoft,
                                    marginTop: 2,
                                }}
                            >
                                {place.category} • {trip.destination}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.badge,
                                { backgroundColor: theme.colors.cardSoft },
                            ]}
                        >
                            <Ionicons name="calendar-outline" size={14} color={theme.colors.textSoft} />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.textSoft,
                                    marginLeft: 4,
                                }}
                            >
                                {dateText}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={16} color={theme.colors.textSoft} />
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textSoft,
                                marginLeft: 4,
                            }}
                        >
                            {hourText}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color={theme.colors.textSoft} />
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textSoft,
                                marginLeft: 4,
                            }}
                        >
                            {place.location.address}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <RatingStars value={place.rating} />
                    </View>

                    {place.tags && place.tags.length > 0 && (
                        <View style={styles.tagRow}>
                            {place.tags.map((tag) => (
                                <View
                                    key={tag}
                                    style={[
                                        styles.tagChip,
                                        { backgroundColor: theme.colors.cardSoft },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.textSoft,
                                        }}
                                    >
                                        #{tag}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {place.notes ? (
                        <View style={{ marginTop: 18 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text,
                                    fontWeight: '600',
                                    marginBottom: 6,
                                }}
                            >
                                Notas da visita
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.textSoft,
                                    lineHeight: 20,
                                }}
                            >
                                {place.notes}
                            </Text>
                        </View>
                    ) : null}

                    <View
                        style={[
                            styles.mapPlaceholder,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                    >
                        <Ionicons name="map-outline" size={22} color={theme.colors.textMuted} />
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textMuted,
                                marginTop: 4,
                            }}
                        >
                            Mapa deste local (em breve)
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const COVER_HEIGHT = 220;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 8,
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
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    coverImage: {
        width: '100%',
        height: COVER_HEIGHT,
    },
    coverPlaceholder: {
        width: '100%',
        height: COVER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    placeName: {
        fontSize: 20,
        fontWeight: '700',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tagChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 6,
        marginBottom: 4,
    },
    mapPlaceholder: {
        marginTop: 24,
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});