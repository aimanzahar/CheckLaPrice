import { useThemeColor } from '@/components/Themed';
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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
  showDots = false,
  withDecorator = true,
}: PriceChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const textColor = useThemeColor({}, 'text');
  const gridColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');
  const primaryColor = useThemeColor({}, 'tint');

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 2,
    color: (opacity = 1) => textColor,
    labelColor: (opacity = 1) => textColor,
    style: {
      borderRadius: 16,
    },
    propsForDots: showDots
      ? {
          r: '4',
          strokeWidth: '2',
          stroke: primaryColor,
        }
      : {
          r: '0',
        },
    propsForLabels: {
          fontSize: 10,
    },
    fillShadowGradient: primaryColor,
    fillShadowGradientOpacity: 0.1,
    strokeWidth: 2,
  };

  return (
    <View onLayout={handleLayout} style={{ marginHorizontal: -8 }}>
      {containerWidth > 0 && (
        <LineChart
          data={data}
          width={containerWidth}
          height={height}
          chartConfig={chartConfig}
          bezier
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          withShadow={true}
          withDots={showDots}
          decorator={withDecorator ? () => {
            const highestPrice = Math.max(...data.datasets[0].data);
            const lowestPrice = Math.min(...data.datasets[0].data);
            const currentPrice = data.datasets[0].data[data.datasets[0].data.length - 1];

            return (
              <View>
                <Text
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    color: textColor,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Highest: ${highestPrice.toFixed(2)}
                </Text>
                <Text
                  style={{
                    position: 'absolute',
                    left: 10,
                    bottom: 30,
                    color: textColor,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Lowest: ${lowestPrice.toFixed(2)}
                </Text>
                <Text
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: primaryColor,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  Current: ${currentPrice.toFixed(2)}
                </Text>
              </View>
            );
          } : undefined}
        />
      )}
    </View>
  );
}