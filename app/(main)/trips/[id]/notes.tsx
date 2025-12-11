// app/(main)/trips/[id]/notes.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCurrentTrip } from '@/hooks/useCurrentTrip';
import { useTheme } from '@/hooks/useTheme';

type Note = {
    id: string;
    title: string;
    body: string;
    createdAt: string;
};

type ChecklistItem = {
    id: string;
    text: string;
    done: boolean;
};

export default function TripNotesScreen() {
    const { theme } = useTheme();
    const { trip } = useCurrentTrip();

    const [tab, setTab] = useState<'journal' | 'checklist'>('journal');

    const [notes, setNotes] = useState<Note[]>([]);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteBody, setNoteBody] = useState('');

    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [itemText, setItemText] = useState('');

    if (!trip) {
        return null;
    }

    function addNote() {
        if (!noteTitle && !noteBody) return;
        const n: Note = {
            id: `note-${Date.now()}`,
            title: noteTitle || 'Anotação sem título',
            body: noteBody,
            createdAt: new Date().toISOString(),
        };
        setNotes((prev) => [n, ...prev]);
        setNoteTitle('');
        setNoteBody('');
    }

    function addItem() {
        if (!itemText) return;
        const i: ChecklistItem = {
            id: `item-${Date.now()}`,
            text: itemText,
            done: false,
        };
        setItems((prev) => [...prev, i]);
        setItemText('');
    }

    function toggleItem(id: string) {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
        );
    }

    const total = items.length;
    const done = items.filter((i) => i.done).length;
    const progress = total === 0 ? 0 : done / total;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        onPress={() => setTab('journal')}
                        style={[
                            styles.tabButton,
                            {
                                borderBottomColor:
                                    tab === 'journal' ? theme.colors.primary : 'transparent',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: tab === 'journal' ? '700' : '500',
                                color:
                                    tab === 'journal'
                                        ? theme.colors.text
                                        : theme.colors.textSoft,
                            }}
                        >
                            Diário
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTab('checklist')}
                        style={[
                            styles.tabButton,
                            {
                                borderBottomColor:
                                    tab === 'checklist' ? theme.colors.primary : 'transparent',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: tab === 'checklist' ? '700' : '500',
                                color:
                                    tab === 'checklist'
                                        ? theme.colors.text
                                        : theme.colors.textSoft,
                            }}
                        >
                            Checklist
                        </Text>
                    </TouchableOpacity>
                </View>

                {tab === 'journal' ? (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ListHeaderComponent={
                                <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Notas rápidas da viagem
                                    </Text>

                                    <View
                                        style={[
                                            styles.card,
                                            { backgroundColor: theme.colors.card },
                                        ]}
                                    >
                                        <TextInput
                                            placeholder="Título da nota"
                                            placeholderTextColor={theme.colors.textMuted}
                                            value={noteTitle}
                                            onChangeText={setNoteTitle}
                                            style={[
                                                styles.noteTitleInput,
                                                {
                                                    color: theme.colors.text,
                                                },
                                            ]}
                                        />
                                        <TextInput
                                            placeholder="Escreva detalhes, sensações, reflexões..."
                                            placeholderTextColor={theme.colors.textMuted}
                                            value={noteBody}
                                            onChangeText={setNoteBody}
                                            multiline
                                            style={[
                                                styles.noteBodyInput,
                                                {
                                                    color: theme.colors.text,
                                                },
                                            ]}
                                        />

                                        <TouchableOpacity
                                            onPress={addNote}
                                            style={[
                                                styles.addNoteButton,
                                                { backgroundColor: theme.colors.primary },
                                            ]}
                                        >
                                            <Ionicons name="add" size={18} color="#FFFFFF" />
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    marginLeft: 6,
                                                }}
                                            >
                                                Salvar nota
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.textSoft,
                                            marginTop: 10,
                                        }}
                                    >
                                        {notes.length === 0
                                            ? 'Sem notas por enquanto.'
                                            : `Notas salvas: ${notes.length}`}
                                    </Text>
                                </View>
                            }
                            data={notes}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.card,
                                        {
                                            backgroundColor: theme.colors.card,
                                            marginHorizontal: 20,
                                            marginTop: 12,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: theme.colors.text,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.textMuted,
                                            marginBottom: 6,
                                        }}
                                    >
                                        {new Date(item.createdAt).toLocaleString('pt-BR')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: theme.colors.textSoft,
                                            lineHeight: 20,
                                        }}
                                    >
                                        {item.body}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '600',
                                    color: theme.colors.text,
                                    marginBottom: 8,
                                }}
                            >
                                Checklist da viagem
                            </Text>

                            <View
                                style={[
                                    styles.card,
                                    { backgroundColor: theme.colors.card },
                                ]}
                            >
                                <View style={styles.progressRow}>
                                    <View style={styles.progressBarBackground}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                {
                                                    backgroundColor: theme.colors.primary,
                                                    flex: progress,
                                                },
                                            ]}
                                        />
                                        <View style={{ flex: 1 - progress }} />
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.textSoft,
                                            marginLeft: 8,
                                        }}
                                    >
                                        {done}/{total} concluídos
                                    </Text>
                                </View>

                                <View style={styles.checklistInputRow}>
                                    <Ionicons
                                        name="checkbox-outline"
                                        size={18}
                                        color={theme.colors.textMuted}
                                    />
                                    <TextInput
                                        placeholder="Adicionar item (ex: reservar hotel, comprar ingressos...)"
                                        placeholderTextColor={theme.colors.textMuted}
                                        value={itemText}
                                        onChangeText={setItemText}
                                        style={{
                                            flex: 1,
                                            marginLeft: 8,
                                            fontSize: 14,
                                            color: theme.colors.text,
                                        }}
                                    />
                                    <TouchableOpacity onPress={addItem}>
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={22}
                                            color={theme.colors.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => toggleItem(item.id)}
                                    style={[
                                        styles.checkItemRow,
                                        {
                                            backgroundColor: theme.colors.card,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.checkCircle,
                                            {
                                                borderColor: theme.colors.primary,
                                                backgroundColor: item.done
                                                    ? theme.colors.primary
                                                    : 'transparent',
                                            },
                                        ]}
                                    >
                                        {item.done && (
                                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                        )}
                                    </View>
                                    <Text
                                        style={{
                                            flex: 1,
                                            fontSize: 14,
                                            color: item.done
                                                ? theme.colors.textMuted
                                                : theme.colors.text,
                                            textDecorationLine: item.done ? 'line-through' : 'none',
                                        }}
                                    >
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.textSoft,
                                        marginTop: 10,
                                    }}
                                >
                                    Nenhum item ainda. Use o campo acima para criar sua checklist.
                                </Text>
                            }
                        />
                    </View>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 2,
    },
    card: {
        borderRadius: 16,
        padding: 12,
    },
    noteTitleInput: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    noteBodyInput: {
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    addNoteButton: {
        borderRadius: 999,
        marginTop: 10,
        alignSelf: 'flex-end',
        paddingHorizontal: 14,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        borderRadius: 999,
        backgroundColor: '#E5E7EB33',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    progressBarFill: {
        borderRadius: 999,
    },
    checklistInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    checkItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 8,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 999,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
});
