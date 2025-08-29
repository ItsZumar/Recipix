import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      isDark: false,
      isHydrated: false,
      
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
        // Update isDark based on the new mode
        if (mode === 'light') {
          set({ isDark: false });
        } else if (mode === 'dark') {
          set({ isDark: true });
        }
        // For 'system' mode, isDark will be updated by the hook
      },
      
      toggleTheme: () => {
        const { themeMode } = get();
        if (themeMode === 'system') {
          // If currently system, switch to the opposite of current isDark
          const newMode = get().isDark ? 'light' : 'dark';
          set({ themeMode: newMode, isDark: !get().isDark });
        } else {
          // Toggle between light and dark
          const newMode = themeMode === 'light' ? 'dark' : 'light';
          set({ themeMode: newMode, isDark: newMode === 'dark' });
        }
      },
      
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
