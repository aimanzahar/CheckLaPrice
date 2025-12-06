import { useThemeColor } from '@/components/Themed';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacityProps,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  textStyle?: any;
}

export function AnimatedButton({
  title,
  variant = 'primary',
  loading = false,
  size = 'medium',
  style,
  disabled,
  icon,
  textStyle,
  onPress,
  ...props
}: AnimatedButtonProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];

    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }

    if (variant === 'primary') {
      baseStyle.push({ backgroundColor });
    } else if (variant === 'secondary') {
      baseStyle.push([styles.secondaryButton, { backgroundColor: '#f8f9fa' }]);
    } else if (variant === 'outline') {
      baseStyle.push([styles.outlineButton, { borderColor }]);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostButton);
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text];

    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }

    if (variant === 'primary') {
      baseStyle.push({ color: textColor });
    } else if (variant === 'outline') {
      baseStyle.push({ color: tintColor });
    } else if (variant === 'ghost') {
      baseStyle.push({ color: tintColor });
    } else {
      baseStyle.push({ color: '#333' });
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <AnimatedPressable
      style={[getButtonStyle(), animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? textColor : '#333'}
          size="small"
        />
      ) : (
        <>
          {icon}
          {title ? <Text style={getTextStyle()}>{title}</Text> : null}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },
});
