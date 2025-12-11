// app/(main)/_layout.tsx
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function MainLayout() {
    const { isAuthenticated = false } = useAuthStore();
    const { theme } = useTheme();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
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
