// stores/userProfileStore.ts
import {
    getOrCreateUserProfile,
    updateUserProfile,
    uploadProfilePhotoAsync,
} from '@/services/userProfileService';
import type { UserProfile } from '@/types/auth';
import type { User } from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserProfileState = {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
};

type UserProfileActions = {
    loadFromFirebaseUser: (firebaseUser: User) => Promise<void>;
    updateProfile: (
        data: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>
    ) => Promise<void>;
    changeAvatar: (localUri: string) => Promise<void>;
    reset: () => void;
};

type UserProfileStore = UserProfileState & UserProfileActions;

export const useUserProfileStore = create<UserProfileStore>()(
    persist(
        (set, get) => ({
            profile: null,
            isLoading: false,
            error: null,

            // carrega (ou cria) o perfil no Firestore a partir do firebaseUser
            loadFromFirebaseUser: async (firebaseUser: User) => {
                try {
                    set({ isLoading: true, error: null });
                    const profile = await getOrCreateUserProfile(firebaseUser);
                    set({ profile, isLoading: false });
                } catch (err: any) {
                    console.error('Erro ao carregar perfil:', err);
                    set({
                        isLoading: false,
                        error: err?.message ?? 'Erro ao carregar perfil',
                    });
                }
            },

            // atualiza campos de perfil (displayName, bio, homeCountry, avatarUrl se quiser)
            updateProfile: async (data) => {
                const current = get().profile;
                if (!current) return;

                try {
                    set({ isLoading: true, error: null });

                    const updated = await updateUserProfile(current.uid, data);

                    set({
                        profile: updated,
                        isLoading: false,
                    });
                } catch (err: any) {
                    console.error('Erro ao atualizar perfil:', err);
                    set({
                        isLoading: false,
                        error: err?.message ?? 'Erro ao atualizar perfil',
                    });
                }
            },

            // troca a foto de perfil usando o service de upload
            changeAvatar: async (localUri: string) => {
                const current = get().profile;
                if (!current) return;

                try {
                    set({ isLoading: true, error: null });

                    const url = await uploadProfilePhotoAsync(current.uid, localUri);

                    set({
                        profile: {
                            ...current,
                            avatarUrl: url,
                            updatedAt: Date.now(),
                        },
                        isLoading: false,
                    });
                } catch (err: any) {
                    console.error('Erro ao trocar avatar:', err);
                    set({
                        isLoading: false,
                        error: err?.message ?? 'Erro ao trocar foto de perfil',
                    });
                }
            },

            reset: () => {
                set({
                    profile: null,
                    isLoading: false,
                    error: null,
                });
            },
        }),
        {
            name: 'user-profile-store',
        }
    )
);
