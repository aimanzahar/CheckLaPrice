import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/components/Themed';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export function Card({ children, style, variant = 'default', padding = 16 }: CardProps) {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');
  const shadowColor = useThemeColor({ light: '#000000', dark: '#000000' }, 'shadow');

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor,
      borderRadius: 12,
      padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getCardStyle(), styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
});