import { Text as ThemedText, View as ThemedView, useThemeColor } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/providers/ThemeProvider';
import { SIZES } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  const themeOptions: { label: string; value: ThemeMode; icon: string }[] = [
    { label: 'Light', value: 'light', icon: 'sunny' },
    { label: 'Dark', value: 'dark', icon: 'moon' },
    { label: 'System', value: 'system', icon: 'phone-portrait' },
  ];

  const handleSetupConvex = () => {
    Alert.alert(
      'Setup Convex',
      'Run "npx convex dev" in your terminal to set up the Convex backend. This will enable cloud sync for products, alerts, and settings.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        </Animated.View>

        <Card style={styles.card} delay={150}>
          <ThemedText style={styles.cardTitle}>Theme</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Choose your preferred color scheme
          </ThemedText>

          <View style={styles.themeOptions}>
            {themeOptions.map((option, index) => (
              <Animated.View
                key={option.value}
                entering={FadeInUp.delay(200 + index * 50)}
              >
                <Pressable
                  style={[
                    styles.themeOption,
                    {
                      borderColor: theme === option.value ? tintColor : borderColor,
                      backgroundColor: theme === option.value
                        ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,122,255,0.1)')
                        : 'transparent',
                    },
                  ]}
                  onPress={() => setTheme(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={theme === option.value ? tintColor : borderColor}
                  />
                  <ThemedText
                    style={[
                      styles.themeLabel,
                      theme === option.value && { color: tintColor, fontWeight: '600' },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  {theme === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={tintColor} />
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Card>

        {/* Quick Toggle */}
        <Card style={styles.card} delay={250}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={tintColor}
                style={styles.toggleIcon}
              />
              <View>
                <ThemedText style={styles.toggleLabel}>Dark Mode</ThemedText>
                <ThemedText style={styles.toggleDescription}>
                  {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: borderColor, true: tintColor }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* Convex Setup Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <ThemedText style={styles.sectionTitle}>Cloud Sync</ThemedText>
        </Animated.View>

        <Card style={styles.card} delay={350}>
          <View style={styles.setupRow}>
            <Ionicons name="cloud-outline" size={24} color={tintColor} />
            <View style={styles.setupInfo}>
              <ThemedText style={styles.cardTitle}>Convex Backend</ThemedText>
              <ThemedText style={styles.cardDescription}>
                Enable cloud sync to store products and alerts
              </ThemedText>
            </View>
          </View>
          <Button
            title="Learn How to Setup"
            onPress={handleSetupConvex}
            variant="outline"
            size="small"
          />
        </Card>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
        </Animated.View>

        <Card style={styles.card} delay={450}>
          <View style={styles.aboutRow}>
            <ThemedText style={styles.aboutLabel}>Version</ThemedText>
            <ThemedText style={styles.aboutValue}>1.0.0</ThemedText>
          </View>
          <View style={[styles.aboutRow, { borderTopWidth: 1, borderTopColor: borderColor }]}>
            <ThemedText style={styles.aboutLabel}>Built with</ThemedText>
            <ThemedText style={styles.aboutValue}>Expo + Convex</ThemedText>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
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
  },
  scrollContent: {
    padding: SIZES.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
    marginLeft: SIZES.xs,
  },
  card: {
    marginBottom: SIZES.sm,
    padding: SIZES.md,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: SIZES.md,
  },
  themeOptions: {
    gap: SIZES.sm,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    borderWidth: 2,
    gap: SIZES.md,
  },
  themeLabel: {
    flex: 1,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    marginRight: SIZES.md,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  toggleDescription: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  setupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.md,
    marginBottom: SIZES.sm,
  },
  setupInfo: {
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    opacity: 0.6,
  },
  bottomSpacer: {
    height: SIZES.xl,
  },
});
