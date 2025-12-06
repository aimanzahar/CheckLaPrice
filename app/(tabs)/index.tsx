import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  delay: number;
  color: string;
}

const FeatureCard = ({ icon, title, description, delay, color }: FeatureCardProps) => {
  const textColor = useThemeColor({}, 'text');
  
  return (
    <Animated.View entering={SlideInRight.delay(delay).springify()}>
      <Card style={styles.featureCard} variant="elevated" delay={delay}>
        <View style={[styles.featureIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: textColor + '99' }]}>
          {description}
        </ThemedText>
      </Card>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const features = [
    {
      icon: 'pricetag' as const,
      title: 'Smart Wishlist',
      description: 'Add products via URL or manually. Auto-fetch thumbnails, prices & descriptions.',
      color: '#10B981',
    },
    {
      icon: 'trending-down' as const,
      title: 'Price Monitoring',
      description: 'Scheduled price checks with history tracking to detect spikes or drops.',
      color: '#3B82F6',
    },
    {
      icon: 'newspaper' as const,
      title: 'News Intelligence',
      description: 'AI-powered sentiment analysis correlates news with price movements.',
      color: '#8B5CF6',
    },
    {
      icon: 'notifications' as const,
      title: 'Smart Alerts',
      description: 'Get notified on price drops, hikes, and market trend warnings.',
      color: '#F59E0B',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SIZES.md }
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#3B82F620', 'transparent']}
            style={styles.heroGradient}
          />
          
          <Animated.View entering={FadeIn.delay(100).duration(600)}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Ionicons name="pricetag" size={40} color="#fff" />
              </LinearGradient>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ThemedText style={styles.appName}>CheckLaPrice</ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <ThemedText style={styles.tagline}>
              "Know the Price. Beat the Price."
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <ThemedText style={[styles.heroDescription, { color: textColor + 'CC' }]}>
              A smart price-tracking app that helps you make smarter buying decisions
            </ThemedText>
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(500).springify()}
            style={styles.ctaContainer}
          >
            <Button
              title="Start Tracking"
              onPress={() => router.push('/add-product')}
              size="large"
              style={styles.primaryCta}
              icon={<Ionicons name="add-circle-outline" size={22} color="#fff" />}
            />
            <Button
              title="View Wishlist"
              variant="outline"
              onPress={() => router.push('/(tabs)/wishlist')}
              size="large"
              style={styles.secondaryCta}
              icon={<Ionicons name="heart-outline" size={22} color={tintColor} />}
            />
          </Animated.View>
        </View>

        {/* Problem Statement */}
        <View style={styles.section}>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Card style={styles.problemCard} variant="elevated">
              <View style={styles.problemHeader}>
                <Ionicons name="help-circle" size={24} color="#EF4444" />
                <ThemedText style={styles.problemTitle}>The Problem</ThemedText>
              </View>
              <View style={styles.problemList}>
                <View style={styles.problemItem}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" />
                  <ThemedText style={styles.problemText}>
                    Is this a good price or overpriced?
                  </ThemedText>
                </View>
                <View style={styles.problemItem}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" />
                  <ThemedText style={styles.problemText}>
                    Will the price go up or down?
                  </ThemedText>
                </View>
                <View style={styles.problemItem}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" />
                  <ThemedText style={styles.problemText}>
                    Are there events that might affect prices?
                  </ThemedText>
                </View>
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <Card style={styles.solutionCard} variant="elevated">
              <View style={styles.problemHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <ThemedText style={styles.solutionTitle}>Our Solution</ThemedText>
              </View>
              <ThemedText style={[styles.solutionText, { color: textColor + 'DD' }]}>
                CheckLaPrice automates all the research by tracking prices, analyzing news sentiment, and sending alerts so you can buy confidently.
              </ThemedText>
            </Card>
          </Animated.View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <ThemedText style={styles.sectionTitle}>Key Features</ThemedText>
          </Animated.View>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={900 + index * 100}
                color={feature.color}
              />
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Animated.View entering={FadeInDown.delay(1300).springify()}>
            <ThemedText style={styles.sectionTitle}>How It Works</ThemedText>
          </Animated.View>

          <View style={styles.stepsContainer}>
            {
              [
                { step: '1', title: 'Add Product', desc: 'Paste URL or enter manually', icon: 'add-circle' as const },
                { step: '2', title: 'We Track', desc: 'Monitor prices & news 24/7', icon: 'eye' as const },
                { step: '3', title: 'Get Alerted', desc: 'Notified when prices drop', icon: 'notifications' as const },
                { step: '4', title: 'Save Money', desc: 'Buy at the best price', icon: 'wallet' as const },
              ].map((item, index) => (
                <Animated.View
                  key={item.step}
                  entering={FadeInUp.delay(1400 + index * 100).springify()}
                  style={styles.stepItem}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumber}
                  >
                    <Ionicons name={item.icon} size={20} color="#fff" />
                  </LinearGradient>
                  <ThemedText style={styles.stepTitle}>{item.title}</ThemedText>
                  <ThemedText style={[styles.stepDesc, { color: textColor + '99' }]}>
                    {item.desc}
                  </ThemedText>
                </Animated.View>
              ))
            }
          </View>
        </View>

        {/* Bottom CTA */}
        <Animated.View 
          entering={FadeInUp.delay(1800).springify()}
          style={styles.bottomCta}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bottomCtaGradient}
          >
            <ThemedText style={styles.bottomCtaTitle}>
              Ready to Save Money?
            </ThemedText>
            <ThemedText style={styles.bottomCtaSubtitle}>
              Start tracking your first product now
            </ThemedText>
            <Button
              title="Get Started"
              variant="secondary"
              onPress={() => router.push('/add-product')}
              size="large"
              style={styles.bottomCtaButton}
              icon={<Ionicons name="rocket" size={20} color="#3B82F6" />}
            />
          </LinearGradient>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: textColor + '60' }]}>
            Made with ❤️ for smart shoppers
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.xl * 2,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.xl,
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  logoContainer: {
    marginBottom: SIZES.md,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
    marginBottom: SIZES.sm,
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: SIZES.lg,
  },
  ctaContainer: {
    width: '100%',
    gap: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  primaryCta: {
    width: '100%',
  },
  secondaryCta: {
    width: '100%',
  },
  section: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  problemCard: {
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  problemList: {
    gap: SIZES.sm,
  },
  problemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  problemText: {
    fontSize: 14,
    flex: 1,
  },
  solutionCard: {
    padding: SIZES.lg,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  solutionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featuresGrid: {
    gap: SIZES.md,
  },
  featureCard: {
    padding: SIZES.lg,
    borderRadius: 16,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.sm,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SIZES.md,
  },
  stepItem: {
    alignItems: 'center',
    width: (width - SIZES.lg * 2 - SIZES.md * 3) / 2,
    position: 'relative',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.sm,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  bottomCta: {
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.xl * 1.5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomCtaGradient: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  bottomCtaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SIZES.xs,
    textAlign: 'center',
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  bottomCtaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: SIZES.xl * 1.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SIZES.xl,
  },
  footerText: {
    fontSize: 12,
  },
});
