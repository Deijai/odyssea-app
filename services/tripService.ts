// services/tripService.ts
import { db, storage } from '@/firebase/config';
import type { Trip } from '@/types/trip';
import {
    addDoc,
    collection,
    serverTimestamp,
} from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage';

type CreateTripInput = {
    ownerUid: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    tags: string[];
    coverLocalUri?: string | null;
};

// upload da capa da viagem para o Storage
export async function uploadTripCoverAsync(
    ownerUid: string,
    localUri: string
): Promise<string> {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const fileName = `cover-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.jpg`;

    const storageRef = ref(storage, `tripCovers/${ownerUid}/${fileName}`);

    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}

// cria a viagem no Firestore e devolve um Trip igual o app já usa
export async function createTripInFirestore(
    input: CreateTripInput
): Promise<Trip> {
    const {
        ownerUid,
        title,
        destination,
        startDate,
        endDate,
        tags,
        coverLocalUri,
    } = input;

    let coverPhotoUrl =
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

    if (coverLocalUri) {
        try {
            coverPhotoUrl = await uploadTripCoverAsync(
                ownerUid,
                coverLocalUri
            );
        } catch (err) {
            console.log('Erro ao fazer upload da capa da viagem', err);
            // se der erro, fica com a imagem default
        }
    }

    // dados que vamos salvar no Firestore
    const payload = {
        ownerUid,
        title,
        destination,
        startDate,
        endDate,
        coverPhotoUrl,
        tags,
        status: 'Upcoming' as const,
        places: [] as Trip['places'], // mantém compatível com o tipo atual
        createdAt: serverTimestamp(),
    };

    const tripsCol = collection(db, 'trips');
    const docRef = await addDoc(tripsCol, payload);

    // Trip que o app já espera (id + campos usados nas telas)
    const trip: Trip = {
        id: docRef.id,
        title,
        destination,
        startDate,
        endDate,
        coverPhotoUrl,
        tags,
        status: 'Upcoming',
        places: [],
    };

    return trip;
}
