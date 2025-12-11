// app/_layout.tsx
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
    const { theme, statusBarStyle } = useTheme();
    const { isAuthenticated } = useAuthStore();

    // Aqui usamos apenas o Stack raiz; os grupos (auth/main) cuidam do resto.
    useEffect(() => {
        // lugar bom pra inicializar Firebase no futuro
    }, []);

    return (
        <>
            <StatusBar barStyle={statusBarStyle} backgroundColor={theme.colors.background} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
            >
                {/* expo-router cuida dos grupos (auth) e (main) automaticamente */}
            </Stack>
        </>
    );
}
