import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { AlertCard } from '@/components/ui/AlertCard';
import { SIZES } from '@/utils/constants';
import React, { useState } from 'react';
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';

// Sample alerts for demo
const sampleAlerts = [
  {
    id: '1',
    type: 'price_drop' as const,
    title: 'Price Drop Alert',
    message: 'Sony WH-1000XM4 dropped by $20 (15% off) on Amazon. Now at $279.99 - lowest price in 30 days!',
    productName: 'Sony WH-1000XM4 Wireless Headphones',
    timestamp: '10 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'trend_warning' as const,
    title: 'Trend Alert',
    message: 'Prices for Apple iPad Air are trending up. Consider buying now if you need it soon.',
    productName: 'Apple iPad Air (5th Generation)',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'news_alert' as const,
    title: 'Market News',
    message: 'Amazon Prime Day announced for next week. Expected deals on electronics and home goods.',
    productName: 'Multiple Items',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'price_hike' as const,
    title: 'Price Increase Warning',
    message: 'Samsung 65-inch TV price increased by $50 (5% increase) across all stores.',
    productName: 'Samsung 65-inch 4K Smart TV',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'price_drop' as const,
    title: 'Back in Stock - Price Drop',
    message: 'Previously out-of-stock item is now available with 10% discount.',
    productName: 'Nintendo Switch OLED',
    timestamp: '2 days ago',
    read: true,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'border');

  const filterOptions = ['All', 'Unread', 'Price Drops', 'News'];

  const filteredAlerts = alerts.filter(alert => {
    switch (selectedIndex) {
      case 0: return true;
      case 1: return !alert.read;
      case 2: return alert.type === 'price_drop';
      case 3: return alert.type === 'news_alert' || alert.type === 'trend_warning';
      default: return true;
    }
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleAlertPress = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText style={styles.title}>
          Alerts {unreadCount > 0 && `(${unreadCount})`}
        </ThemedText>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(200).duration(300)}>
        <View style={styles.filterRow}>
          {filterOptions.map((option, index) => (
            <Pressable
              key={option}
              style={[
                styles.filterButton,
                selectedIndex === index && { backgroundColor: tintColor },
                { borderColor: selectedIndex === index ? tintColor : borderColor },
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  selectedIndex === index && { color: '#fff' },
                ]}
              >
                {option}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Animated.View>
      {unreadCount > 0 && (
        <Animated.View entering={FadeIn.delay(300)}>
          <Pressable onPress={handleMarkAllAsRead}>
            <ThemedText style={[styles.markAllText, { color: tintColor }]}>
              Mark all as read
            </ThemedText>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.delay(200).duration(400)}
      style={styles.emptyState}
    >
      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <ThemedText style={styles.emptyTitle}>No alerts</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <ThemedText style={styles.emptyMessage}>
          {selectedIndex === 1
            ? "You're all caught up! No unread alerts."
            : 'No alerts match your filter criteria.'}
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredAlerts}
        renderItem={({ item, index }) => (
          <AlertCard
            alert={item}
            onPress={() => handleAlertPress(item.id)}
            onMarkAsRead={() => handleMarkAsRead(item.id)}
            onDelete={() => handleDeleteAlert(item.id)}
            index={index}
          />
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredAlerts.length === 0 ? styles.emptyList : styles.list}
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
    marginBottom: SIZES.md,
  },
  filterButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
