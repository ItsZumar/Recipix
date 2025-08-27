import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';

interface FollowButtonProps {
  isFollowing: boolean;
  onPress: () => void;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onPress,
  loading = false,
  size = 'medium',
  variant = 'outlined',
}) => {
  const { textColor, tintColor, backgroundColor, iconColor } = useScreenColors();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: wp(3),
          paddingVertical: hp(0.8),
          fontSize: wp(3),
          iconSize: wp(4),
        };
      case 'large':
        return {
          paddingHorizontal: wp(5),
          paddingVertical: hp(1.5),
          fontSize: wp(4),
          iconSize: wp(5),
        };
      default:
        return {
          paddingHorizontal: wp(4),
          paddingVertical: hp(1.2),
          fontSize: wp(3.5),
          iconSize: wp(4.5),
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getButtonStyles = () => {
    const baseStyles = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: wp(2),
      borderWidth: 1,
      gap: wp(1.5),
      ...sizeStyles,
    };

    if (variant === 'filled') {
      return {
        ...baseStyles,
        backgroundColor: isFollowing ? backgroundColor : tintColor,
        borderColor: isFollowing ? iconColor : tintColor,
      };
    }

    return {
      ...baseStyles,
      backgroundColor: 'transparent',
      borderColor: isFollowing ? iconColor : tintColor,
    };
  };

  const getTextStyles = () => {
    const baseStyles = {
      fontSize: sizeStyles.fontSize,
      fontWeight: '600' as const,
    };

    if (variant === 'filled') {
      return {
        ...baseStyles,
        color: isFollowing ? textColor : '#fff',
      };
    }

    return {
      ...baseStyles,
      color: isFollowing ? textColor : tintColor,
    };
  };

  const getIconColor = () => {
    if (variant === 'filled') {
      return isFollowing ? textColor : '#fff';
    }
    return isFollowing ? textColor : tintColor;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles()]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <Ionicons
          name={isFollowing ? 'person-remove' : 'person-add'}
          size={sizeStyles.iconSize}
          color={getIconColor()}
        />
      )}
      <ThemedText style={getTextStyles()}>
        {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: wp(20),
  },
});
