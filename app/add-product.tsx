import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SIZES } from '@/utils/constants';
import { useThemeColor } from '@/components/Themed';

export default function AddProductScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const [productUrl, setProductUrl] = useState(url || '');
  const [productName, setProductName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'url' | 'details'>('url');
  const [extractedData, setExtractedData] = useState<any>(null);

  const textColor = useThemeColor({}, 'text');
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
      // TODO: Implement actual product extraction API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock extracted data
      setExtractedData({
        name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
        price: 279.99,
        image: 'https://via.placeholder.com/300',
        store: 'Amazon',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
      });

      setProductName(extractedData.name);
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

    setLoading(true);
    try {
      // TODO: Implement actual API call to save product
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
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUrlStep = () => (
    <View>
      <ThemedText style={styles.title}>Add Product</ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter the product URL to automatically fetch details
      </ThemedText>

      <Input
        label="Product URL"
        value={productUrl}
        onChangeText={setProductUrl}
        placeholder="https://www.amazon.com/dp/..."
        autoCapitalize="none"
        keyboardType="url"
        leftIcon={<Ionicons name="link" size={20} color={tintColor} />}
      />

      <Button
        title={loading ? 'Extracting...' : 'Extract Product Info'}
        onPress={handleExtractProduct}
        loading={loading}
        style={styles.extractButton}
      />

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: borderColor }]} />
        <ThemedText style={styles.orText}>OR</ThemedText>
        <View style={[styles.line, { backgroundColor: borderColor }]} />
      </View>

      <Button
        title="Enter Manually"
        onPress={handleManualEntry}
        variant="outline"
      />

      <ThemedText style={styles.storesTitle}>Popular Stores</ThemedText>
      <View style={styles.storesGrid}>
        {commonStores.map((store, index) => (
          <Card key={index} style={styles.storeCard}>
            <ThemedText style={styles.storeName}>{store.name}</ThemedText>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View>
      <View style={styles.header}>
        <Button
          title=""
          icon={<Ionicons name="arrow-back" size={24} color={tintColor} />}
          onPress={() => setStep('url')}
          variant="ghost"
        />
        <ThemedText style={styles.title}>Product Details</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {extractedData && (
        <Card style={styles.previewCard}>
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
      )}

      <Input
        label="Product Name"
        value={productName}
        onChangeText={setProductName}
        placeholder="Enter product name"
        leftIcon={<Ionicons name="pricetag" size={20} color={tintColor} />}
      />

      <Input
        label="Target Price (Optional)"
        value={targetPrice}
        onChangeText={setTargetPrice}
        placeholder="100.00"
        keyboardType="numeric"
        leftIcon={<Ionicons name="cash" size={20} color={tintColor} />}
      />

      <Card style={styles.tipCard}>
        <View style={styles.tip}>
          <Ionicons name="information-circle" size={20} color={tintColor} />
          <ThemedText style={styles.tipText}>
            We'll notify you when the price drops to or below your target price
          </ThemedText>
        </View>
      </Card>

      <Button
        title={loading ? 'Adding...' : 'Add to Wishlist'}
        onPress={handleAddToWishlist}
        loading={loading}
        style={styles.addButton}
      />
    </View>
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
    width: '48%',
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