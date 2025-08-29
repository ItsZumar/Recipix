import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/utils/responsive';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { ScreenWrapper, useScreenColors } from '@/components/ScreenWrapper';
import { useNotificationStore, Notification } from '@/stores/notificationStore';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress, 
  onDelete 
}) => {
  const { textColor, iconColor, tintColor } = useScreenColors();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'recipe':
        return 'restaurant';
      case 'follow':
        return 'person-add';
      case 'like':
        return 'heart';
      case 'comment':
        return 'chatbubble';
      case 'system':
        return 'information-circle';
      case 'reminder':
        return 'alarm';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'recipe':
        return '#FF6B35';
      case 'follow':
        return '#4CAF50';
      case 'like':
        return '#E91E63';
      case 'comment':
        return '#2196F3';
      case 'system':
        return '#FF9800';
      case 'reminder':
        return '#9C27B0';
      default:
        return iconColor;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: notification.read ? 'transparent' : tintColor + '10',
          borderLeftColor: getNotificationColor(notification.type),
          borderLeftWidth: notification.read ? 0 : 3,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
          <Ionicons 
            name={getNotificationIcon(notification.type) as any} 
            size={wp(5)} 
            color={getNotificationColor(notification.type)} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <ThemedText style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {notification.title}
          </ThemedText>
          <ThemedText style={[styles.message, { color: iconColor }]} numberOfLines={2}>
            {notification.message}
          </ThemedText>
          <ThemedText style={[styles.time, { color: iconColor }]}>
            {formatTime(notification.timestamp)}
          </ThemedText>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={wp(4)} color={iconColor} />
        </TouchableOpacity>
      </View>
      
      {!notification.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: getNotificationColor(notification.type) }]} />
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { textColor, iconColor } = useScreenColors();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'recipe':
        if (notification.recipeId) {
          router.push(`/recipe/${notification.recipeId}`);
        }
        break;
      case 'follow':
        if (notification.userId) {
          router.push(`/user/${notification.userId}`);
        }
        break;
      case 'like':
      case 'comment':
        if (notification.recipeId) {
          router.push(`/recipe/${notification.recipeId}`);
        }
        break;
      default:
        // For system and reminder notifications, just mark as read
        break;
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearAllNotifications
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onDelete={() => handleDeleteNotification(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off" size={wp(15)} color={iconColor} />
      <ThemedText style={[styles.emptyStateTitle, { color: textColor }]}>
        No notifications yet
      </ThemedText>
      <ThemedText style={[styles.emptyStateSubtitle, { color: iconColor }]}>
        When you receive notifications, they'll appear here
      </ThemedText>
    </View>
  );

  return (
    <ScreenWrapper>
      <Header 
        title="Notifications" 
        leftAccessory={{
          icon: 'arrow-back',
          onPress: () => router.back()
        }}
        rightAccessory={
          notifications.length > 0 ? {
            icon: 'trash',
            onPress: handleClearAll
          } : undefined
        }
      />

      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <ThemedText style={[styles.markAllText, { color: textColor }]}>
              Mark all as read
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={iconColor}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
  },
  markAllContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  markAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  markAllText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  notificationItem: {
    marginVertical: hp(0.5),
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp(4),
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  textContainer: {
    flex: 1,
    marginRight: wp(2),
  },
  title: {
    fontSize: wp(4),
    fontWeight: '600',
    marginBottom: hp(0.25),
  },
  message: {
    fontSize: wp(3.5),
    lineHeight: hp(2.5),
    marginBottom: hp(0.5),
  },
  time: {
    fontSize: wp(3),
    opacity: 0.7,
  },
  deleteButton: {
    padding: wp(1),
  },
  unreadIndicator: {
    position: 'absolute',
    top: wp(4),
    right: wp(4),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  emptyStateTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    marginTop: hp(2),
    marginBottom: hp(1),
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: wp(4),
    textAlign: 'center',
    lineHeight: hp(3),
  },
});
