// src/components/ui/RatingStars.tsx
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type Props = {
    value: number;
    onChange?: (v: number) => void;
    size?: number;
    style?: ViewStyle;
};

export const RatingStars: React.FC<Props> = ({ value, onChange, size = 18, style }) => {
    const { theme } = useTheme();

    const isReadonly = !onChange;

    return (
        <View style={[styles.container, style]}>
            {[1, 2, 3, 4, 5].map((i) => {
                const filled = i <= value;
                const color = filled ? '#FBBF24' : theme.colors.textMuted;

                if (isReadonly) {
                    return (
                        <Ionicons
                            key={i}
                            name={filled ? 'star' : 'star-outline'}
                            size={size}
                            color={color}
                            style={{ marginRight: 3 }}
                        />
                    );
                }

                return (
                    <TouchableOpacity key={i} onPress={() => onChange(i)}>
                        <Ionicons
                            name={filled ? 'star' : 'star-outline'}
                            size={size}
                            color={color}
                            style={{ marginRight: 3 }}
                        />
                    </TouchableOpacity>
                );
            })}
            <Text
                style={{
                    fontSize: 13,
                    marginLeft: 4,
                    color: theme.colors.textSoft,
                }}
            >
                {value}/5
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
