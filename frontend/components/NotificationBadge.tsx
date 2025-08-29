import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useNotificationStore } from '@/stores/notificationStore';
import { wp, hp } from '@/utils/responsive';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  style?: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  size = 'medium', 
  showCount = true,
  style 
}) => {
  const { unreadCount } = useNotificationStore();

  if (unreadCount === 0) {
    return null;
  }

  const sizeStyles = {
    small: {
      width: wp(3),
      height: wp(3),
      borderRadius: wp(1.5),
      fontSize: wp(2),
    },
    medium: {
      width: wp(4),
      height: wp(4),
      borderRadius: wp(2),
      fontSize: wp(2.5),
    },
    large: {
      width: wp(5),
      height: wp(5),
      borderRadius: wp(2.5),
      fontSize: wp(3),
    },
  };

  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <View style={[styles.container, sizeStyles[size], style]}>
      {showCount && (
        <ThemedText style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
          {displayCount}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    minHeight: 16,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
