import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/convex/_generated/api';
import { apiService, ScrapedProduct } from '@/src/services/api';
import { formatPrice, SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';

type Step = 'search' | 'selection' | 'details';

export default function AddProductScreen() {
  const addProduct = useMutation(api.products.add);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  
  // Selected product state
  const [selectedProduct, setSelectedProduct] = useState<ScrapedProduct | null>(null);
  
  // Form state
  const [productName, setProductName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('search');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');
  const cardBgColor = useThemeColor({ light: '#ffffff', dark: '#1a1a1a' }, 'background');

  const handleSearchLazada = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await apiService.scrapeLazada(searchQuery.trim());
      
      if (!response.success) {
        setErrorMessage(response.error || 'Failed to search products');
        Alert.alert('Error', response.error || 'Failed to search products');
        return;
      }
      
      if (!response.data || response.data.length === 0) {
        setErrorMessage('No products found. Try a different search term.');
        Alert.alert('No Results', 'No products found. Try a different search term.');
        return;
      }
      
      setScrapedProducts(response.data);
      setStep('selection');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: ScrapedProduct) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setStep('details');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setScrapedProducts([]);
    setSelectedProduct(null);
    setErrorMessage(null);
  };

  const handleBackToSelection = () => {
    setStep('selection');
    setSelectedProduct(null);
  };

  const handleAddToWishlist = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'No product selected');
      return;
    }

    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }

    const price = selectedProduct.price;
    if (price <= 0) {
      Alert.alert('Error', 'Invalid product price');
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        name: productName,
        currentPrice: price,
        originalPrice: selectedProduct.originalPrice || price,
        image: selectedProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        store: 'Lazada',
        url: selectedProduct.url || undefined,
        targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      });

      Alert.alert(
        'Success!',
        'Product has been added to your wishlist',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchStep = () => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText style={styles.title}>Search Lazada</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.subtitle}>
          Enter a product name to search on Lazada
        </ThemedText>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(300).springify()}>
        <Input
          label="Search Query"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="e.g., minecraft, laptop, headphones"
          autoCapitalize="none"
          leftIcon={<Ionicons name="search" size={20} color={tintColor} />}
        />
      </Animated.View>

      {errorMessage && (
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <Button
          title={loading ? 'Searching...' : 'Search Lazada'}
          onPress={handleSearchLazada}
          loading={loading}
          style={styles.searchButton}
          icon={!loading ? <Ionicons name="search" size={20} color="#fff" /> : undefined}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500)}>
        <Card style={styles.tipCard} animated={false}>
          <View style={styles.tip}>
            <Ionicons name="information-circle" size={20} color={tintColor} />
            <ThemedText style={styles.tipText}>
              Enter keywords like product names, brands, or categories to find products on Lazada Malaysia
            </ThemedText>
          </View>
        </Card>
      </Animated.View>
    </Animated.View>
  );

  const renderSelectionStep = () => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToSearch} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={tintColor} />
        </TouchableOpacity>
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerTitle}>
          <ThemedText style={styles.title}>Select Product</ThemedText>
        </Animated.View>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.subtitle}>
          Found {scrapedProducts.length} products for "{searchQuery}"
        </ThemedText>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {scrapedProducts.map((product, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(100 + index * 50).springify()}
              style={styles.productCardWrapper}
            >
              <TouchableOpacity
                onPress={() => handleSelectProduct(product)}
                activeOpacity={0.7}
              >
                <Card style={styles.productCard}>
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.productImage, styles.placeholderImage]}>
                      <Ionicons name="image-outline" size={40} color={borderColor} />
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <ThemedText style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </ThemedText>
                    <ThemedText style={styles.productPrice}>
                      {formatPrice(product.price)}
                    </ThemedText>
                    {product.discount && (
                      <View style={styles.discountBadge}>
                        <ThemedText style={styles.discountText}>{product.discount}</ThemedText>
                      </View>
                    )}
                    {product.ratings && (
                      <View style={styles.ratingsContainer}>
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <ThemedText style={styles.ratingsText}>{product.ratings}</ThemedText>
                        {product.reviews && (
                          <ThemedText style={styles.reviewsText}>({product.reviews})</ThemedText>
                        )}
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderDetailsStep = () => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToSelection} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={tintColor} />
        </TouchableOpacity>
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerTitle}>
          <ThemedText style={styles.title}>Product Details</ThemedText>
        </Animated.View>
        <View style={{ width: 40 }} />
      </View>

      {selectedProduct && (
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Card style={styles.previewCard}>
            <View style={styles.previewRow}>
              {selectedProduct.image ? (
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.previewImage, styles.placeholderImage]}>
                  <Ionicons name="image-outline" size={30} color={borderColor} />
                </View>
              )}
              <View style={styles.previewInfo}>
                <ThemedText style={styles.previewName} numberOfLines={2}>
                  {selectedProduct.name}
                </ThemedText>
                <ThemedText style={styles.previewPrice}>
                  {formatPrice(selectedProduct.price)}
                </ThemedText>
                <View style={styles.storeTag}>
                  <Ionicons name="storefront-outline" size={12} color={tintColor} />
                  <ThemedText style={styles.storeText}>Lazada</ThemedText>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>
      )}

      <Animated.View entering={SlideInUp.delay(300).springify()}>
        <Input
          label="Product Name"
          value={productName}
          onChangeText={setProductName}
          placeholder="Enter product name"
          leftIcon={<Ionicons name="pricetag" size={20} color={tintColor} />}
        />
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(400).springify()}>
        <Input
          label="Target Price (Optional)"
          value={targetPrice}
          onChangeText={setTargetPrice}
          placeholder="Alert me when price drops to..."
          keyboardType="numeric"
          leftIcon={<Ionicons name="notifications" size={20} color={tintColor} />}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500)}>
        <Card style={styles.tipCard} animated={false}>
          <View style={styles.tip}>
            <Ionicons name="information-circle" size={20} color={tintColor} />
            <ThemedText style={styles.tipText}>
              We'll notify you when the price drops to or below your target price
            </ThemedText>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).springify()}>
        <Button
          title={loading ? 'Adding...' : 'Add to Wishlist'}
          onPress={handleAddToWishlist}
          loading={loading}
          style={styles.addButton}
          icon={!loading ? <Ionicons name="add-circle" size={20} color="#fff" /> : undefined}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'search':
        return renderSearchStep();
      case 'selection':
        return renderSelectionStep();
      case 'details':
        return renderDetailsStep();
      default:
        return renderSearchStep();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.md,
    paddingBottom: SIZES.xl * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: SIZES.xl,
  },
  searchButton: {
    marginTop: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.sm,
    marginLeft: -SIZES.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: SIZES.md,
    borderRadius: 8,
    marginTop: SIZES.md,
  },
  errorText: {
    color: '#ef4444',
    marginLeft: SIZES.sm,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  loadingText: {
    marginTop: SIZES.md,
    opacity: 0.7,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: SIZES.md,
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: SIZES.sm,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: SIZES.xs,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: SIZES.xs,
  },
  discountBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: SIZES.xs,
  },
  discountText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '600',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsText: {
    fontSize: 11,
    marginLeft: 2,
    color: '#6b7280',
  },
  reviewsText: {
    fontSize: 11,
    marginLeft: 2,
    color: '#9ca3af',
  },
  previewCard: {
    marginBottom: SIZES.lg,
    padding: SIZES.md,
  },
  previewRow: {
    flexDirection: 'row',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  previewInfo: {
    flex: 1,
    marginLeft: SIZES.md,
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: SIZES.xs,
  },
  storeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  tipCard: {
    marginTop: SIZES.md,
    marginBottom: SIZES.xl,
    padding: 0,
    backgroundColor: 'transparent',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    marginLeft: SIZES.sm,
    lineHeight: 20,
  },
  addButton: {
    marginTop: SIZES.md,
  },
});