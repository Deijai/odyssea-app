// src/stores/themeStore.ts
import { Theme, ThemeMode, darkTheme, lightTheme } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
    mode: ThemeMode;
    theme: Theme;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'light',
            theme: lightTheme,
            setMode: (mode) => {
                set({
                    mode,
                    theme: mode === 'light' ? lightTheme : darkTheme,
                });
            },
            toggleMode: () => {
                const current = get().mode;
                const next = current === 'light' ? 'dark' : 'light';
                set({
                    mode: next,
                    theme: next === 'light' ? lightTheme : darkTheme,
                });
            },
        }),
        {
            name: 'odyssea-theme',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ mode: state.mode }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                const mode = state.mode ?? 'light';
                state.theme = mode === 'light' ? lightTheme : darkTheme;
            },
        }
    )
);
