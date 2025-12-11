// src/components/form/DateField.tsx
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type DateFieldProps = {
    label: string;
    value: string | null; // ISO string ou null
    onChange: (iso: string) => void;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
};

export const DateField: React.FC<DateFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Selecionar data',
    mode = 'date',
}) => {
    const { theme, isDark } = useTheme();
    const [open, setOpen] = useState(false);

    const currentDate = (() => {
        if (!value) return new Date();
        const d = new Date(value);
        if (isNaN(d.getTime())) return new Date();
        return d;
    })();

    function handleChange(event: DateTimePickerEvent, date?: Date) {
        if (event.type === 'dismissed') {
            if (Platform.OS === 'android') setOpen(false);
            return;
        }
        if (date) {
            const iso = date.toISOString();
            onChange(iso);
            if (Platform.OS === 'android') setOpen(false);
        }
    }

    const formatted = (() => {
        if (!value) return '';
        const d = new Date(value);
        if (mode === 'time') {
            return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    })();

    // ✅ CORREÇÃO: adicionar themeVariant para forçar tema correto
    const Picker = (
        <DateTimePicker
            value={currentDate}
            mode={mode === 'datetime' ? 'datetime' : mode}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleChange}
            themeVariant={isDark ? 'dark' : 'light'} // ✅ Força o tema correto
            textColor={theme.colors.text} // ✅ Cor do texto
            accentColor={theme.colors.primary} // ✅ Cor de destaque
        />
    );

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    { color: theme.colors.textSoft },
                ]}
            >
                {label}
            </Text>

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setOpen(true)}
                style={[
                    styles.field,
                    {
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.card,
                    },
                ]}
            >
                <Ionicons name="calendar-outline" size={18} color={theme.colors.textSoft} />
                <Text
                    style={{
                        marginLeft: 8,
                        fontSize: 15,
                        color: value ? theme.colors.text : theme.colors.textMuted,
                    }}
                >
                    {value ? formatted : placeholder}
                </Text>
            </TouchableOpacity>

            {open && Platform.OS === 'ios' && (
                <Modal
                    transparent
                    animationType="slide"
                    onRequestClose={() => setOpen(false)}
                >
                    <View style={[styles.modalBackdrop, { backgroundColor: theme.colors.overlay }]}>
                        <View
                            style={[
                                styles.modalContent,
                                { backgroundColor: theme.colors.card },
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                    }}
                                >
                                    {label}
                                </Text>
                                <TouchableOpacity onPress={() => setOpen(false)}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: theme.colors.primary,
                                            fontWeight: '600',
                                        }}
                                    >
                                        Concluir
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {Picker}
                        </View>
                    </View>
                </Modal>
            )}

            {open && Platform.OS === 'android' && Picker}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        marginBottom: 6,
        fontWeight: '500',
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 14,
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
});