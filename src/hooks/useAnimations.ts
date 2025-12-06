import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

// Animation timing configs
export const TIMING_CONFIGS = {
  fast: { duration: 150, easing: Easing.out(Easing.ease) },
  normal: { duration: 300, easing: Easing.out(Easing.ease) },
  slow: { duration: 500, easing: Easing.out(Easing.ease) },
  spring: { damping: 15, stiffness: 150, mass: 1 },
  bouncy: { damping: 10, stiffness: 100, mass: 0.5 },
};

// Fade in animation hook
export function useFadeIn(delay: number = 0) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.normal));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle, opacity };
}

// Slide in animation hook
export function useSlideIn(
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  delay: number = 0,
  distance: number = 50
) {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(delay, withSpring(0, TIMING_CONFIGS.spring));
    translateY.value = withDelay(delay, withSpring(0, TIMING_CONFIGS.spring));
    opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.fast));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, translateX, translateY, opacity };
}

// Scale in animation hook
export function useScaleIn(delay: number = 0, initialScale: number = 0.8) {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, TIMING_CONFIGS.bouncy));
    opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.fast));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, scale, opacity };
}

// Staggered list animation hook
export function useStaggeredList(itemCount: number, staggerDelay: number = 50) {
  const animatedValues = Array.from({ length: itemCount }, () => ({
    opacity: useSharedValue(0),
    translateY: useSharedValue(30),
  }));

  useEffect(() => {
    animatedValues.forEach((values, index) => {
      const delay = index * staggerDelay;
      values.opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.normal));
      values.translateY.value = withDelay(delay, withSpring(0, TIMING_CONFIGS.spring));
    });
  }, [itemCount]);

  const getItemAnimatedStyle = (index: number) => {
    if (index >= animatedValues.length) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }
    return useAnimatedStyle(() => ({
      opacity: animatedValues[index].opacity.value,
      transform: [{ translateY: animatedValues[index].translateY.value }],
    }));
  };

  return { getItemAnimatedStyle };
}

// Press animation hook
export function usePressAnimation() {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, handlePressIn, handlePressOut };
}

// Pulse animation hook
export function usePulse(active: boolean = true) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, scale };
}

// Shake animation hook (for errors)
export function useShake() {
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { animatedStyle, shake };
}

// Number counter animation
export function useCountAnimation(targetValue: number, duration: number = 1000) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(targetValue, { duration, easing: Easing.out(Easing.ease) });
  }, [targetValue]);

  return animatedValue;
}
