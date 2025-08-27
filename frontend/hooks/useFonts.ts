import { Typography } from '@/constants/Theme';

export const useFonts = () => {
  return {
    // Primary font family (Poppins)
    primary: {
      regular: Typography.fonts.primary.regular,
      medium: Typography.fonts.primary.medium,
      semibold: Typography.fonts.primary.semibold,
      bold: Typography.fonts.primary.bold,
    },
    // Secondary font family (Inter)
    secondary: {
      regular: Typography.fonts.secondary.regular,
      medium: Typography.fonts.secondary.medium,
      semibold: Typography.fonts.secondary.semibold,
      bold: Typography.fonts.secondary.bold,
    },
    // Monospace font
    mono: Typography.fonts.mono,
  };
};

// Font style helpers
export const getFontStyle = (family: 'primary' | 'secondary' | 'mono', weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
  const fonts = useFonts();
  
  if (family === 'mono') {
    return { fontFamily: fonts.mono };
  }
  
  return { fontFamily: fonts[family][weight] };
};
