import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PriceChart } from '@/components/ui/PriceChart';
import { SIZES } from '@/utils/constants';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
} from 'react-native-reanimated';

// Mock data for price history
const generateMockPriceData = () => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [299.99, 289.99, 279.99, 284.99, 279.99, 274.99, 279.99],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
});

const newsData = [
  {
    id: '1',
    source: 'TechNews',
    title: 'Sony announces new WH-1000XM5 headphones',
    sentiment: 'negative',
    time: '2 hours ago',
    impact: 'Price may drop further',
  },
  {
    id: '2',
    source: 'MarketWatch',
    title: 'Amazon Prime Day deals expected next month',
    sentiment: 'positive',
    time: '5 hours ago',
    impact: 'Discounts likely',
  },
];

export default function AnalysisScreen() {
  const [selectedProduct, setSelectedProduct] = useState('1');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [priceAlertThreshold, setPriceAlertThreshold] = useState(10);
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const priceData = generateMockPriceData();

  const renderSentimentBadge = (sentiment: string) => {
    const bgColor = sentiment === 'positive' ? '#34C759' : sentiment === 'negative' ? '#FF3B30' : '#FF9500';
    return (
      <View style={[styles.sentimentBadge, { backgroundColor: bgColor }]}>
        <ThemedText style={styles.sentimentText}>
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <ThemedText style={styles.title}>Price Analysis</ThemedText>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <ThemedText style={styles.subtitle}>
              Sony WH-1000XM4 Wireless Headphones
            </ThemedText>
          </Animated.View>
        </View>

        {/* Price Chart */}
        <Card style={styles.chartCard} delay={150}>
          <View style={styles.chartHeader}>
            <ThemedText style={styles.sectionTitle}>7-Day Price Trend</ThemedText>
            <View style={styles.trendBadge}>
              <ThemedText style={styles.trendText}>📉 Trending Down</ThemedText>
            </View>
          </View>
          <Animated.View entering={FadeIn.delay(300).duration(500)}>
            <PriceChart data={priceData} height={200} />
          </Animated.View>
          <View style={styles.priceStats}>
            <Animated.View entering={FadeInUp.delay(400)} style={styles.stat}>
              <ThemedText style={styles.statLabel}>Average</ThemedText>
              <ThemedText style={styles.statValue}>$284.99</ThemedText>
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(500)} style={styles.stat}>
              <ThemedText style={styles.statLabel}>Volatility</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#34C759' }]}>Low</ThemedText>
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(600)} style={styles.stat}>
              <ThemedText style={styles.statLabel}>Prediction</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#34C759' }]}>↓ Drop</ThemedText>
            </Animated.View>
          </View>
        </Card>

        {/* Price Alerts */}
        <Card style={styles.alertCard} delay={250}>
          <ThemedText style={styles.sectionTitle}>Price Alerts</ThemedText>
          <View style={styles.alertRow}>
            <View style={styles.alertInfo}>
              <ThemedText style={styles.alertLabel}>Enable notifications</ThemedText>
              <ThemedText style={styles.alertDescription}>
                Get notified when price drops
              </ThemedText>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: borderColor, true: tintColor }}
            />
          </View>
          <View style={styles.thresholdRow}>
            <ThemedText style={styles.alertLabel}>Alert me at</ThemedText>
            <Button
              title={`${priceAlertThreshold}% drop`}
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
        </Card>

        {/* News & Trends */}
        <Card style={styles.newsCard} delay={350}>
          <ThemedText style={styles.sectionTitle}>Market News & Trends</ThemedText>
          {newsData.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={SlideInRight.delay(400 + index * 100).springify()}
              style={[styles.newsItem, { borderBottomColor: borderColor }]}
            >
              <View style={styles.newsHeader}>
                <ThemedText style={styles.newsSource}>{item.source}</ThemedText>
                {renderSentimentBadge(item.sentiment)}
              </View>
              <ThemedText style={styles.newsTitle}>{item.title}</ThemedText>
              <View style={styles.newsFooter}>
                <ThemedText style={styles.newsTime}>{item.time}</ThemedText>
                <ThemedText style={styles.newsImpact}>{item.impact}</ThemedText>
              </View>
            </Animated.View>
          ))}
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationCard} delay={450}>
          <ThemedText style={styles.sectionTitle}>AI Recommendation</ThemedText>
          <Animated.View entering={FadeIn.delay(550)} style={styles.recommendation}>
            <View style={styles.recommendationIcon}>
              <ThemedText style={styles.recommendationEmoji}>💡</ThemedText>
            </View>
            <View style={styles.recommendationContent}>
              <ThemedText style={styles.recommendationTitle}>
                Good Time to Wait
              </ThemedText>
              <ThemedText style={styles.recommendationText}>
                Price is trending down. Based on market analysis,
                expect a 10-15% drop during upcoming sales events.
              </ThemedText>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(650).springify()}>
            <Button
              title="Set Price Alert"
              onPress={() => {}}
              style={styles.alertButton}
            />
          </Animated.View>
        </Card>
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
    paddingHorizontal: SIZES.md,
  },
  header: {
    paddingVertical: SIZES.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: SIZES.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  trendBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34C759',
  },
  priceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.md,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  alertCard: {
    marginBottom: SIZES.md,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  alertInfo: {
    flex: 1,
  },
  alertLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsCard: {
    marginBottom: SIZES.md,
  },
  newsItem: {
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  sentimentBadge: {
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentimentText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  newsImpact: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  recommendationCard: {
    marginBottom: SIZES.xl,
  },
  recommendation: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
  },
  recommendationIcon: {
    marginRight: SIZES.md,
  },
  recommendationEmoji: {
    fontSize: 24,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  recommendationText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  alertButton: {
    marginTop: SIZES.sm,
  },
});
