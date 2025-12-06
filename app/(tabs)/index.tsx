import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProductCard } from '@/components/ui/ProductCard';
import { api } from '@/convex/_generated/api';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from 'react-native-reanimated';

export default function HomeScreen() {
  // Fetch products from Convex
  const convexProducts = useQuery(api.products.list);
  const removeProduct = useMutation(api.products.remove);
  
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  
  // Transform Convex products to match the expected format
  const products = convexProducts?.map((p: any) => ({
    id: p._id,
    name: p.name,
    currentPrice: p.currentPrice,
    originalPrice: p.originalPrice ?? p.currentPrice,
    image: p.image,
    store: p.store,
    priceChange: p.priceChange ?? 0,
    trend: (p.trend ?? 'stable') as 'up' | 'down' | 'stable',
    lastUpdated: p.lastUpdated ?? 'Unknown',
  })) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    // Convex auto-syncs, so just a brief delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeProduct({ id: productId as any });
            } catch (error) {
              console.error('Error removing product:', error);
              Alert.alert('Error', 'Failed to remove product');
            }
          },
        },
      ]
    );
  };
  
  // Show loading state while data is being fetched
  if (convexProducts === undefined) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.delay(200).duration(400)}
      style={styles.emptyState}
    >
      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <Ionicons name="pricetag-outline" size={64} color={tintColor} />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <ThemedText style={styles.emptyTitle}>Track Your First Product</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(500).springify()}>
        <ThemedText style={styles.emptyMessage}>
          Add products to your wishlist and we'll monitor prices for you
        </ThemedText>
      </Animated.View>
      <Animated.View entering={SlideInUp.delay(600).springify()}>
        <Button
          title="Add Product"
          onPress={() => router.push('/add-product')}
          style={styles.addButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText style={styles.title}>My Wishlist</ThemedText>
      </Animated.View>
      <View style={styles.statsRow}>
        <Card style={styles.statCard} delay={150}>
          <ThemedText style={styles.statNumber}>{products.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Items</ThemedText>
        </Card>
        <Card style={styles.statCard} delay={250}>
          <ThemedText style={styles.statNumber}>
            {products.filter((p: any) => p.trend === 'down').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Dropping</ThemedText>
        </Card>
        <Card style={styles.statCard} delay={350}>
          <ThemedText style={styles.statNumber}>
            ${products.reduce((sum: number, p: any) => sum + p.currentPrice, 0).toFixed(0)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Value</ThemedText>
        </Card>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item.id)}
            onDelete={() => handleDeleteProduct(item.id)}
            index={index}
          />
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={products.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    padding: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SIZES.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.md,
    marginHorizontal: SIZES.xs / 2,
    backgroundColor: 'transparent',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    opacity: 0.7,
  },
  addButton: {
    paddingHorizontal: SIZES.xl,
  },
});
