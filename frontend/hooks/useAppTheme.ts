import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeStore } from '@/stores/themeStore';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode, isDark, setThemeMode, isHydrated } = useThemeStore();

  // Update isDark when system color scheme changes (only for 'system' mode)
  useEffect(() => {
    if (themeMode === 'system' && isHydrated) {
      const newIsDark = systemColorScheme === 'dark';
      useThemeStore.setState({ isDark: newIsDark });
    }
  }, [systemColorScheme, themeMode, isHydrated]);

  return {
    themeMode,
    isDark,
    systemColorScheme,
    setThemeMode,
    isHydrated,
  };
}
