/**
 * Legacy color constants - use Theme.ts for new components
 * @deprecated Use the Theme system from constants/Theme.ts instead
 */

const tintColorLight = '#FF6B35'; // Orange
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#2C2C2C', // Dark gray for better contrast with white
    background: '#fff',
    tint: tintColorLight,
    icon: '#666666', // Medium gray
    tabIconDefault: '#999999', // Light gray
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
