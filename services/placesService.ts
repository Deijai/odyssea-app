// services/placesService.ts
import { db } from '@/firebase/config';
import type { VisitedPlace } from '@/types/trip';
import {
    collection,
    DocumentData,
    DocumentSnapshot,
    onSnapshot,
    orderBy,
    query,
    Unsubscribe,
} from 'firebase/firestore';

// Converte o doc do Firestore para o tipo VisitedPlace do app
function mapDocToVisitedPlace(
    docSnap: DocumentSnapshot<DocumentData>,
): VisitedPlace {
    const data: any = docSnap.data() || {};

    return {
        id: docSnap.id,
        name: data.name ?? '',
        category: data.category ?? 'Outro',
        dateTime: data.dateTime ?? new Date().toISOString(),
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        location: data.location ?? { address: '' },
        rating: typeof data.rating === 'number' ? data.rating : 0,
    } as VisitedPlace;
}

// 🔁 Listener em tempo real dos places de uma trip
export function subscribeTripPlaces(
    tripId: string,
    onChange: (places: VisitedPlace[]) => void,
): Unsubscribe {
    const placesRef = collection(db, 'trips', tripId, 'places');
    const q = query(placesRef, orderBy('dateTime', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
        const list: VisitedPlace[] = snap.docs.map((doc) =>
            mapDocToVisitedPlace(doc as any),
        );
        onChange(list);
    });

    return unsub;
}
