// hooks/useTripPlaces.ts
import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { usePlacesStore } from '@/stores/placesStore';
import type { VisitedPlace } from '@/types/trip';
import { useEffect, useMemo } from 'react';

export function useTripPlaces(): {
    tripId: string | null;
    tripPlaces: VisitedPlace[];
    loadingFromBackend: boolean;
} {
    const { tripId, trip } = useCurrentTrip();
    const bindTripPlaces = usePlacesStore((s) => s.bindTripPlaces);
    const getPlacesForTrip = usePlacesStore((s) => s.getPlacesForTrip);

    useEffect(() => {
        if (!tripId) return;

        const fallback =
            (trip?.places as VisitedPlace[] | undefined) ?? undefined;

        bindTripPlaces(tripId, fallback);
    }, [tripId, trip?.places, bindTripPlaces]);

    const fromStore = tripId ? getPlacesForTrip(tripId) : [];

    const tripPlaces = useMemo<VisitedPlace[]>(() => {
        // prioridade pros dados do backend; se vazio, usa o que veio no trip
        if (fromStore && fromStore.length > 0) return fromStore;
        return ((trip?.places ?? []) as VisitedPlace[]) || [];
    }, [fromStore, trip?.places]);

    const loadingFromBackend = !!tripId && fromStore.length === 0;

    return {
        tripId: tripId ?? null,
        tripPlaces,
        loadingFromBackend,
    };
}
