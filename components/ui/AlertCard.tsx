import { useThemeColor } from '@/components/Themed';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  Layout,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Card } from './Card';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AlertCardProps {
  alert: {
    id: string;
    type: 'price_drop' | 'price_hike' | 'trend_warning' | 'news_alert';
    title: string;
    message: string;
    productName: string;
    timestamp: string;
    read: boolean;
  };
  onPress: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
  index?: number;
}

export function AlertCard({ alert, onPress, onMarkAsRead, onDelete, index = 0 }: AlertCardProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  // Animation values
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const actionScale = useSharedValue(1);

  // Unread pulse animation
  useEffect(() => {
    if (!alert.read) {
      iconScale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [alert.read]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleActionPressIn = () => {
    actionScale.value = withSpring(0.8, { damping: 15, stiffness: 400 });
  };

  const handleActionPressOut = () => {
    actionScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const actionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: actionScale.value }],
  }));

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'price_drop':
        return {
          icon: 'arrow-down-circle' as const,
          iconColor: '#34C759',
          bgColor: '#e8f5e9',
        };
      case 'price_hike':
        return {
          icon: 'arrow-up-circle' as const,
          iconColor: '#FF3B30',
          bgColor: '#ffebee',
        };
      case 'trend_warning':
        return {
          icon: 'warning' as const,
          iconColor: '#FF9500',
          bgColor: '#fff3e0',
        };
      case 'news_alert':
        return {
          icon: 'newspaper' as const,
          iconColor: '#007AFF',
          bgColor: '#e3f2fd',
        };
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: '#8E8E93',
          bgColor: backgroundColor,
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 80).duration(300).springify()}
      exiting={SlideOutRight.duration(200)}
      layout={Layout.springify().damping(15)}
    >
      <Card
        variant="outlined"
        animated={false}
        style={[
          styles.container,
          !alert.read && { backgroundColor: config.bgColor, borderColor: config.iconColor },
        ]}
      >
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.content, cardStyle]}
        >
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Animated.View style={iconStyle}>
                <Ionicons
                  name={config.icon}
                  size={24}
                  color={config.iconColor}
                />
              </Animated.View>
              <Text style={[styles.title, { color: textColor }]}>{alert.title}</Text>
              {!alert.read && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={[styles.unreadDot, { backgroundColor: config.iconColor }]}
                />
              )}
            </View>
            <View style={styles.actions}>
              {!alert.read && onMarkAsRead && (
                <AnimatedPressable
                  onPress={onMarkAsRead}
                  onPressIn={handleActionPressIn}
                  onPressOut={handleActionPressOut}
                  style={[styles.actionButton, actionStyle]}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color={config.iconColor} />
                </AnimatedPressable>
              )}
              {onDelete && (
                <AnimatedPressable
                  onPress={onDelete}
                  onPressIn={handleActionPressIn}
                  onPressOut={handleActionPressOut}
                  style={[styles.actionButton, actionStyle]}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#8E8E93" />
                </AnimatedPressable>
              )}
            </View>
          </View>

          <Text style={[styles.productName, { color: textColor }]}>{alert.productName}</Text>

          <Text style={[styles.message, { color: textColor }]} numberOfLines={3}>
            {alert.message}
          </Text>

          <Text style={[styles.timestamp, { color: borderColor }]}>{alert.timestamp}</Text>
        </AnimatedPressable>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.xs,
    borderLeftWidth: 4,
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SIZES.sm,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SIZES.xs,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SIZES.xs,
    marginLeft: SIZES.xs,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SIZES.sm,
  },
  timestamp: {
    fontSize: 12,
    textAlign: 'right',
  },
});