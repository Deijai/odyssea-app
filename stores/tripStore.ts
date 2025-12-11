// src/stores/tripStore.ts
import type { Trip, VisitedPlace } from '@/types/trip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TripState {
    trips: Trip[];
    selectedTripId: string | null;

    setSelectedTrip: (id: string | null) => void;
    addTrip: (trip: Trip) => void;
    updateTrip: (id: string, data: Partial<Trip>) => void;
    removeTrip: (id: string) => void;

    addPlaceToTrip: (tripId: string, place: VisitedPlace) => void;
    removePlaceFromTrip: (tripId: string, placeId: string) => void;
    updatePlaceInTrip: (tripId: string, placeId: string, data: Partial<VisitedPlace>) => void;

    // Selectors (só leitura, não causam loops)
    getTripById: (id: string) => Trip | undefined;
    findTripByPlaceId: (placeId: string) => { trip: Trip; place: VisitedPlace } | null;
    getPlaceById: (placeId: string) => VisitedPlace | undefined;
}

const MOCK_TRIPS: Trip[] = [
    {
        id: '1',
        title: 'Fortaleza de Fim de Ano',
        destination: 'Fortaleza, CE',
        startDate: '2025-12-30',
        endDate: '2026-01-03',
        coverPhotoUrl:
            'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        tags: ['praia', 'réveillon', 'amigos'],
        status: 'Upcoming',
        places: [
            {
                id: 'p1',
                name: 'Praia do Futuro',
                category: 'Praia',
                location: {
                    latitude: -3.7485,
                    longitude: -38.4747,
                    address: 'Praia do Futuro, Fortaleza - CE, Brasil',
                },
                dateTime: '2025-12-31T10:00:00.000Z',
                rating: 5,
                notes: 'Manhã de praia, água morna, ótimo para relaxar.',
                mediaUrls: [
                    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['mar', 'sol', 'praia'],
            },
            {
                id: 'p2',
                name: 'Beira Mar à noite',
                category: 'Passeio',
                location: {
                    latitude: -3.7227,
                    longitude: -38.4916,
                    address: 'Av. Beira Mar, Fortaleza - CE, Brasil',
                },
                dateTime: '2025-12-31T20:30:00.000Z',
                rating: 4,
                notes: 'Feirinha, comidas típicas e clima de réveillon.',
                mediaUrls: [
                    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['noite', 'feirinha'],
            },
        ],
    },
    {
        id: '2',
        title: 'Explorando Bali',
        destination: 'Bali, Indonésia',
        startDate: '2025-08-10',
        endDate: '2025-08-20',
        coverPhotoUrl:
            'https://images.unsplash.com/photo-1494475673543-6a6a27143b13?auto=format&fit=crop&w=1200&q=80',
        tags: ['praia', 'aventura'],
        status: 'Completed',
        places: [
            {
                id: 'p3',
                name: 'Templo de Uluwatu',
                category: 'Passeio',
                location: {
                    latitude: -8.8296,
                    longitude: 115.0840,
                    address: 'Uluwatu Temple, Bali, Indonesia',
                },
                dateTime: '2025-08-12T16:00:00.000Z',
                rating: 5,
                notes: 'Por do sol incrível, vista surreal do penhasco.',
                mediaUrls: [
                    'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80',
                ],
                tags: ['templo', 'por do sol'],
            },
        ],
    },
];

export const useTripStore = create<TripState>()(
    persist(
        (set, get) => ({
            trips: MOCK_TRIPS,
            selectedTripId: null,

            setSelectedTrip: (id) => {
                set({ selectedTripId: id });
            },

            addTrip: (trip) => {
                set((state) => ({
                    trips: [...state.trips, trip],
                }));
            },

            updateTrip: (id, data) => {
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === id ? { ...t, ...data } : t
                    ),
                }));
            },

            removeTrip: (id) => {
                set((state) => ({
                    trips: state.trips.filter((t) => t.id !== id),
                    selectedTripId:
                        state.selectedTripId === id ? null : state.selectedTripId,
                }));
            },

            addPlaceToTrip: (tripId, place) => {
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId ? { ...t, places: [...t.places, place] } : t
                    ),
                }));
            },

            removePlaceFromTrip: (tripId, placeId) => {
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? { ...t, places: t.places.filter((p) => p.id !== placeId) }
                            : t
                    ),
                }));
            },

            updatePlaceInTrip: (tripId, placeId, data) => {
                set((state) => ({
                    trips: state.trips.map((t) =>
                        t.id === tripId
                            ? {
                                ...t,
                                places: t.places.map((p) =>
                                    p.id === placeId ? { ...p, ...data } : p
                                ),
                            }
                            : t
                    ),
                }));
            },

            // ✅ Função só de leitura - não faz set
            getTripById: (id) => {
                const { trips } = get();
                return trips.find((t) => t.id === id);
            },

            // ✅ CORRIGIDO: Retorna tanto a trip quanto o place
            findTripByPlaceId: (placeId) => {
                const { trips } = get();
                for (const trip of trips) {
                    const place = trip.places.find((p) => p.id === placeId);
                    if (place) {
                        return { trip, place };
                    }
                }
                return null;
            },

            // ✅ Busca um place específico em todas as viagens
            getPlaceById: (placeId) => {
                const { trips } = get();
                for (const trip of trips) {
                    const place = trip.places.find((p) => p.id === placeId);
                    if (place) return place;
                }
                return undefined;
            },
        }),
        {
            name: 'odyssea-trips-v2',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                trips: state.trips,
                selectedTripId: state.selectedTripId,
            }),
        }
    )
);