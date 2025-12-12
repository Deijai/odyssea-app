// app/(main)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function MainLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create-trip" />
            <Stack.Screen name="trips/[id]" />
            <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
        </Stack>
    );
}
