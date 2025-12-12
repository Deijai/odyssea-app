// types/auth.ts
export type AuthUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
};

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

export type UserProfile = {
    uid: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    homeCountry?: string;
    createdAt: number;
    updatedAt: number;
};
