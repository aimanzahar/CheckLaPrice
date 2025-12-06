import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';

export default function AddProductScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const [productUrl, setProductUrl] = useState(url || '');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStore, setProductStore] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'url' | 'details'>('url');
  const [extractedData, setExtractedData] = useState<any>(null);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const commonStores = [
    { name: 'Amazon', url: 'amazon.com', icon: 'https://via.placeholder.com/30' },
    { name: 'Best Buy', url: 'bestbuy.com', icon: 'https://via.placeholder.com/30' },
    { name: 'Target', url: 'target.com', icon: 'https://via.placeholder.com/30' },
    { name: 'Walmart', url: 'walmart.com', icon: 'https://via.placeholder.com/30' },
  ];

  const handleExtractProduct = async () => {
    if (!productUrl) {
      Alert.alert('Error', 'Please enter a product URL');
      return;
    }

    setLoading(true);
    try {
      // Simulate product extraction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock extracted data
      const mockData = {
        name: 'Sample Product from URL',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        store: 'Amazon',
        description: 'A great product extracted from the URL',
      };

      setExtractedData(mockData);
      setProductName(mockData.name);
      setStep('details');
    } catch (error) {
      Alert.alert('Error', 'Failed to extract product information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    setStep('details');
  };

  const handleAddToWishlist = async () => {
    if (!productName) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }

    const price = extractedData?.price || parseFloat(productPrice) || 0;
    if (price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      // Simulate saving (in a real app, this would save to Convex)
      await new Promise(resolve => setTimeout(resolve, 1000));

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

  const renderUrlStep = () => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText style={styles.title}>Add Product</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.subtitle}>
          Enter the product URL to automatically fetch details
        </ThemedText>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(300).springify()}>
        <Input
          label="Product URL"
          value={productUrl}
          onChangeText={setProductUrl}
          placeholder="https://www.amazon.com/dp/..."
          autoCapitalize="none"
          keyboardType="url"
          leftIcon={<Ionicons name="link" size={20} color={tintColor} />}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <Button
          title={loading ? 'Extracting...' : 'Extract Product Info'}
          onPress={handleExtractProduct}
          loading={loading}
          style={styles.extractButton}
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500)} style={styles.divider}>
        <View style={[styles.line, { backgroundColor: borderColor }]} />
        <ThemedText style={styles.orText}>OR</ThemedText>
        <View style={[styles.line, { backgroundColor: borderColor }]} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).springify()}>
        <Button
          title="Enter Manually"
          onPress={handleManualEntry}
          variant="outline"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700)}>
        <ThemedText style={styles.storesTitle}>Popular Stores</ThemedText>
      </Animated.View>
      <View style={styles.storesGrid}>
        {commonStores.map((store, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(750 + index * 50).springify()}
            style={{ width: '48%' }}
          >
            <Card style={styles.storeCard} pressable>
              <ThemedText style={styles.storeName}>{store.name}</ThemedText>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderDetailsStep = () => (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.header}>
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Button
            title=""
            icon={<Ionicons name="arrow-back" size={24} color={tintColor} />}
            onPress={() => setStep('url')}
            variant="ghost"
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ThemedText style={styles.title}>Product Details</ThemedText>
        </Animated.View>
        <View style={{ width: 40 }} />
      </View>

      {extractedData && (
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Card style={styles.previewCard} delay={0}>
            <ThemedText style={styles.previewTitle}>Extracted Information</ThemedText>
            <View style={styles.previewContent}>
              <ThemedText style={styles.previewLabel}>Name:</ThemedText>
              <ThemedText style={styles.previewValue}>{extractedData.name}</ThemedText>
              <ThemedText style={styles.previewLabel}>Price:</ThemedText>
              <ThemedText style={styles.previewValue}>${extractedData.price}</ThemedText>
              <ThemedText style={styles.previewLabel}>Store:</ThemedText>
              <ThemedText style={styles.previewValue}>{extractedData.store}</ThemedText>
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

      {!extractedData && (
        <>
          <Animated.View entering={SlideInUp.delay(350).springify()}>
            <Input
              label="Current Price"
              value={productPrice}
              onChangeText={setProductPrice}
              placeholder="299.99"
              keyboardType="numeric"
              leftIcon={<Ionicons name="cash" size={20} color={tintColor} />}
            />
          </Animated.View>

          <Animated.View entering={SlideInUp.delay(375).springify()}>
            <Input
              label="Store"
              value={productStore}
              onChangeText={setProductStore}
              placeholder="Amazon, Best Buy, etc."
              leftIcon={<Ionicons name="storefront" size={20} color={tintColor} />}
            />
          </Animated.View>
        </>
      )}

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
        />
      </Animated.View>
    </Animated.View>
  );

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
          {step === 'url' ? renderUrlStep() : renderDetailsStep()}
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
  extractButton: {
    marginTop: SIZES.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.xl,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: SIZES.md,
    fontSize: 14,
    opacity: 0.7,
  },
  storesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: SIZES.xl,
    marginBottom: SIZES.md,
  },
  storesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storeCard: {
    alignItems: 'center',
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  previewCard: {
    marginBottom: SIZES.lg,
    backgroundColor: '#f0f9ff',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  previewContent: {
    gap: SIZES.xs,
  },
  previewLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '500',
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
