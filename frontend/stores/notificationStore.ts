import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'recipe' | 'follow' | 'like' | 'comment' | 'system' | 'reminder';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  timestamp: Date;
  userId?: string;
  recipeId?: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  recipeNotifications: boolean;
  followNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  systemNotifications: boolean;
  reminderNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

interface NotificationState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  isHydrated: boolean;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  setHydrated: (hydrated: boolean) => void;
}

const defaultPreferences: NotificationPreferences = {
  pushNotifications: true,
  emailNotifications: true,
  recipeNotifications: true,
  followNotifications: true,
  likeNotifications: true,
  commentNotifications: true,
  systemNotifications: true,
  reminderNotifications: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      preferences: defaultPreferences,
      unreadCount: 0,
      isHydrated: false,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          read: false,
          timestamp: new Date(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
      
      markAsRead: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          );
          
          const unreadCount = updatedNotifications.filter((n) => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        }));
      },
      
      deleteNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === notificationId);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter((n) => n.id !== notificationId),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },
      
      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
      
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },
      
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
