// app/(main)/trips/[id]/_layout.tsx
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TripTabsLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSoft,
                tabBarStyle: {
                    backgroundColor: theme.colors.background ?? theme.colors.background,
                    borderTopColor: theme.colors.border,
                    elevation: 8,
                    shadowColor: '#00000055',
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: -2 },
                    shadowRadius: 6,
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Linha do tempo',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: 'Mapa',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="gallery"
                options={{
                    title: 'Galeria',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="notes"
                options={{
                    title: 'Notas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Config.',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
