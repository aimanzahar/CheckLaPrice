import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';
import { Card } from './Card';
import { SIZES } from '@/utils/constants';

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
}

export function AlertCard({ alert, onPress, onMarkAsRead, onDelete }: AlertCardProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#1a1a1a' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'price_drop':
        return {
          icon: 'arrow-down-circle',
          iconColor: '#34C759',
          bgColor: useThemeColor({ light: '#e8f5e9', dark: '#0d2818' }, 'success'),
        };
      case 'price_hike':
        return {
          icon: 'arrow-up-circle',
          iconColor: '#FF3B30',
          bgColor: useThemeColor({ light: '#ffebee', dark: '#2d0b0e' }, 'error'),
        };
      case 'trend_warning':
        return {
          icon: 'warning',
          iconColor: '#FF9500',
          bgColor: useThemeColor({ light: '#fff3e0', dark: '#2d1f00' }, 'warning'),
        };
      case 'news_alert':
        return {
          icon: 'newspaper',
          iconColor: '#007AFF',
          bgColor: useThemeColor({ light: '#e3f2fd', dark: '#0d1929' }, 'info'),
        };
      default:
        return {
          icon: 'information-circle',
          iconColor: '#8E8E93',
          bgColor: backgroundColor,
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Card
      variant="outlined"
      style={[
        styles.container,
        !alert.read && { backgroundColor: config.bgColor, borderColor: config.iconColor },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name={config.icon}
              size={24}
              color={config.iconColor}
            />
            <Text style={[styles.title, { color: textColor }]}>{alert.title}</Text>
          </View>
          <View style={styles.actions}>
            {!alert.read && onMarkAsRead && (
              <TouchableOpacity onPress={onMarkAsRead} style={styles.actionButton}>
                <Ionicons name="checkmark-circle-outline" size={20} color={config.iconColor} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Ionicons name="close-circle-outline" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={[styles.productName, { color: textColor }]}>{alert.productName}</Text>

        <Text style={[styles.message, { color: textColor }]} numberOfLines={3}>
          {alert.message}
        </Text>

        <Text style={[styles.timestamp, { color: borderColor }]}>{alert.timestamp}</Text>
      </TouchableOpacity>
    </Card>
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