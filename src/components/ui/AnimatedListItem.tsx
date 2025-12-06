import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface AnimatedListItemProps extends ViewProps {
  children: React.ReactNode;
  index: number;
  staggerDelay?: number;
  style?: any;
}

export function AnimatedListItem({
  children,
  index,
  staggerDelay = 50,
  style,
  ...props
}: AnimatedListItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const delay = index * staggerDelay;
    const timingConfig = { duration: 300, easing: Easing.out(Easing.cubic) };
    const springConfig = { damping: 15, stiffness: 120 };

    opacity.value = withDelay(delay, withTiming(1, timingConfig));
    translateY.value = withDelay(delay, withSpring(0, springConfig));
    scale.value = withDelay(delay, withSpring(1, springConfig));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
