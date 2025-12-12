// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
    createJSONStorage,
    persist,
} from 'zustand/middleware';

import type { User as FirebaseUser } from 'firebase/auth';

import {
    signInWithEmail,
    signOutFirebase,
    signUpWithEmail,
    subscribeToAuthChanges,
} from '@/services/authService';

import {
    getOrCreateUserProfile,
    updateUserProfile,
    uploadProfilePhotoAsync,
} from '@/services/userProfileService';

import type { AuthStatus, AuthUser, UserProfile } from '@/types/auth';

type AuthStoreState = {
    status: AuthStatus;
    firebaseUser: AuthUser | null;
    profile: UserProfile | null;
    isInitializing: boolean;
    error: string | null;
};

type AuthStoreActions = {
    initAuthListener: () => void;
    signUp: (params: {
        name: string;
        email: string;
        password: string;
    }) => Promise<void>;
    signIn: (params: { email: string; password: string }) => Promise<void>;
    signOut: () => Promise<void>;
    // ⬇️ Aqui estava o problema: antes era Promise<void>
    refreshProfileFromFirebaseUser: (
        user: FirebaseUser | null
    ) => Promise<UserProfile | null>;
    updateProfile: (
        data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
    ) => Promise<void>;
    updateAvatar: (localUri: string) => Promise<void>;
    clearError: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

let unsubscribeAuth: (() => void) | null = null;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            status: 'idle',
            firebaseUser: null,
            profile: null,
            isInitializing: true,
            error: null,

            initAuthListener: () => {
                if (unsubscribeAuth) return; // evita duplicar

                set({ isInitializing: true, status: 'checking' });

                unsubscribeAuth = subscribeToAuthChanges(
                    async (firebaseUser) => {
                        if (!firebaseUser) {
                            set({
                                firebaseUser: null,
                                profile: null,
                                status: 'unauthenticated',
                                isInitializing: false,
                            });
                            return;
                        }

                        try {
                            const profile =
                                await get().refreshProfileFromFirebaseUser(
                                    firebaseUser
                                );

                            if (!profile) {
                                // por segurança, se não conseguir perfil
                                set({
                                    firebaseUser: null,
                                    profile: null,
                                    status: 'unauthenticated',
                                    isInitializing: false,
                                });
                                return;
                            }

                            set({
                                firebaseUser: {
                                    uid: firebaseUser.uid,
                                    email: firebaseUser.email,
                                    displayName:
                                        firebaseUser.displayName,
                                    photoURL: firebaseUser.photoURL,
                                },
                                profile,
                                status: 'authenticated',
                                isInitializing: false,
                                error: null,
                            });
                        } catch (err: any) {
                            set({
                                error:
                                    err.message ??
                                    'Erro ao carregar perfil',
                                isInitializing: false,
                                status: 'unauthenticated',
                            });
                        }
                    }
                );
            },

            refreshProfileFromFirebaseUser: async (firebaseUser) => {
                if (!firebaseUser) {
                    set({
                        firebaseUser: null,
                        profile: null,
                        status: 'unauthenticated',
                    });
                    return null; // ⬅️ importante: retorna null, não void
                }

                const profile = await getOrCreateUserProfile(firebaseUser);
                return profile; // UserProfile
            },

            signUp: async ({ name, email, password }) => {
                set({ status: 'checking', error: null });

                try {
                    const { firebaseUser, profile } = await signUpWithEmail(
                        name,
                        email,
                        password
                    );

                    set({
                        firebaseUser: {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                        },
                        profile,
                        status: 'authenticated',
                        error: null,
                    });
                } catch (err: any) {
                    console.log('signUp error', err);
                    set({
                        error:
                            err.message ?? 'Erro ao criar conta',
                        status: 'unauthenticated',
                    });
                }
            },

            signIn: async ({ email, password }) => {
                set({ status: 'checking', error: null });

                try {
                    const { firebaseUser, profile } = await signInWithEmail(
                        email,
                        password
                    );

                    set({
                        firebaseUser: {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                        },
                        profile,
                        status: 'authenticated',
                        error: null,
                    });
                } catch (err: any) {
                    console.log('signIn error', err);
                    set({
                        error: err.message ?? 'Erro ao entrar',
                        status: 'unauthenticated',
                    });
                }
            },

            signOut: async () => {
                try {
                    await signOutFirebase();
                } finally {
                    set({
                        firebaseUser: null,
                        profile: null,
                        status: 'unauthenticated',
                    });
                }
            },

            updateProfile: async (data) => {
                const { firebaseUser } = get();
                if (!firebaseUser) return;

                const updated = await updateUserProfile(firebaseUser.uid, data);

                set({
                    profile: updated,
                });
            },


            updateAvatar: async (localUri: string) => {
                const { firebaseUser, profile } = get();
                if (!firebaseUser || !profile) return;

                const downloadUrl = await uploadProfilePhotoAsync(
                    firebaseUser.uid,
                    localUri
                );

                set({
                    firebaseUser: {
                        ...firebaseUser,
                        photoURL: downloadUrl,
                    },
                    profile: {
                        ...profile,
                        avatarUrl: downloadUrl,
                    },
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'odyssea-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Você pode escolher o que persistir:
            partialize: (state) => ({
                firebaseUser: state.firebaseUser,
                profile: state.profile,
                status: state.status,
            }),
        }
    )
);

// opcional: helper para limpar listener quando app fecha
export function cleanupAuthListener() {
    if (unsubscribeAuth) {
        unsubscribeAuth();
        unsubscribeAuth = null;
    }
}
