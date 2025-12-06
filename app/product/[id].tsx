import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { PriceChart } from '@/components/ui/PriceChart';
import { Button } from '@/components/ui/Button';
import { SIZES } from '@/utils/constants';
import { useThemeColor } from '@/components/Themed';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
  currentPrice: 279.99,
  originalPrice: 349.99,
  image: 'https://via.placeholder.com/300',
  store: 'Amazon',
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI and DSEE Extreme. Crystal-clear hands-free calling with precise voice pickup.',
  url: 'https://www.amazon.com/dp/B0863TXGM3',
  priceHistory: [
    { date: '2024-01-01', price: 349.99 },
    { date: '2024-01-02', price: 329.99 },
    { date: '2024-01-03', price: 319.99 },
    { date: '2024-01-04', price: 299.99 },
    { date: '2024-01-05', price: 289.99 },
    { date: '2024-01-06', price: 279.99 },
    { date: '2024-01-07', price: 279.99 },
  ],
  specifications: {
    'Brand': 'Sony',
    'Model': 'WH-1000XM4',
    'Color': 'Black',
    'Connectivity': 'Bluetooth 5.0',
    'Battery Life': '30 hours',
    'Weight': '254g',
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product] = useState(mockProduct);
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const priceData = {
    labels: product.priceHistory.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    }),
    datasets: [{
      data: product.priceHistory.map(item => item.price),
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this deal: ${product.name} is now $${product.currentPrice} at ${product.store}`,
        url: product.url,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share product');
    }
  };

  const handleVisitStore = () => {
    // TODO: Open product URL in browser
    Alert.alert('Opening Store', `This would open ${product.store} in your browser`);
  };

  const handleSetAlert = () => {
    Alert.alert(
      'Set Price Alert',
      'Get notified when price drops to your target price',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Alert', onPress: () => Alert.alert('Success', 'Price alert has been set') },
      ]
    );
  };

  const handleRemoveFromWishlist = () => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.imageCard}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={64} color={borderColor} />
          </View>
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>-{discountPercentage}%</ThemedText>
            </View>
          )}
        </Card>

        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{product.name}</ThemedText>
            <Button
              title=""
              icon={<Ionicons name="share-outline" size={24} color={tintColor} />}
              onPress={handleShare}
              variant="ghost"
            />
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.currentPrice}>${product.currentPrice}</ThemedText>
            {product.originalPrice && (
              <ThemedText style={styles.originalPrice}>
                ${product.originalPrice}
              </ThemedText>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="storefront-outline" size={20} color={tintColor} />
              <ThemedText style={styles.metaText}>{product.store}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={tintColor} />
              <ThemedText style={styles.metaText}>Updated 2h ago</ThemedText>
            </View>
          </View>
        </View>

        <Card style={styles.chartCard}>
          <ThemedText style={styles.sectionTitle}>Price History</ThemedText>
          <PriceChart data={priceData} height={200} showDots={true} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.statLabel}>Lowest</ThemedText>
              <ThemedText style={styles.statValue}>
                ${Math.min(...product.priceHistory.map(p => p.price)).toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statLabel}>Highest</ThemedText>
              <ThemedText style={styles.statValue}>
                ${Math.max(...product.priceHistory.map(p => p.price)).toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statLabel}>Average</ThemedText>
              <ThemedText style={styles.statValue}>
                ${(product.priceHistory.reduce((sum, p) => sum + p.price, 0) / product.priceHistory.length).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card style={styles.descriptionCard}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>{product.description}</ThemedText>
        </Card>

        <Card style={styles.specsCard}>
          <ThemedText style={styles.sectionTitle}>Specifications</ThemedText>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={[styles.specRow, { borderBottomColor: borderColor }]}>
              <ThemedText style={styles.specLabel}>{key}</ThemedText>
              <ThemedText style={styles.specValue}>{value}</ThemedText>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Visit Store"
            onPress={handleVisitStore}
            style={styles.actionButton}
          />
          <Button
            title="Set Alert"
            onPress={handleSetAlert}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Remove"
            onPress={handleRemoveFromWishlist}
            variant="ghost"
            textStyle={{ color: '#FF3B30' }}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageCard: {
    margin: SIZES.md,
    height: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  discountBadge: {
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    backgroundColor: '#34C759',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: SIZES.md,
    paddingTop: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SIZES.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SIZES.md,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 20,
    textDecorationLine: 'line-through',
    opacity: 0.5,
    marginLeft: SIZES.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SIZES.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.8,
  },
  chartCard: {
    margin: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SIZES.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.lg,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionCard: {
    margin: SIZES.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  specsCard: {
    margin: SIZES.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    padding: SIZES.md,
    gap: SIZES.sm,
  },
  actionButton: {
    marginBottom: SIZES.sm,
  },
  bottomSpacer: {
    height: SIZES.xl,
  },
});