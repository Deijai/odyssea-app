// src/hooks/useTheme.ts
import { useThemeStore } from '@/stores/themeStore';
import { StatusBarStyle } from 'react-native';

export function useTheme() {
    const { mode, theme, toggleMode, setMode } = useThemeStore();

    const isDark = mode === 'dark';

    const statusBarStyle: StatusBarStyle = isDark ? 'light-content' : 'dark-content';

    return {
        mode,
        theme,
        isDark,
        toggleTheme: toggleMode,
        setThemeMode: setMode,
        statusBarStyle,
    };
}
