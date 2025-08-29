import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeStore } from '@/stores/themeStore';
import { useScreenColors } from './ScreenWrapper';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 24, 
  style 
}) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { iconColor } = useScreenColors();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={size}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
  },
});
