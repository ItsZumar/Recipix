import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { Theme } from '@/constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { isDark } = useAppTheme();
  const themeColors = Theme[isDark ? 'dark' : 'light'];
  
  // Determine the actual variant (disabled takes precedence)
  const actualVariant = disabled ? 'disabled' : variant;
  const buttonColors = themeColors.button[actualVariant];

  const sizeStyles = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 18,
    },
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: buttonColors.background,
    borderColor: buttonColors.border,
    borderWidth: actualVariant === 'outline' ? 1 : 0,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.6 : 1,
    ...sizeStyles[size],
    ...style,
  };

  const textStyleObj: TextStyle = {
    color: buttonColors.text,
    fontWeight: '600',
    fontSize: sizeStyles[size].fontSize,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={buttonColors.text} 
          style={{ marginRight: 8 }}
        />
      ) : icon ? (
        <React.Fragment>
          {icon}
          <Text style={[textStyleObj, { marginLeft: 8 }]}>{title}</Text>
        </React.Fragment>
      ) : (
        <Text style={textStyleObj}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
