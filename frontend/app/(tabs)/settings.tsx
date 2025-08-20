import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/utils/responsive';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useUser, useAuthStore } from '@/stores/authStore';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?", 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your recipes and data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion feature coming soon!');
          }
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          icon: 'notifications-outline' as const,
          title: 'Push Notifications',
          subtitle: 'Receive notifications for new recipes',
          type: 'switch' as const,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'darkmode',
          icon: 'moon-outline' as const,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'switch' as const,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          id: 'email',
          icon: 'mail-outline' as const,
          title: 'Email Updates',
          subtitle: 'Receive recipe updates via email',
          type: 'switch' as const,
          value: emailUpdatesEnabled,
          onToggle: setEmailUpdatesEnabled,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: 'person-outline' as const,
          title: 'Edit Profile',
          subtitle: 'Update your profile information',
          type: 'button' as const,
          onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
        },
        {
          id: 'password',
          icon: 'lock-closed-outline' as const,
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'button' as const,
          onPress: () => Alert.alert('Change Password', 'Password change coming soon!'),
        },
        {
          id: 'privacy',
          icon: 'shield-outline' as const,
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          type: 'button' as const,
          onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline' as const,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'button' as const,
          onPress: () => Alert.alert('Help', 'Help center coming soon!'),
        },
        {
          id: 'feedback',
          icon: 'chatbubble-outline' as const,
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          type: 'button' as const,
          onPress: () => Alert.alert('Feedback', 'Feedback feature coming soon!'),
        },
        {
          id: 'about',
          icon: 'information-circle-outline' as const,
          title: 'About',
          subtitle: 'App version and information',
          type: 'button' as const,
          onPress: () => Alert.alert('About', 'Recipix v1.0.0\nYour personal recipe companion'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity 
      key={item.id}
      style={[styles.settingItem, { borderColor: iconColor }]}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <Ionicons name={item.icon} size={wp(6)} color={tintColor} />
      <ThemedView style={styles.settingTextContainer}>
        <ThemedText type="defaultSemiBold" style={[styles.settingTitle, { color: textColor }]}>
          {item.title}
        </ThemedText>
        <ThemedText style={[styles.settingSubtitle, { color: textColor }]}>
          {item.subtitle}
        </ThemedText>
      </ThemedView>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#767577', true: tintColor }}
          thumbColor={item.value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={wp(5)} color={iconColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header
        title="Settings"
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => router.back(),
        }}
      />
      
      <ScrollView style={styles.scrollContent}>

      {/* User Info */}
      <ThemedView style={styles.userSection}>
        <ThemedView style={[styles.userAvatarContainer, { borderColor: tintColor }]}>
          <Ionicons name="person" size={wp(12)} color={iconColor} />
        </ThemedView>
        <ThemedView style={styles.userTextContainer}>
          <ThemedText type="subtitle" style={[styles.userName, { color: textColor }]}>
            {user?.username || 'Chef User'}
          </ThemedText>
          <ThemedText style={[styles.userEmail, { color: textColor }]}>
            {user?.email || 'chef@example.com'}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <ThemedView key={section.title} style={styles.settingsSection}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            {section.title}
          </ThemedText>
          
          {section.items.map(renderSettingItem)}
        </ThemedView>
      ))}

      {/* Danger Zone */}
      <ThemedView style={styles.dangerSection}>
        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: '#FF3B30' }]}>
          Danger Zone
        </ThemedText>
        
        <TouchableOpacity 
          style={[styles.dangerButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={wp(6)} color="#FF3B30" />
          <ThemedView style={styles.settingTextContainer}>
            <ThemedText type="defaultSemiBold" style={[styles.settingTitle, { color: '#FF3B30' }]}>
              Logout
            </ThemedText>
            <ThemedText style={[styles.settingSubtitle, { color: '#FF3B30' }]}>
              Sign out of your account
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={wp(5)} color="#FF3B30" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dangerButton, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={wp(6)} color="#fff" />
          <ThemedView style={styles.settingTextContainer}>
            <ThemedText type="defaultSemiBold" style={[styles.settingTitle, { color: '#fff' }]}>
              Delete Account
            </ThemedText>
            <ThemedText style={[styles.settingSubtitle, { color: '#fff' }]}>
              Permanently delete your account
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={wp(5)} color="#fff" />
        </TouchableOpacity>
      </ThemedView>

      {/* App Version */}
      <ThemedView style={styles.versionContainer}>
        <ThemedText style={[styles.versionText, { color: textColor }]}>
          Recipix v1.0.0
        </ThemedText>
      </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userAvatarContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: wp(4.5),
    marginBottom: hp(0.5),
  },
  userEmail: {
    fontSize: wp(3.5),
    opacity: 0.7,
  },
  settingsSection: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4),
    marginBottom: hp(2),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    gap: wp(3),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: wp(4),
    marginBottom: hp(0.5),
  },
  settingSubtitle: {
    fontSize: wp(3),
    opacity: 0.7,
  },
  dangerSection: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginTop: hp(2),
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
    gap: wp(3),
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: hp(3),
  },
  versionText: {
    fontSize: wp(3),
    opacity: 0.5,
  },
});
