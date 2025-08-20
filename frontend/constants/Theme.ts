import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
export const wp = (percentage: number) => (screenWidth * percentage) / 100;
export const hp = (percentage: number) => (screenHeight * percentage) / 100;

// Color Palette
export const Colors = {
  // Primary Colors
  orange: {
    primary: '#FF6B35',
    light: '#FF8A65',
    dark: '#E55A2B',
    veryLight: '#FFF8F5',
    transparent: 'rgba(255, 107, 53, 0.1)',
  },
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Status Colors
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Theme Configuration
export const Theme = {
  light: {
    // Background Colors
    background: Colors.white,
    surface: Colors.gray[50],
    card: Colors.orange.veryLight,
    input: Colors.orange.veryLight,
    
    // Text Colors
    text: {
      primary: Colors.gray[900],
      secondary: Colors.gray[700],
      tertiary: Colors.gray[500],
      inverse: Colors.white,
    },
    
    // Interactive Colors
    tint: Colors.orange.primary,
    icon: Colors.gray[600],
    border: Colors.gray[300],
    
    // Button Colors
    button: {
      primary: {
        background: Colors.orange.primary,
        text: Colors.white,
        border: Colors.orange.primary,
      },
      secondary: {
        background: Colors.orange.transparent,
        text: Colors.orange.primary,
        border: Colors.orange.primary,
      },
      outline: {
        background: 'transparent',
        text: Colors.orange.primary,
        border: Colors.orange.primary,
      },
      disabled: {
        background: Colors.gray[300],
        text: Colors.gray[500],
        border: Colors.gray[300],
      },
    },
    
    // Status Colors
    status: {
      success: Colors.success,
      error: Colors.error,
      warning: Colors.warning,
      info: Colors.info,
    },
  },
  
  dark: {
    // Background Colors
    background: '#151718',
    surface: '#1E1E1E',
    card: '#2A2A2A',
    input: '#2A2A2A',
    
    // Text Colors
    text: {
      primary: '#ECEDEE',
      secondary: '#9BA1A6',
      tertiary: '#687076',
      inverse: '#151718',
    },
    
    // Interactive Colors
    tint: Colors.white,
    icon: '#9BA1A6',
    border: '#2A2A2A',
    
    // Button Colors
    button: {
      primary: {
        background: Colors.white,
        text: '#151718',
        border: Colors.white,
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        text: Colors.white,
        border: Colors.white,
      },
      outline: {
        background: 'transparent',
        text: Colors.white,
        border: Colors.white,
      },
      disabled: {
        background: '#2A2A2A',
        text: '#687076',
        border: '#2A2A2A',
      },
    },
    
    // Status Colors
    status: {
      success: Colors.success,
      error: Colors.error,
      warning: Colors.warning,
      info: Colors.info,
    },
  },
};

// Typography
export const Typography = {
  sizes: {
    xs: wp(2.5),
    sm: wp(3),
    base: wp(4),
    lg: wp(4.5),
    xl: wp(5),
    '2xl': wp(6),
    '3xl': wp(7),
    '4xl': wp(8),
  },
  
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fonts: {
    // Primary font family
    primary: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semibold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    // Secondary font family
    secondary: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semibold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
    },
    // Monospace font
    mono: 'SpaceMono',
  },
};

// Spacing
export const Spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(5),
  '2xl': wp(6),
  '3xl': wp(8),
  '4xl': wp(10),
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: wp(1),
  md: wp(2),
  lg: wp(3),
  xl: wp(4),
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Component Styles
export const ComponentStyles = {
  button: {
    primary: {
      paddingVertical: hp(1.5),
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...Shadows.sm,
    },
    secondary: {
      paddingVertical: hp(1.5),
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
    },
    outline: {
      paddingVertical: hp(1.5),
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
    },
  },
  
  input: {
    paddingVertical: hp(1.5),
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: Typography.sizes.base,
    borderWidth: 1,
  },
  
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
};

// Export theme utilities
export const getThemeColors = (isDark: boolean) => isDark ? Theme.dark : Theme.light;
export const getButtonColors = (isDark: boolean, variant: 'primary' | 'secondary' | 'outline' | 'disabled' = 'primary') => 
  getThemeColors(isDark).button[variant];
