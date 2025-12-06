import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';
import { Card } from './Card';
import { SIZES } from '@/utils/constants';

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
}

export function ProductCard({ product, onPress, onDelete }: ProductCardProps) {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const successColor = '#34C759';
  const errorColor = '#FF3B30';
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const priceChangeColor = product.trend === 'up' ? errorColor : successColor;
  const priceChangeIcon = product.trend === 'up' ? 'trending-up' : 'trending-down';
  const hasDiscount = product.originalPrice && product.originalPrice > product.currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.currentPrice) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
              {product.name}
            </Text>
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={errorColor} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.store, { color: primaryColor }]}>{product.store}</Text>

          <View style={styles.priceContainer}>
            <Text style={[styles.currentPrice, { color: textColor }]}>
              ${product.currentPrice.toFixed(2)}
            </Text>

            {hasDiscount && (
              <View style={styles.discountContainer}>
                <Text style={styles.originalPrice}>
                  ${product.originalPrice!.toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{discountPercentage}%</Text>
                </View>
              </View>
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
      </TouchableOpacity>
    </Card>
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