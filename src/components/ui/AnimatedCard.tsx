import { useThemeColor } from '@/components/Themed';
import React, { useEffect } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface AnimatedCardProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
  delay?: number;
  animationType?: 'fade' | 'slideUp' | 'scale' | 'slideRight';
  duration?: number;
}

export function AnimatedCard({
  children,
  style,
  delay = 0,
  animationType = 'slideUp',
  duration = 300,
  ...props
}: AnimatedCardProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(animationType === 'slideUp' ? 30 : 0);
  const translateX = useSharedValue(animationType === 'slideRight' ? -30 : 0);
  const scale = useSharedValue(animationType === 'scale' ? 0.9 : 1);

  useEffect(() => {
    const timingConfig = { duration, easing: Easing.out(Easing.cubic) };
    const springConfig = { damping: 15, stiffness: 120 };

    opacity.value = withDelay(delay, withTiming(1, timingConfig));
    translateY.value = withDelay(delay, withSpring(0, springConfig));
    translateX.value = withDelay(delay, withSpring(0, springConfig));
    scale.value = withDelay(delay, withSpring(1, springConfig));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor },
        animatedStyle,
        style,
      ]}
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
});
