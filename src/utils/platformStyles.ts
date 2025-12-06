import { Platform, Dimensions } from 'react-native';
import { BREAKPOINTS } from './constants';

const { width: screenWidth } = Dimensions.get('window');

export const isWeb = Platform.OS === 'web';
export const isMobile = screenWidth < BREAKPOINTS.medium;
export const isTablet = screenWidth >= BREAKPOINTS.medium && screenWidth < BREAKPOINTS.large;
export const isDesktop = screenWidth >= BREAKPOINTS.large;

export const createPlatformStyle = (styles: {
  web?: any;
  ios?: any;
  android?: any;
  default?: any;
}) => {
  if (isWeb && styles.web) return styles.web;
  if (Platform.OS === 'ios' && styles.ios) return styles.ios;
  if (Platform.OS === 'android' && styles.android) return styles.android;
  return styles.default || {};
};

export const createResponsiveStyle = (styles: {
  mobile?: any;
  tablet?: any;
  desktop?: any;
  default?: any;
}) => {
  if (isMobile && styles.mobile) return styles.mobile;
  if (isTablet && styles.tablet) return styles.tablet;
  if (isDesktop && styles.desktop) return styles.desktop;
  return styles.default || {};
};