// app/(main)/trips/[id]/gallery.tsx
import { CategoryChip } from '@/components/ui/CategoryChip';
import { useTheme } from '@/hooks/useTheme';
import { useTripPlaces } from '@/hooks/useTripPlaces';
import { VisitedPlaceCategory } from '@/types/trip';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MediaItem = {
    id: string;
    uri: string;
    category: VisitedPlaceCategory;
    date: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TripGalleryScreen() {
    const { theme } = useTheme();
    const { tripPlaces } = useTripPlaces();

    const [selectedCategory, setSelectedCategory] = useState<
        VisitedPlaceCategory | 'Todas'
    >('Todas');

    // índice dentro de `filteredMedia`
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const allMedia: MediaItem[] = useMemo(() => {
        const items: MediaItem[] = [];
        tripPlaces.forEach((place) => {
            (place.mediaUrls ?? []).forEach((uri, idx) => {
                if (!uri) return;
                items.push({
                    id: `${place.id}-${idx}`,
                    uri,
                    category: place.category,
                    date: place.dateTime,
                });
            });
        });
        return items;
    }, [tripPlaces]);

    const filteredMedia =
        selectedCategory === 'Todas'
            ? allMedia
            : allMedia.filter((m) => m.category === selectedCategory);

    function handleChangeCategory(cat: VisitedPlaceCategory | 'Todas') {
        setSelectedCategory(cat);
        setSelectedIndex(null); // fecha modal se estiver aberto
    }

    function closeSlider() {
        setSelectedIndex(null);
    }

    if (allMedia.length === 0) {
        return (
            <SafeAreaView
                edges={['top']}
                style={[
                    styles.emptyContainer,
                    { backgroundColor: theme.colors.background },
                ]}
            >
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
                    Ao adicionar fotos e vídeos aos locais visitados, eles vão
                    aparecer aqui em forma de galeria.
                </Text>
            </SafeAreaView>
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

    // ====== MONTAR MASONRY (2 COLUNAS) ======
    type MediaWithIndex = { media: MediaItem; index: number };

    const leftColumn: MediaWithIndex[] = [];
    const rightColumn: MediaWithIndex[] = [];

    filteredMedia.forEach((media, index) => {
        if (index % 2 === 0) {
            leftColumn.push({ media, index });
        } else {
            rightColumn.push({ media, index });
        }
    });

    return (
        <SafeAreaView
            edges={['top']}
            style={[

                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 60,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER + CATEGORIAS */}
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 12,
                        paddingBottom: 8,
                    }}
                >
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
                                        onPress={() =>
                                            handleChangeCategory('Todas')
                                        }
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
                                                    selectedCategory ===
                                                        'Todas'
                                                        ? '#FFFFFF'
                                                        : theme.colors
                                                            .textSoft,
                                            }}
                                        >
                                            Todas
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <CategoryChip
                                        label={item}
                                        selected={selectedCategory === item}
                                        onPress={() =>
                                            handleChangeCategory(item)
                                        }
                                    />
                                )}
                            </View>
                        )}
                    />
                </View>

                {/* GRID ESTILO PINTEREST */}
                <View style={styles.masonryContainer}>
                    <View style={styles.column}>
                        {leftColumn.map(({ media, index }) => {
                            const cardHeight =
                                index % 3 === 0
                                    ? 260
                                    : index % 3 === 1
                                        ? 200
                                        : 300; // alturas variáveis

                            return (
                                <Pressable
                                    key={media.id}
                                    onPress={() => setSelectedIndex(index)}
                                    style={[
                                        styles.masonryItem,
                                        { height: cardHeight },
                                    ]}
                                >
                                    <Image
                                        source={{ uri: media.uri }}
                                        style={styles.masonryImage}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.column}>
                        {rightColumn.map(({ media, index }) => {
                            const cardHeight =
                                index % 3 === 0
                                    ? 220
                                    : index % 3 === 1
                                        ? 280
                                        : 210;

                            return (
                                <Pressable
                                    key={media.id}
                                    onPress={() => setSelectedIndex(index)}
                                    style={[
                                        styles.masonryItem,
                                        { height: cardHeight },
                                    ]}
                                >
                                    <Image
                                        source={{ uri: media.uri }}
                                        style={styles.masonryImage}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* MODAL FULLSCREEN COM SLIDER */}
            <Modal
                visible={selectedIndex !== null}
                transparent
                animationType="fade"
                onRequestClose={closeSlider}
            >
                <View
                    style={[
                        styles.fullscreenModal,
                        { backgroundColor: theme.colors.overlay },
                    ]}
                >
                    {selectedIndex !== null && filteredMedia.length > 0 && (
                        <>
                            <FlatList
                                data={filteredMedia}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                initialScrollIndex={selectedIndex}
                                getItemLayout={(_, index) => ({
                                    length: SCREEN_WIDTH,
                                    offset: SCREEN_WIDTH * index,
                                    index,
                                })}
                                onMomentumScrollEnd={(ev) => {
                                    const offsetX =
                                        ev.nativeEvent.contentOffset.x;
                                    const current =
                                        Math.round(offsetX / SCREEN_WIDTH) ||
                                        0;
                                    // atualiza índice se quiser usar em indicador
                                    // setSelectedIndex(current); // opcional
                                }}
                                renderItem={({ item }) => (
                                    <View style={styles.slide}>
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={styles.fullImage}
                                            resizeMode="contain"
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: theme.colors.textSoft,
                                                marginTop: 8,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {item.category} •{' '}
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString('pt-BR')}
                                        </Text>
                                    </View>
                                )}
                            />

                            {/* Botão fechar */}
                            <TouchableOpacity
                                onPress={closeSlider}
                                style={[
                                    styles.closeButton,
                                    {
                                        backgroundColor:
                                            theme.colors.cardSoft,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}
                                >
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
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
    // Masonry
    masonryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 10,
    },
    column: {
        flex: 1,
    },
    masonryItem: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 10,
    },
    masonryImage: {
        width: '100%',
        height: '100%',
    },
    // Modal fullscreen
    fullscreenModal: {
        flex: 1,
        justifyContent: 'center',
    },
    slide: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    fullImage: {
        width: SCREEN_WIDTH - 32,
        height: SCREEN_WIDTH - 32,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
