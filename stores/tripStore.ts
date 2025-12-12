// stores/tripStore.ts
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { create } from 'zustand';

import { db } from '@/firebase/config';
import type { Trip, VisitedPlace } from '@/types/trip';

type TripStoreState = {
    trips: Trip[];
    selectedTripId: string | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
};

type TripStoreActions = {
    initUserTrips: (userId: string) => void;
    addTrip: (trip: Trip, ownerId: string) => Promise<void>;
    setSelectedTrip: (id: string | null) => void;
    getTripById: (id: string) => Trip | undefined;

    // ✅ novos
    addPlaceToTrip: (tripId: string, place: VisitedPlace) => Promise<void>;
    findTripByPlaceId: (
        placeId: string
    ) => { trip: Trip; place: VisitedPlace } | null;
};

type TripStore = TripStoreState & TripStoreActions;

let unsubscribeTrips: (() => void) | null = null;

export const useTripStore = create<TripStore>()((set, get) => ({
    trips: [],
    selectedTripId: null,
    isLoading: false,
    error: null,
    isInitialized: false,

    initUserTrips: (userId: string) => {
        if (!userId) return;

        // se já tiver listener, limpa
        if (unsubscribeTrips) {
            unsubscribeTrips();
            unsubscribeTrips = null;
        }

        set({ isLoading: true, error: null });

        const tripsRef = collection(db, 'trips');
        const q = query(
            tripsRef,
            where('ownerId', '==', userId),
            orderBy('startDate', 'asc')
        );

        unsubscribeTrips = onSnapshot(
            q,
            (snapshot) => {
                const loaded: Trip[] = [];

                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as any;

                    const trip: Trip = {
                        id: docSnap.id,
                        title: data.title,
                        destination: data.destination,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        coverPhotoUrl: data.coverPhotoUrl,
                        tags: data.tags ?? [],
                        status: data.status ?? 'Upcoming',
                        places: data.places ?? [],
                    };

                    loaded.push(trip);
                });

                set({
                    trips: loaded,
                    isLoading: false,
                    isInitialized: true,
                });
            },
            (error) => {
                console.error('Erro ao ouvir trips', error);
                set({
                    error: error.message,
                    isLoading: false,
                    isInitialized: true,
                });
            }
        );
    },

    addTrip: async (trip: Trip, ownerId: string) => {
        const docRef = doc(db, 'trips', trip.id);

        const payload = {
            ...trip,
            ownerId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(docRef, payload);
        // não precisa dar set no Zustand: o onSnapshot vai trazer a nova viagem
    },

    setSelectedTrip: (id: string | null) => {
        set({ selectedTripId: id });
    },

    getTripById: (id: string) => {
        return get().trips.find((t) => t.id === id);
    },

    // ✅ usado pelo AddPlaceScreen
    addPlaceToTrip: async (tripId, place) => {
        const { trips } = get();
        const trip = trips.find((t) => t.id === tripId);

        const currentPlaces = trip?.places ?? [];
        const newPlaces = [...currentPlaces, place];

        // otimista: atualiza localmente
        set({
            trips: trips.map((t) =>
                t.id === tripId ? { ...t, places: newPlaces } : t
            ),
        });

        // persiste no Firestore
        const tripRef = doc(db, 'trips', tripId);
        await updateDoc(tripRef, {
            places: newPlaces,
            updatedAt: serverTimestamp(),
        });
        // quando o onSnapshot disparar, o estado já vai estar consistente
    },

    // ✅ usado pelo PlaceDetailScreen
    findTripByPlaceId: (placeId) => {
        const trips = get().trips;

        for (const trip of trips) {
            const places = trip.places ?? [];
            const place = places.find((p) => p.id === placeId);
            if (place) {
                return { trip, place };
            }
        }

        return null;
    },
}));
