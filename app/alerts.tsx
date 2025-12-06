import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SegmentedControl,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AlertCard } from '@/components/ui/AlertCard';
import { Card } from '@/components/ui/Card';
import { SIZES } from '@/utils/constants';
import { useThemeColor } from '@/components/Themed';

// Mock alerts data
const mockAlerts = [
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
    productName: 'Nintendo Switch - Red Box',
    timestamp: '2 days ago',
    read: true,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tintColor = useThemeColor({}, 'tint');

  const filterOptions = ['All', 'Unread', 'Price Drops', 'News'];

  const filteredAlerts = alerts.filter(alert => {
    switch (selectedIndex) {
      case 0: // All
        return true;
      case 1: // Unread
        return !alert.read;
      case 2: // Price Drops
        return alert.type === 'price_drop';
      case 3: // News
        return alert.type === 'news_alert' || alert.type === 'trend_warning';
      default:
        return true;
    }
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest alerts from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAlertPress = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText style={styles.title}>
        Alerts {unreadCount > 0 && `(${unreadCount})`}
      </ThemedText>
      <SegmentedControl
        values={filterOptions}
        selectedIndex={selectedIndex}
        onChange={e => setSelectedIndex(e.nativeEvent.selectedSegmentIndex)}
        tintColor={tintColor}
        style={styles.segmentedControl}
      />
      {unreadCount > 0 && (
        <Card style={styles.markAllCard}>
          <ThemedText onPress={handleMarkAllAsRead} style={styles.markAllText}>
            Mark all as read
          </ThemedText>
        </Card>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyTitle}>No alerts</ThemedText>
      <ThemedText style={styles.emptyMessage}>
        {selectedIndex === 1
          ? "You're all caught up! No unread alerts."
          : 'No alerts match your filter criteria.'}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredAlerts}
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
            onPress={() => handleAlertPress(item.id)}
            onMarkAsRead={() => handleMarkAsRead(item.id)}
            onDelete={() => handleDeleteAlert(item.id)}
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
  segmentedControl: {
    marginBottom: SIZES.md,
  },
  markAllCard: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    padding: 0,
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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