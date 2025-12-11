// app/(main)/trips/[id]/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

export default function TripSettingsScreen() {
    const { theme } = useTheme();
    const { signOut } = useAuthStore();
    const { tripId, trip } = useCurrentTrip();

    const [isPrivate, setIsPrivate] = useState(true);
    const [includeMediaInExport, setIncludeMediaInExport] = useState(true);

    // ✅ Nunca retorna null: mostra feedback pro usuário
    if (!tripId || !trip) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.centered}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 4,
                        }}
                    >
                        Viagem não encontrada
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.textSoft,
                            textAlign: 'center',
                            paddingHorizontal: 32,
                        }}
                    >
                        Não foi possível carregar as configurações desta viagem. Volte para
                        a lista de viagens e tente novamente.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    function handleExport(type: 'pdf' | 'json') {
        Alert.alert(
            'Exportação em breve',
            `A exportação em ${type.toUpperCase()} será configurada quando integrarmos o backend.`
        );
    }

    function handleSignOut() {
        Alert.alert('Sair da conta', 'Tem certeza que deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: () => {
                    signOut();
                    // Se ainda não tiver fluxo de auth pronto, depois a gente ajusta essa rota
                    // Por enquanto, deixa preparado para ir ao grupo de auth
                    // router.replace('/(auth)/');
                },
            },
        ]);
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: theme.colors.text,
                        marginBottom: 4,
                    }}
                >
                    Configurações da viagem
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        color: theme.colors.textSoft,
                        marginBottom: 16,
                    }}
                >
                    Ajuste a privacidade, exporte seu diário e gerencie sua conta.
                </Text>

                {/* --- Seção: Privacidade --- */}
                <View
                    style={[
                        styles.sectionCard,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Privacidade
                    </Text>

                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.text,
                                    marginBottom: 2,
                                }}
                            >
                                Viagem privada
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.textSoft,
                                }}
                            >
                                Quando ativo, apenas você poderá visualizar esta viagem
                                (padrão).
                            </Text>
                        </View>
                        <Switch
                            value={isPrivate}
                            onValueChange={setIsPrivate}
                            thumbColor={isPrivate ? theme.colors.primary : '#FFFFFF'}
                            trackColor={{
                                false: '#6B728033',
                                true: theme.colors.primarySoft,
                            }}
                        />
                    </View>
                </View>

                {/* --- Seção: Exportar diário --- */}
                <View
                    style={[
                        styles.sectionCard,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Exportar diário
                    </Text>

                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: theme.colors.text,
                                    marginBottom: 2,
                                }}
                            >
                                Incluir fotos e vídeos
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: theme.colors.textSoft,
                                }}
                            >
                                Quando desativado, apenas textos, notas e metadados serão
                                exportados.
                            </Text>
                        </View>
                        <Switch
                            value={includeMediaInExport}
                            onValueChange={setIncludeMediaInExport}
                            thumbColor={
                                includeMediaInExport ? theme.colors.primary : '#FFFFFF'
                            }
                            trackColor={{
                                false: '#6B728033',
                                true: theme.colors.primarySoft,
                            }}
                        />
                    </View>

                    <View style={{ height: 12 }} />

                    <TouchableOpacity
                        style={[
                            styles.exportButton,
                            { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={() => handleExport('pdf')}
                    >
                        <Ionicons name="document-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.exportButtonText}>Exportar em PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.exportButton,
                            { backgroundColor: theme.colors.cardSoft },
                        ]}
                        onPress={() => handleExport('json')}
                    >
                        <Ionicons
                            name="code-slash-outline"
                            size={18}
                            color={theme.colors.text}
                        />
                        <Text
                            style={[
                                styles.exportButtonText,
                                { color: theme.colors.text },
                            ]}
                        >
                            Exportar em JSON
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Seção: Conta --- */}
                <View
                    style={[
                        styles.sectionCard,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginBottom: 8,
                        }}
                    >
                        Conta
                    </Text>

                    <TouchableOpacity style={styles.rowBetween} onPress={handleSignOut}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: theme.colors.cardSoft },
                                ]}
                            >
                                <Ionicons
                                    name="log-out-outline"
                                    size={18}
                                    color={theme.colors.danger}
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text,
                                    marginLeft: 8,
                                }}
                            >
                                Sair da conta
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.textSoft}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionCard: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    exportButton: {
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    exportButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 6,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
