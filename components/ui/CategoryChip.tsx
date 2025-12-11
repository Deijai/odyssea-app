// src/components/ui/CategoryChip.tsx
import { useTheme } from '@/hooks/useTheme';
import { VisitedPlaceCategory } from '@/types/trip';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
    label: VisitedPlaceCategory;
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
};

export const CategoryChip: React.FC<Props> = ({
    label,
    selected,
    onPress,
    style,
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? theme.colors.primary : theme.colors.cardSoft,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: selected ? '#FFFFFF' : theme.colors.textSoft },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        marginRight: 8,
    },
    text: {
        fontSize: 13,
        fontWeight: '500',
    },
});
