import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Switch, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { ActionModal, useActionModal, ModalAction } from "@/components/ActionModal";
import { useUser } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { NotificationBadge } from "@/components/NotificationBadge";
import { useNotificationStore } from "@/stores/notificationStore";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightElement, 
  showChevron = true 
}) => {
  const { textColor, iconColor } = useScreenColors();

  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={wp(5)} color={iconColor} />
        </View>
        <View style={styles.settingItemContent}>
          <ThemedText style={[styles.settingTitle, { color: textColor }]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={[styles.settingSubtitle, { color: textColor }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      
      <View style={styles.settingItemRight}>
        {rightElement}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={wp(4)} color={iconColor} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const user = useUser();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  const { visible, showModal, hideModal } = useActionModal();

  // Theme state
  const { isDark, themeMode, setThemeMode } = useThemeStore();

  // Notification state
  const { preferences, updatePreferences } = useNotificationStore();

  const handleLogout = () => {
    const actions: ModalAction[] = [
      {
        id: 'logout',
        title: 'Logout',
        icon: 'log-out',
        onPress: () => {
          hideModal();
          // TODO: Implement logout logic
          Alert.alert('Logout', 'Logout functionality will be implemented');
        },
        style: 'destructive',
      },
    ];

    showModal();
  };

  const handleDeleteAccount = () => {
    const actions: ModalAction[] = [
      {
        id: 'delete',
        title: 'Delete Account',
        icon: 'trash',
        onPress: () => {
          hideModal();
          Alert.alert('Delete Account', 'Delete account functionality will be implemented');
        },
        style: 'destructive',
      },
    ];

    showModal();
  };

  const modalActions: ModalAction[] = [
    {
      id: 'cancel',
      title: 'Cancel',
      onPress: hideModal,
      style: 'default',
    },
  ];

  return (
    <ScreenWrapper>
      <Header 
        title="Settings" 
        rightAccessory={{
          icon: 'notifications',
          onPress: () => router.push("/notifications")
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Account
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="person"
              title="Profile"
              subtitle="Edit your profile information"
              onPress={() => router.push("/profile")}
            />
            
            <SettingItem
              icon="lock-closed"
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => router.push("/privacy-security")}
            />
          </ThemedView>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Notifications
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              rightElement={
                <Switch
                  value={preferences.pushNotifications}
                  onValueChange={(value) => updatePreferences({ pushNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.pushNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="mail"
              title="Email Notifications"
              subtitle="Receive notifications via email"
              rightElement={
                <Switch
                  value={preferences.emailNotifications}
                  onValueChange={(value) => updatePreferences({ emailNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.emailNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="heart"
              title="Like Notifications"
              subtitle="When someone likes your recipe"
              rightElement={
                <Switch
                  value={preferences.likeNotifications}
                  onValueChange={(value) => updatePreferences({ likeNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.likeNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="person-add"
              title="Follow Notifications"
              subtitle="When someone follows you"
              rightElement={
                <Switch
                  value={preferences.followNotifications}
                  onValueChange={(value) => updatePreferences({ followNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.followNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
           
          </ThemedView>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Appearance
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="moon"
              title="Dark Mode"
              subtitle={themeMode === 'system' ? 'Follow system setting' : themeMode === 'dark' ? 'Always dark' : 'Always light'}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={() => {
                    if (themeMode === 'system') {
                      setThemeMode(isDark ? 'light' : 'dark');
                    } else {
                      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
                    }
                  }}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={isDark ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
          </ThemedView>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            App
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
           
            <SettingItem
              icon="document-text"
              title="Terms of Service"
              subtitle="Read our terms of service"
              onPress={() => router.push("/terms-of-service")}
            />
            
            <SettingItem
              icon="information-circle"
              title="About"
              subtitle="App version and information"
              onPress={() => router.push("/about")}
            />
          </ThemedView>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: '#FF3B30' }]}>
            Danger Zone
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="log-out"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
            />
            
            <SettingItem
              icon="trash"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
            />
          </ThemedView>
        </View>
      </ScrollView>

      {/* Logout/Delete Modal */}
      <ActionModal
        visible={visible}
        onClose={hideModal}
        title="Confirm Action"
        subtitle="Are you sure you want to perform this action? This cannot be undone."
        actions={modalActions}
        showCancelButton={true}
        cancelText="Cancel"
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    marginBottom: hp(1.5),
    marginLeft: wp(1),
  },
  sectionContent: {
    borderRadius: wp(3),
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  settingItemContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: wp(4),
    fontWeight: "500",
    marginBottom: hp(0.25),
  },
  settingSubtitle: {
    fontSize: wp(3.5),
    opacity: 0.7,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
});
