// src/components/ui/ThemedButton.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'ghost';
    style?: ViewStyle;
    textStyle?: TextStyle;
    rightIcon?: React.ReactNode;
};

export const ThemedButton: React.FC<Props> = ({
    title,
    onPress,
    loading,
    variant = 'primary',
    style,
    textStyle,
    rightIcon,
}) => {
    const { theme } = useTheme();

    const isPrimary = variant === 'primary';

    const backgroundStyle: ViewStyle = isPrimary
        ? {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
        }
        : {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border,
        };

    const textColor = isPrimary ? '#FFFFFF' : theme.colors.text;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={loading}
            style={[styles.button, backgroundStyle, style]}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <View style={styles.contentRow}>
                    <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
                    {rightIcon ? <View style={styles.rightIconWrapper}>{rightIcon}</View> : null}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightIconWrapper: {
        marginLeft: 8,
    },
    text: {
        fontSize: 15,
        fontWeight: '600',
    },
});
