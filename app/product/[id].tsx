import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PriceChart } from '@/components/ui/PriceChart';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn
} from 'react-native-reanimated';

// Sample products for demo
const sampleProducts: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
    currentPrice: 279.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
    store: 'Amazon',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI and DSEE Extreme. Crystal-clear hands-free calling with precise voice pickup.',
    url: 'https://www.amazon.com/dp/B0863TXGM3',
    priceChange: -15.50,
    trend: 'down',
    lastUpdated: '2 hours ago',
    targetPrice: 250,
    priceHistory: [
      { date: '2024-01-01', price: 349.99 },
      { date: '2024-01-02', price: 329.99 },
      { date: '2024-01-03', price: 319.99 },
      { date: '2024-01-04', price: 299.99 },
      { date: '2024-01-05', price: 289.99 },
      { date: '2024-01-06', price: 279.99 },
      { date: '2024-01-07', price: 279.99 },
    ],
  },
  '2': {
    id: '2',
    name: 'Apple iPad Air (5th Generation)',
    currentPrice: 599.00,
    originalPrice: 599.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    store: 'Best Buy',
    description: '10.9-inch Liquid Retina display with True Tone. Apple M1 chip with Neural Engine for next-level performance.',
    priceChange: 0,
    trend: 'stable',
    lastUpdated: '1 hour ago',
    priceHistory: [
      { date: '2024-01-01', price: 599.00 },
      { date: '2024-01-07', price: 599.00 },
    ],
  },
  '3': {
    id: '3',
    name: 'Samsung 65-inch 4K Smart TV',
    currentPrice: 899.99,
    originalPrice: 1099.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    store: 'Target',
    description: 'Crystal UHD 4K Smart TV with HDR. Built-in Alexa and smart home control. AirSlim design.',
    priceChange: 25.00,
    trend: 'up',
    lastUpdated: '3 hours ago',
    targetPrice: 800,
    priceHistory: [
      { date: '2024-01-01', price: 849.99 },
      { date: '2024-01-04', price: 874.99 },
      { date: '2024-01-07', price: 899.99 },
    ],
  },
  '4': {
    id: '4',
    name: 'Nintendo Switch OLED Model',
    currentPrice: 349.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300',
    store: 'Walmart',
    description: '7-inch OLED screen with vibrant colors. Enhanced audio and 64 GB internal storage.',
    priceChange: -10.00,
    trend: 'down',
    lastUpdated: '5 hours ago',
    priceHistory: [
      { date: '2024-01-01', price: 359.99 },
      { date: '2024-01-07', price: 349.99 },
    ],
  },
  '5': {
    id: '5',
    name: 'Dyson V15 Detect Cordless Vacuum',
    currentPrice: 649.99,
    originalPrice: 749.99,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300',
    store: 'Amazon',
    description: 'Laser reveals microscopic dust. Piezo sensor measures and counts dust particles.',
    priceChange: -50.00,
    trend: 'down',
    lastUpdated: '30 minutes ago',
    targetPrice: 600,
    priceHistory: [
      { date: '2024-01-01', price: 699.99 },
      { date: '2024-01-04', price: 699.99 },
      { date: '2024-01-07', price: 649.99 },
    ],
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = sampleProducts[id || '1'];

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  if (!product) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={64} color={borderColor} />
        <ThemedText style={styles.notFoundText}>Product not found</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </ThemedView>
    );
  }

  const priceHistory = product.priceHistory || [];
  const priceData = {
    labels: priceHistory.slice(-7).map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    }),
    datasets: [{
      data: priceHistory.slice(-7).map((item: any) => item.price),
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this deal: ${product.name} is now $${product.currentPrice} at ${product.store}`,
        url: product.url || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share product');
    }
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

  const lowestPrice = priceHistory.length > 0
    ? Math.min(...priceHistory.map((p: any) => p.price))
    : product.currentPrice;
  const highestPrice = priceHistory.length > 0
    ? Math.max(...priceHistory.map((p: any) => p.price))
    : product.currentPrice;
  const averagePrice = priceHistory.length > 0
    ? priceHistory.reduce((sum: number, p: any) => sum + p.price, 0) / priceHistory.length
    : product.currentPrice;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.delay(100).duration(400)}>
          <Card style={styles.imageCard} delay={0}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={64} color={borderColor} />
            </View>
            {discountPercentage > 0 && (
              <Animated.View
                entering={FadeIn.delay(400).duration(300)}
                style={styles.discountBadge}
              >
                <ThemedText style={styles.discountText}>-{discountPercentage}%</ThemedText>
              </Animated.View>
            )}
          </Card>
        </Animated.View>

        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ flex: 1 }}>
              <ThemedText style={styles.title}>{product.name}</ThemedText>
            </Animated.View>
            <Animated.View entering={FadeIn.delay(300)}>
              <Button
                title=""
                icon={<Ionicons name="share-outline" size={24} color={tintColor} />}
                onPress={handleShare}
                variant="ghost"
              />
            </Animated.View>
          </View>

          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.priceRow}>
            <ThemedText style={styles.currentPrice}>${product.currentPrice.toFixed(2)}</ThemedText>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <ThemedText style={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </ThemedText>
            )}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(400)} style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="storefront-outline" size={20} color={tintColor} />
              <ThemedText style={styles.metaText}>{product.store}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={tintColor} />
              <ThemedText style={styles.metaText}>{product.lastUpdated}</ThemedText>
            </View>
          </Animated.View>

          {product.targetPrice && (
            <Animated.View entering={FadeIn.delay(450)} style={styles.targetPriceRow}>
              <Ionicons name="notifications" size={18} color={tintColor} />
              <ThemedText style={styles.targetPriceText}>
                Alert set for ${product.targetPrice.toFixed(2)}
              </ThemedText>
            </Animated.View>
          )}
        </View>

        {priceHistory.length > 1 && (
          <Card style={styles.chartCard} delay={250}>
            <ThemedText style={styles.sectionTitle}>Price History</ThemedText>
            <Animated.View entering={FadeIn.delay(450).duration(500)}>
              <PriceChart data={priceData} height={200} showDots={true} />
            </Animated.View>
            <View style={styles.statsRow}>
              <Animated.View entering={FadeInUp.delay(500)} style={styles.stat}>
                <ThemedText style={styles.statLabel}>Lowest</ThemedText>
                <ThemedText style={styles.statValue}>${lowestPrice.toFixed(2)}</ThemedText>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(600)} style={styles.stat}>
                <ThemedText style={styles.statLabel}>Highest</ThemedText>
                <ThemedText style={styles.statValue}>${highestPrice.toFixed(2)}</ThemedText>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(700)} style={styles.stat}>
                <ThemedText style={styles.statLabel}>Average</ThemedText>
                <ThemedText style={styles.statValue}>${averagePrice.toFixed(2)}</ThemedText>
              </Animated.View>
            </View>
          </Card>
        )}

        {/* Description & Actions Section */}
        {product.description && (
          <Card style={styles.descriptionCard} delay={500}>
            <Animated.View entering={FadeInUp.delay(550)}>
              {/* Description Header */}
              <View style={styles.descriptionHeader}>
                <View style={styles.descriptionTitleRow}>
                  <Ionicons name="information-circle-outline" size={20} color={tintColor} />
                  <ThemedText style={styles.descriptionTitle}>About this product</ThemedText>
                </View>
              </View>

              {/* Description Text */}
              <ThemedText style={styles.description}>{product.description}</ThemedText>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <Button
                  title="Set Price Alert"
                  onPress={handleSetAlert}
                  variant="outline"
                  icon={<Ionicons name="notifications-outline" size={18} color={tintColor} />}
                  style={styles.actionButton}
                  textStyle={styles.actionButtonText}
                />
              </View>
            </Animated.View>
          </Card>
        )}

        {/* Remove from Wishlist */}
        <View style={styles.removeSection}>
          <Animated.View entering={FadeIn.delay(700)}>
            <Button
              title="Remove from Wishlist"
              onPress={handleRemoveFromWishlist}
              variant="ghost"
              icon={<Ionicons name="heart-dislike-outline" size={18} color="#FF3B30" />}
              textStyle={styles.removeButtonText}
              style={styles.removeButton}
            />
          </Animated.View>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.md,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SIZES.md,
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
  targetPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginTop: SIZES.md,
    padding: SIZES.sm,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  targetPriceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
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
    marginTop: SIZES.sm,
  },
  descriptionHeader: {
    marginBottom: SIZES.md,
  },
  descriptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.75,
    marginBottom: SIZES.lg,
  },
  actionButtonsContainer: {
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeSection: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.md,
    alignItems: 'center',
  },
  removeButton: {
    paddingVertical: SIZES.sm,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: SIZES.xl,
  },
});
