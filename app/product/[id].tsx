import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PriceChart } from '@/components/ui/PriceChart';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { SIZES, formatPrice } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
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

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Fetch product from Convex
  const product = useQuery(
    api.products.get, 
    id ? { id: id as Id<"products"> } : "skip"
  );
  const removeProduct = useMutation(api.products.remove);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  // Loading state
  if (product === undefined) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
      </ThemedView>
    );
  }

  // Not found state
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
        message: `Check out this deal: ${product.name} is now ${formatPrice(product.currentPrice)} at ${product.store}`,
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
          onPress: async () => {
            try {
              await removeProduct({ id: product._id });
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove product');
            }
          },
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
            <ThemedText style={styles.currentPrice}>{formatPrice(product.currentPrice)}</ThemedText>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <ThemedText style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
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
                Alert set for {formatPrice(product.targetPrice)}
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
                <ThemedText style={styles.statValue}>{formatPrice(lowestPrice)}</ThemedText>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(600)} style={styles.stat}>
                <ThemedText style={styles.statLabel}>Highest</ThemedText>
                <ThemedText style={styles.statValue}>{formatPrice(highestPrice)}</ThemedText>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(700)} style={styles.stat}>
                <ThemedText style={styles.statLabel}>Average</ThemedText>
                <ThemedText style={styles.statValue}>{formatPrice(averagePrice)}</ThemedText>
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
  loadingText: {
    marginTop: SIZES.md,
    fontSize: 16,
    opacity: 0.7,
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
