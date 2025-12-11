// app/(auth)/_layout.tsx
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Redirect, Stack, useSegments } from 'expo-router';

export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();
    const { theme } = useTheme();
    const segments = useSegments();

    if (isAuthenticated) {
        // Se já estiver logado, redireciona para a home principal
        return <Redirect href="/(main)" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
            }}
        />
    );
}
