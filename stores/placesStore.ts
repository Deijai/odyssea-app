// stores/placesStore.ts
import { subscribeTripPlaces } from '@/services/placesService';
import type { VisitedPlace } from '@/types/trip';
import type { Unsubscribe } from 'firebase/firestore';
import { create } from 'zustand';

type PlacesState = {
    placesByTripId: Record<string, VisitedPlace[]>;
    listeners: Record<string, Unsubscribe | null>;
};

type PlacesActions = {
    bindTripPlaces: (tripId: string, fallbackPlaces?: VisitedPlace[]) => void;
    getPlacesForTrip: (tripId: string) => VisitedPlace[];
    clearTripPlaces: (tripId: string) => void;
    clearAll: () => void;
};

type PlacesStore = PlacesState & PlacesActions;

export const usePlacesStore = create<PlacesStore>((set, get) => ({
    placesByTripId: {},
    listeners: {},

    bindTripPlaces: (tripId, fallbackPlaces) => {
        const { listeners } = get();

        // já tem listener ativo para essa trip
        if (listeners[tripId]) return;

        // se tiver fallback (ex: trip.places mock/local), joga no estado antes
        if (fallbackPlaces && fallbackPlaces.length > 0) {
            set((state) => ({
                placesByTripId: {
                    ...state.placesByTripId,
                    [tripId]: fallbackPlaces,
                },
            }));
        }

        const unsub = subscribeTripPlaces(tripId, (places) => {
            set((state) => ({
                placesByTripId: {
                    ...state.placesByTripId,
                    [tripId]: places,
                },
            }));
        });

        set((state) => ({
            listeners: {
                ...state.listeners,
                [tripId]: unsub,
            },
        }));
    },

    getPlacesForTrip: (tripId) => {
        const { placesByTripId } = get();
        return placesByTripId[tripId] ?? [];
    },

    clearTripPlaces: (tripId) => {
        const { listeners } = get();
        const unsub = listeners[tripId];
        if (unsub) unsub();

        set((state) => {
            const newPlaces = { ...state.placesByTripId };
            const newListeners = { ...state.listeners };
            delete newPlaces[tripId];
            delete newListeners[tripId];
            return {
                placesByTripId: newPlaces,
                listeners: newListeners,
            };
        });
    },

    clearAll: () => {
        const { listeners } = get();
        Object.values(listeners).forEach((unsub) => unsub && unsub());

        set({
            placesByTripId: {},
            listeners: {},
        });
    },
}));
