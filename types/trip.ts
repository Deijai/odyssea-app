// src/types/trip.ts
export type VisitedPlaceCategory =
    | 'Passeio'
    | 'Restaurante'
    | 'Praia'
    | 'Hotel'
    | 'Transporte'
    | 'Mirante'
    | 'Museu'
    | 'Shopping'
    | 'Outro';

export interface VisitedPlace {
    id: string;
    name: string;
    category: VisitedPlaceCategory;
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    dateTime: string; // ISO string
    rating: number; // 1-5
    notes: string;
    mediaUrls: string[];
    tags: string[];
}

export type TripStatus = 'Upcoming' | 'Current' | 'Completed';

export interface Trip {
    id: string;
    title: string;
    destination: string;
    startDate: string; // ISO
    endDate: string;   // ISO
    coverPhotoUrl: string;
    tags: string[];
    status: TripStatus;
    places: VisitedPlace[];
}
