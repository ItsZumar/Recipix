import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Theme, ComponentStyles, getButtonColors } from '@/constants/Theme';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  textStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  style,
  textStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Determine the actual variant based on disabled state
  const actualVariant = disabled ? 'disabled' : variant;
  const buttonColors = getButtonColors(isDark, actualVariant);
  
  // Get size-specific styles
  const sizeStyles = getSizeStyles(size);
  
  // Combine styles
  const buttonStyle = [
    ComponentStyles.button[variant],
    sizeStyles,
    {
      backgroundColor: buttonColors.background,
      borderColor: buttonColors.border,
    },
    style,
  ];
  
  const textColor = buttonColors.text;
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={textColor} 
          size="small" 
        />
      ) : (
        <ThemedText 
          style={[
            styles.text,
            { color: textColor },
            textStyle,
          ]}
        >
          {children}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        paddingVertical: 8,
        paddingHorizontal: 12,
      };
    case 'large':
      return {
        paddingVertical: 16,
        paddingHorizontal: 24,
      };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
