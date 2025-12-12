// app/_layout.tsx
import { useAuthStore } from '@/stores/authStore';
import {
    Slot,
    useRootNavigationState,
    useRouter,
    useSegments,
} from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function isProfileComplete(profile: any | null) {
    if (!profile) return false;

    const hasName = !!profile.displayName?.trim();
    const hasHomeCountry = !!profile.homeCountry?.trim();
    // se quiser exigir bio / avatar:
    // const hasBio = !!profile.bio?.trim();
    // const hasAvatar = !!profile.avatarUrl;

    return hasName && hasHomeCountry;
}

export default function RootLayout() {
    const {
        status,
        isInitializing,
        profile,
        initAuthListener,
    } = useAuthStore();

    const segments = useSegments();
    const router = useRouter();
    const navState = useRootNavigationState();

    // Inicia o listener do Firebase Auth UMA vez
    useEffect(() => {
        initAuthListener();
    }, [initAuthListener]);

    useEffect(() => {
        // 1) Espera a navegação estar pronta
        if (!navState?.key) return;

        // 2) Espera a auth inicializar
        if (isInitializing) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inMainGroup = segments[0] === '(main)';
        const secondSegment = segments[1];

        // 3) Não autenticado → sempre vai pro (auth)/sign-in
        if (status !== 'authenticated') {
            const isInSignIn =
                inAuthGroup && (secondSegment === 'login' || !secondSegment);

            if (!isInSignIn) {
                router.replace('/(auth)/login');
            }
            return;
        }

        // 4) Autenticado → checa se perfil está completo
        const complete = isProfileComplete(profile);

        if (!complete) {
            const isInProfileSetup =
                inAuthGroup && secondSegment === 'profile-setup';

            if (!isInProfileSetup) {
                router.replace('/(auth)/profile-setup');
            }
            return;
        }

        // 5) Autenticado + perfil completo:
        //    se ainda estiver em (auth), manda pra (main) UMA vez
        if (inAuthGroup && !inMainGroup) {
            router.replace('/(main)');
        }
    }, [navState?.key, isInitializing, status, profile, segments, router]);

    // Enquanto navegação ou auth estão inicializando, mostra um loading
    if (!navState?.key || isInitializing) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    // Deixa o Expo Router cuidar das rotas (grupos (auth) e (main))
    return <Slot />;
}
