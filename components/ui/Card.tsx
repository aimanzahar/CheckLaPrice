import { useThemeColor } from '@/components/Themed';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewProps } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'outlined' | 'elevated';
  animated?: boolean;
  delay?: number;
  pressable?: boolean;
  onPress?: () => void;
}

export function Card({
  children,
  style,
  variant = 'default',
  animated = true,
  delay = 0,
  pressable = false,
  onPress,
  ...props
}: CardProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');

  // Entrance animation
  const opacity = useSharedValue(animated ? 0 : 1);
  const translateY = useSharedValue(animated ? 15 : 0);
  const scale = useSharedValue(animated ? 0.98 : 1);

  // Press animation
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      const timingConfig = { duration: 300, easing: Easing.out(Easing.cubic) };
      const springConfig = { damping: 15, stiffness: 120 };

      opacity.value = withDelay(delay, withTiming(1, timingConfig));
      translateY.value = withDelay(delay, withSpring(0, springConfig));
      scale.value = withDelay(delay, withSpring(1, springConfig));
    }
  }, []);

  const handlePressIn = () => {
    if (pressable || onPress) {
      pressScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (pressable || onPress) {
      pressScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  };

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value * pressScale.value },
    ],
  }));

  const getCardStyle = () => {
    const baseStyle: any[] = [styles.card, { backgroundColor, borderColor }];

    if (variant === 'elevated') {
      baseStyle.push(styles.elevated);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlined);
    }

    return baseStyle;
  };

  if (pressable || onPress) {
    return (
      <AnimatedPressable
        style={[getCardStyle(), entranceStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View
      style={[getCardStyle(), entranceStyle, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  outlined: {
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
});