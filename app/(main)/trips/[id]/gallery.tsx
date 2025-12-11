// app/(main)/trips/[id]/gallery.tsx
import { CategoryChip } from '@/components/ui/CategoryChip';
import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { useTheme } from '@/hooks/useTheme';
import { VisitedPlaceCategory } from '@/types/trip';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type MediaItem = {
    id: string;
    uri: string;
    category: VisitedPlaceCategory;
    date: string;
};

export default function TripGalleryScreen() {
    const { theme } = useTheme();
    const { trip } = useCurrentTrip();

    const [selectedCategory, setSelectedCategory] = useState<VisitedPlaceCategory | 'Todas'>(
        'Todas'
    );
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

    if (!trip) {
        return null;
    }

    const allMedia: MediaItem[] = useMemo(() => {
        const items: MediaItem[] = [];
        trip.places.forEach((place) => {
            place.mediaUrls.forEach((uri, idx) => {
                items.push({
                    id: `${place.id}-${idx}`,
                    uri,
                    category: place.category,
                    date: place.dateTime,
                });
            });
        });
        return items;
    }, [trip.places]);

    const filteredMedia =
        selectedCategory === 'Todas'
            ? allMedia
            : allMedia.filter((m) => m.category === selectedCategory);

    if (allMedia.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: theme.colors.text,
                        marginBottom: 6,
                    }}
                >
                    Nenhuma mídia ainda
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: theme.colors.textSoft,
                        textAlign: 'center',
                        paddingHorizontal: 32,
                    }}
                >
                    Ao adicionar fotos e vídeos aos locais visitados, eles vão aparecer aqui em forma
                    de galeria.
                </Text>
            </View>
        );
    }

    const categories: (VisitedPlaceCategory | 'Todas')[] = [
        'Todas',
        'Passeio',
        'Restaurante',
        'Praia',
        'Hotel',
        'Transporte',
        'Mirante',
        'Museu',
        'Shopping',
        'Outro',
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                ListHeaderComponent={
                    <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 8,
                            }}
                        >
                            Sua galeria de memórias
                        </Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={{ marginRight: 8 }}>
                                    {item === 'Todas' ? (
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setSelectedCategory('Todas')}
                                            style={[
                                                styles.chip,
                                                {
                                                    backgroundColor:
                                                        selectedCategory === 'Todas'
                                                            ? theme.colors.primary
                                                            : theme.colors.cardSoft,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: '500',
                                                    color:
                                                        selectedCategory === 'Todas'
                                                            ? '#FFFFFF'
                                                            : theme.colors.textSoft,
                                                }}
                                            >
                                                Todas
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <CategoryChip
                                            label={item}
                                            selected={selectedCategory === item}
                                            onPress={() => setSelectedCategory(item)}
                                        />
                                    )}
                                </View>
                            )}
                        />
                    </View>
                }
                data={filteredMedia}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 60 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => setSelectedMedia(item)}
                        style={{ width: '32%', aspectRatio: 1, marginBottom: 8 }}
                    >
                        <Image
                            source={{ uri: item.uri }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                        />
                    </Pressable>
                )}
            />

            <Modal
                visible={!!selectedMedia}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedMedia(null)}
            >
                <View
                    style={[
                        styles.modalBackdrop,
                        { backgroundColor: theme.colors.overlay },
                    ]}
                >
                    <Pressable style={{ flex: 1 }} onPress={() => setSelectedMedia(null)} />
                    {selectedMedia && (
                        <View
                            style={[
                                styles.modalContent,
                                { backgroundColor: theme.colors.card },
                            ]}
                        >
                            <Image
                                source={{ uri: selectedMedia.uri }}
                                style={styles.modalImage}
                                resizeMode="cover"
                            />
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.textSoft,
                                    marginTop: 6,
                                    textAlign: 'center',
                                }}
                            >
                                {selectedMedia.category} •{' '}
                                {new Date(selectedMedia.date).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        borderRadius: 18,
        padding: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: 260,
        borderRadius: 14,
    },
});
