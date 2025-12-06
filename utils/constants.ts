export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  backgroundDark: '#000000',
  text: '#000000',
  textDark: '#FFFFFF',
  border: '#C6C6C8',
  borderDark: '#38383A',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BREAKPOINTS = {
  small: 480,
  medium: 768,
  large: 1024,
  xlarge: 1280,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Format a number as Malaysian Ringgit (RM) currency
 * @param price - The price to format
 * @returns Formatted price string with RM prefix (e.g., "RM 99.00")
 */
export const formatPrice = (price: number): string => {
  return `RM ${price.toFixed(2)}`;
};

/**
 * Format a date into a short relative string for UI (e.g. "2h ago", "Yesterday").
 */
export const formatRelativeTime = (input: string | number | Date): string => {
  if (!input) return 'Updated just now';

  const date = new Date(input);
  if (isNaN(date.getTime())) return 'Updated just now';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString(undefined, options);
};
