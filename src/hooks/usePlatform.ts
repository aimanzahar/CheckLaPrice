import { Platform } from 'react-native';

export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isNative: boolean;
}

export const usePlatform = (): PlatformInfo => {
  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
    isNative: Platform.OS === 'ios' || Platform.OS === 'android',
  };
};