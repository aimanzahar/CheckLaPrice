import { useThemeColor } from '@/components/Themed';
import { formatPrice, SIZES } from '@/utils/constants';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

interface PriceChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }>;
  };
  height?: number;
  showDots?: boolean;
  withDecorator?: boolean;
}

export function PriceChart({
  data,
  height = 220,
  showDots = true,
  withDecorator = true,
}: PriceChartProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1a1a1a' }, 'cardBackground');
  const primaryColor = '#007AFF';
  const secondaryText = useThemeColor({ light: '#666666', dark: '#999999' }, 'placeholder');

  // Calculate price stats
  const priceData = data.datasets[0]?.data || [];
  const highestPrice = Math.max(...priceData);
  const lowestPrice = Math.min(...priceData);
  const currentPrice = priceData[priceData.length - 1];
  const previousPrice = priceData[0];
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(1);
  const isPositive = priceChange >= 0;

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => secondaryText,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#ffffff',
      fill: primaryColor,
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: '500',
    },
    propsForBackgroundLines: {
      strokeDasharray: '4, 4',
      stroke: useThemeColor({ light: '#E8E8E8', dark: '#333333' }, 'border'),
      strokeWidth: 1,
    },
    fillShadowGradient: primaryColor,
    fillShadowGradientFrom: primaryColor,
    fillShadowGradientTo: backgroundColor,
    fillShadowGradientOpacity: 0.15,
    fillShadowGradientFromOpacity: 0.25,
    fillShadowGradientToOpacity: 0,
    strokeWidth: 3,
  };

  return (
    <View style={styles.container}>
      {/* Price Header */}
      {withDecorator && (
        <View style={styles.priceHeader}>
          <View style={styles.currentPriceContainer}>
            <Text style={[styles.currentPrice, { color: primaryColor }]}>
              {formatPrice(currentPrice)}
            </Text>
            {priceChange !== 0 && (
              <View style={[styles.changeBadge, { backgroundColor: isPositive ? '#34C759' : '#FF3B30' }]}>
                <Text style={[styles.changeText, { color: '#fff' }]}>
                  {isPositive ? '+' : ''}{priceChangePercent}%
                </Text>
              </View>
            )}
          </View>
          <View style={styles.priceRangeContainer}>
            <View style={styles.priceRangeItem}>
              <Text style={[styles.priceRangeLabel, { color: secondaryText }]}>Low</Text>
              <Text style={[styles.priceRangeValue, { color: '#34C759' }]}>
                {formatPrice(lowestPrice)}
              </Text>
            </View>
            <View style={styles.priceRangeItem}>
              <Text style={[styles.priceRangeLabel, { color: secondaryText }]}>High</Text>
              <Text style={[styles.priceRangeValue, { color: '#FF3B30' }]}>
                {formatPrice(highestPrice)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Chart */}
      <View style={[styles.chartWrapper, { backgroundColor }]}>
        <LineChart
          data={data}
          width={screenWidth - SIZES.md * 4}
          height={height}
          chartConfig={chartConfig}
          bezier
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withShadow={true}
          withDots={showDots}
          fromZero={false}
          yAxisLabel="RM"
          yAxisSuffix=""
          segments={4}
          style={styles.chart}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: primaryColor }]} />
          <Text style={[styles.legendText, { color: secondaryText }]}>Price History</Text>
        </View>
        <Text style={[styles.legendPeriod, { color: secondaryText }]}>Last 7 days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.sm,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.xs,
  },
  currentPriceContainer: {
    flex: 1,
  },
  currentPriceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  changeBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceRangeContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priceRangeItem: {
    alignItems: 'flex-end',
  },
  priceRangeLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 1,
  },
  priceRangeValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  chartWrapper: {
    marginHorizontal: -SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
    paddingRight: SIZES.md,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.md,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendPeriod: {
    fontSize: 11,
    fontWeight: '400',
  },
});