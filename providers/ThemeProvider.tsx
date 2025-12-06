import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [localTheme, setLocalTheme] = useState<ThemeMode>('system');

  const theme = localTheme;

  // Resolve the actual theme to use
  const resolvedTheme: ResolvedTheme =
    theme === 'system'
      ? (systemColorScheme ?? 'light')
      : theme;

  const isDark = resolvedTheme === 'dark';

  const setTheme = (newTheme: ThemeMode) => {
    setLocalTheme(newTheme);
    // Note: To persist theme, install @react-native-async-storage/async-storage
    // and uncomment the AsyncStorage code
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook that returns color scheme based on theme context
export function useAppColorScheme(): 'light' | 'dark' {
  const context = useContext(ThemeContext);
  const systemColorScheme = useSystemColorScheme();

  if (context === undefined) {
    // Fallback to system if context not available
    return systemColorScheme ?? 'light';
  }

  return context.resolvedTheme;
}
