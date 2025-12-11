// src/stores/authStore.ts
import { UserProfile } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => void;
    signOut: () => void;
}

// Aqui é só mock, depois trocamos por Firebase
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            signIn: async (email, _password) => {
                // MOCK: sempre entra
                const existing = get().user;
                const user: UserProfile =
                    existing ?? {
                        id: 'mock-user-1',
                        name: 'Viajante Anônimo',
                        email,
                    };

                set({ user, isAuthenticated: true });
            },

            signUp: async (name, email, _password) => {
                const user: UserProfile = {
                    id: 'mock-user-1',
                    name,
                    email,
                };
                set({ user, isAuthenticated: true });
            },

            updateProfile: (data) => {
                const current = get().user;
                if (!current) return;
                set({ user: { ...current, ...data } });
            },

            signOut: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'odyssea-auth',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
