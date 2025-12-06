import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SIZES } from '@/utils/constants';
import { useThemeColor } from '@/components/Themed';

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
    currentPrice: 279.99,
    originalPrice: 349.99,
    image: 'https://via.placeholder.com/150',
    store: 'Amazon',
    priceChange: -15.50,
    trend: 'down' as const,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Apple iPad Air (5th Generation)',
    currentPrice: 599.00,
    image: 'https://via.placeholder.com/150',
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
    image: 'https://via.placeholder.com/150',
    store: 'Target',
    priceChange: 25.00,
    trend: 'up' as const,
    lastUpdated: '3 hours ago',
  },
];

export default function HomeScreen() {
  const [products, setProducts] = useState(mockProducts);
  const [refreshing, setRefreshing] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#1a1a1a' }, 'background');

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest prices from API
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={64} color={tintColor} />
      <ThemedText style={styles.emptyTitle}>Track Your First Product</ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Add products to your wishlist and we'll monitor prices for you
      </ThemedText>
      <Button
        title="Add Product"
        onPress={() => router.push('/add-product')}
        style={styles.addButton}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText style={styles.title}>My Wishlist</ThemedText>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{products.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Items</ThemedText>
        </Card>
        <Card style={styles.statCard}>
          <ThemedText style={styles.statNumber}>
            {products.filter(p => p.trend === 'down').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Dropping</ThemedText>
        </Card>
        <Card style={styles.statCard}>
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
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item.id)}
            onDelete={() => handleDeleteProduct(item.id)}
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
