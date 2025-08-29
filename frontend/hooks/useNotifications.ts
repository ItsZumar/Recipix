import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { emailService } from '@/services/emailService';

export const useNotifications = () => {
  const {
    notifications,
    preferences,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
  } = useNotificationStore();

  const shouldShowNotification = (type: Notification['type']) => {
    // Check if push notifications are enabled
    if (!preferences.pushNotifications) {
      return false;
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
      const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      
      // Handle quiet hours that span midnight
      if (startTime > endTime) {
        if (currentTime >= startTime || currentTime <= endTime) {
          return false;
        }
      } else {
        if (currentTime >= startTime && currentTime <= endTime) {
          return false;
        }
      }
    }

    // Check specific notification type preferences
    switch (type) {
      case 'recipe':
        return preferences.recipeNotifications;
      case 'follow':
        return preferences.followNotifications;
      case 'like':
        return preferences.likeNotifications;
      case 'comment':
        return preferences.commentNotifications;
      case 'system':
        return preferences.systemNotifications;
      case 'reminder':
        return preferences.reminderNotifications;
      default:
        return true;
    }
  };

  const shouldSendEmail = (type: Notification['type']) => {
    // Check if email notifications are enabled
    if (!preferences.emailNotifications) {
      return false;
    }

    // Check specific notification type preferences for email
    switch (type) {
      case 'recipe':
        return preferences.recipeNotifications;
      case 'follow':
        return preferences.followNotifications;
      case 'like':
        return preferences.likeNotifications;
      case 'comment':
        return preferences.commentNotifications;
      case 'system':
        return preferences.systemNotifications;
      case 'reminder':
        return preferences.reminderNotifications;
      default:
        return true;
    }
  };

  const createNotification = async (
    type: Notification['type'],
    title: string,
    message: string,
    data?: any,
    userEmail?: string
  ) => {
    // Add to in-app notifications if push notifications are enabled
    if (shouldShowNotification(type)) {
      addNotification({
        type,
        title,
        message,
        data,
      });
    }

    // Send email notification if email notifications are enabled and user email is provided
    if (shouldSendEmail(type) && userEmail) {
      try {
        switch (type) {
          case 'recipe':
            await emailService.sendRecipeNotification(userEmail, title, message, data?.recipeId);
            break;
          case 'follow':
            await emailService.sendFollowNotification(userEmail, title, message, data?.userId);
            break;
          case 'like':
            await emailService.sendLikeNotification(userEmail, title, message, data?.recipeId);
            break;
          case 'comment':
            await emailService.sendCommentNotification(userEmail, title, message, data?.recipeId);
            break;
          case 'system':
            await emailService.sendSystemNotification(userEmail, title, message);
            break;
          case 'reminder':
            await emailService.sendReminderNotification(userEmail, title, message);
            break;
          default:
            console.log(`Email notification would be sent: ${title} - ${message}`);
        }
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }
  };

  const createRecipeNotification = async (title: string, message: string, recipeId?: string, userEmail?: string) => {
    await createNotification('recipe', title, message, { recipeId }, userEmail);
  };

  const createFollowNotification = async (title: string, message: string, userId?: string, userEmail?: string) => {
    await createNotification('follow', title, message, { userId }, userEmail);
  };

  const createLikeNotification = async (title: string, message: string, recipeId?: string, userEmail?: string) => {
    await createNotification('like', title, message, { recipeId }, userEmail);
  };

  const createCommentNotification = async (title: string, message: string, recipeId?: string, userEmail?: string) => {
    await createNotification('comment', title, message, { recipeId }, userEmail);
  };

  const createSystemNotification = async (title: string, message: string, userEmail?: string) => {
    await createNotification('system', title, message, undefined, userEmail);
  };

  const createReminderNotification = async (title: string, message: string, userEmail?: string) => {
    await createNotification('reminder', title, message, undefined, userEmail);
  };

  return {
    // State
    notifications,
    preferences,
    unreadCount,
    
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    
    // Utility functions
    shouldShowNotification,
    shouldSendEmail,
    createNotification,
    createRecipeNotification,
    createFollowNotification,
    createLikeNotification,
    createCommentNotification,
    createSystemNotification,
    createReminderNotification,
  };
};
