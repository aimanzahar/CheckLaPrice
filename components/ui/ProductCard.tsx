import { useThemeColor } from '@/components/Themed';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    Layout,
    SlideOutLeft,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Card } from './Card';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    currentPrice: number;
    originalPrice?: number;
    image: string;
    store: string;
    priceChange?: number;
    trend?: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  onPress: () => void;
  onDelete?: () => void;
  index?: number;
}

export function ProductCard({ product, onPress, onDelete, index = 0 }: ProductCardProps) {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const successColor = '#34C759';
  const errorColor = '#FF3B30';
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  // Press animation
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  // Delete button animation
  const deleteScale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.05, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    shadowOpacity.value = withTiming(0.1, { duration: 150 });
  };

  const handleDeletePressIn = () => {
    deleteScale.value = withSequence(
      withSpring(0.8, { damping: 10, stiffness: 400 }),
      withSpring(1.1, { damping: 10, stiffness: 200 })
    );
  };

  const handleDeletePressOut = () => {
    deleteScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const priceChangeColor = product.trend === 'up' ? errorColor : successColor;
  const priceChangeIcon = product.trend === 'up' ? 'trending-up' : 'trending-down';
  const hasDiscount = product.originalPrice && product.originalPrice > product.currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.currentPrice) / product.originalPrice!) * 100)
    : 0;

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(300)}
      exiting={SlideOutLeft.duration(200)}
      layout={Layout.springify().damping(15)}
    >
      <Card style={styles.container} animated={false}>
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.content, animatedCardStyle]}
        >
          <Animated.Image
            source={{ uri: product.image }}
            style={styles.image}
            sharedTransitionTag={`product-image-${product.id}`}
          />

          <View style={styles.details}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
                {product.name}
              </Text>
              {onDelete && (
                <AnimatedPressable
                  onPress={onDelete}
                  onPressIn={handleDeletePressIn}
                  onPressOut={handleDeletePressOut}
                  style={[styles.deleteButton, deleteButtonStyle]}
                >
                  <Ionicons name="trash-outline" size={20} color={errorColor} />
                </AnimatedPressable>
              )}
            </View>

            <Text style={[styles.store, { color: primaryColor }]}>{product.store}</Text>

            <View style={styles.priceContainer}>
              <Text style={[styles.currentPrice, { color: textColor }]}>
                ${product.currentPrice.toFixed(2)}
              </Text>

              {hasDiscount && (
                <Animated.View
                  entering={FadeIn.delay(200)}
                  style={styles.discountContainer}
                >
                  <Text style={styles.originalPrice}>
                    ${product.originalPrice!.toFixed(2)}
                  </Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discountPercentage}%</Text>
                  </View>
                </Animated.View>
              )}
            </View>

            <View style={styles.footer}>
              {product.priceChange !== undefined && (
                <View style={styles.priceChange}>
                  <Ionicons
                    name={priceChangeIcon}
                    size={16}
                    color={priceChangeColor}
                  />
                  <Text style={[styles.priceChangeText, { color: priceChangeColor }]}>
                    {Math.abs(product.priceChange).toFixed(2)} ({product.trend})
                  </Text>
                </View>
              )}
              <Text style={[styles.lastUpdated, { color: borderColor }]}>
                {product.lastUpdated}
              </Text>
            </View>
          </View>
        </AnimatedPressable>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.sm,
  },
  content: {
    flexDirection: 'row',
    padding: 0,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    marginLeft: SIZES.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: SIZES.sm,
  },
  deleteButton: {
    padding: SIZES.xs,
  },
  store: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: SIZES.xs,
  },
  discountBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.sm,
    minWidth: 0,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  priceChangeText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '500',
    maxWidth: 120,
  },
  lastUpdated: {
    fontSize: 12,
    flexShrink: 1,
    marginLeft: SIZES.xs,
  },
});