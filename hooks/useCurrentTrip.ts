// hooks/useCurrentTrip.ts
import { useTripStore } from '@/stores/tripStore';
import { useLocalSearchParams } from 'expo-router';

export function useCurrentTrip() {
    const params = useLocalSearchParams<{ id?: string }>();

    // ✅ Cada propriedade em um selector separado para evitar re-renders
    const selectedTripId = useTripStore((state) => state.selectedTripId);
    const getTripById = useTripStore((state) => state.getTripById);

    const paramId = typeof params.id === 'string' ? params.id : undefined;
    const tripId = paramId && paramId.length > 0 ? paramId : selectedTripId ?? null;

    // ✅ Chama a função diretamente, sem useMemo (que pode causar loops)
    const trip = tripId ? getTripById(tripId) : undefined;

    return {
        tripId,
        trip,
    };
}