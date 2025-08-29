import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Switch, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
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

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  const { preferences, updatePreferences } = useNotificationStore();

  const handleQuietHoursPress = () => {
    Alert.alert(
      'Quiet Hours',
      'Set times when you don\'t want to receive notifications',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Configure', 
          onPress: () => {
            // TODO: Implement time picker for quiet hours
            Alert.alert('Coming Soon', 'Quiet hours configuration will be implemented in a future update.');
          }
        }
      ]
    );
  };

  const getQuietHoursText = () => {
    if (!preferences.quietHours.enabled) {
      return 'Disabled';
    }
    return `${preferences.quietHours.start} - ${preferences.quietHours.end}`;
  };

  return (
    <ScreenWrapper>
      <Header 
        title="Notification Settings" 
        leftAccessory={{
          icon: 'arrow-back',
          onPress: () => router.back()
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* General Notifications */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            General
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
              icon="moon"
              title="Quiet Hours"
              subtitle={getQuietHoursText()}
              onPress={handleQuietHoursPress}
            />
          </ThemedView>
        </View>

        {/* Recipe Notifications */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Recipe Activity
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="restaurant"
              title="New Recipe Notifications"
              subtitle="When someone you follow posts a new recipe"
              rightElement={
                <Switch
                  value={preferences.recipeNotifications}
                  onValueChange={(value) => updatePreferences({ recipeNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.recipeNotifications ? '#fff' : '#f4f3f4'}
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
              icon="chatbubble"
              title="Comment Notifications"
              subtitle="When someone comments on your recipe"
              rightElement={
                <Switch
                  value={preferences.commentNotifications}
                  onValueChange={(value) => updatePreferences({ commentNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.commentNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
          </ThemedView>
        </View>

        {/* Social Notifications */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Social Activity
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
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

        {/* System Notifications */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            System & Reminders
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="information-circle"
              title="System Notifications"
              subtitle="App updates and important announcements"
              rightElement={
                <Switch
                  value={preferences.systemNotifications}
                  onValueChange={(value) => updatePreferences({ systemNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.systemNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="alarm"
              title="Reminder Notifications"
              subtitle="Cooking reminders and meal planning"
              rightElement={
                <Switch
                  value={preferences.reminderNotifications}
                  onValueChange={(value) => updatePreferences({ reminderNotifications: value })}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={preferences.reminderNotifications ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
          </ThemedView>
        </View>

        {/* Information */}
        <View style={styles.section}>
          <ThemedView style={styles.infoContainer}>
            <Ionicons name="information-circle" size={wp(5)} color={iconColor} />
            <ThemedText style={[styles.infoText, { color: iconColor }]}>
              You can customize which notifications you receive. Disabled notifications will not appear in your notification center.
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp(4),
    borderRadius: wp(3),
    gap: wp(3),
  },
  infoText: {
    flex: 1,
    fontSize: wp(3.5),
    lineHeight: hp(2.5),
  },
});
