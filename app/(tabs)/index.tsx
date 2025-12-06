import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProductCard } from '@/components/ui/ProductCard';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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

// Sample products for demo
const sampleProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
    currentPrice: 279.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
    store: 'Amazon',
    priceChange: -15.50,
    trend: 'down' as const,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Apple iPad Air (5th Generation)',
    currentPrice: 599.00,
    originalPrice: 599.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    store: 'Best Buy',
    priceChange: 0,
    trend: 'stable' as const,
    lastUpdated: '1 hour ago',
  },
  {
    id: '3',
    name: 'Samsung 65-inch 4K Smart TV',
    currentPrice: 899.99,
    originalPrice: 1099.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    store: 'Target',
    priceChange: 25.00,
    trend: 'up' as const,
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'Nintendo Switch OLED Model',
    currentPrice: 349.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300',
    store: 'Walmart',
    priceChange: -10.00,
    trend: 'down' as const,
    lastUpdated: '5 hours ago',
  },
  {
    id: '5',
    name: 'Dyson V15 Detect Cordless Vacuum',
    currentPrice: 649.99,
    originalPrice: 749.99,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300',
    store: 'Amazon',
    priceChange: -50.00,
    trend: 'down' as const,
    lastUpdated: '30 minutes ago',
  },
];

export default function HomeScreen() {
  const [products, setProducts] = useState(sampleProducts);
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, 'tint');

  const onRefresh = async () => {
    setRefreshing(true);
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
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
          },
        },
      ]
    );
  };

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
            {products.filter(p => p.trend === 'down').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Dropping</ThemedText>
        </Card>
        <Card style={styles.statCard} delay={350}>
          <ThemedText style={styles.statNumber}>
            ${products.reduce((sum, p) => sum + p.currentPrice, 0).toFixed(0)}
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
