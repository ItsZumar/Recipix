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

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  const { visible, showModal, hideModal } = useActionModal();

  // Privacy & Security state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [recipeVisibility, setRecipeVisibility] = useState('public');
  const [allowFollowers, setAllowFollowers] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteData = () => {
    const actions: ModalAction[] = [
      {
        id: 'delete',
        title: 'Delete All Data',
        icon: 'trash',
        onPress: () => {
          hideModal();
          Alert.alert(
            'Delete All Data',
            'This will permanently delete all your data including recipes, favorites, and account information. This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {
                Alert.alert('Data Deleted', 'All your data has been deleted.');
              }}
            ]
          );
        },
        style: 'destructive',
      },
    ];

    showModal();
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Data export functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
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
        title="Privacy & Security" 
        leftAccessory={{
          icon: 'arrow-back',
          onPress: () => router.back()
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Security Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Account Security
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="key"
              title="Change Password"
              subtitle="Update your account password"
              onPress={handleChangePassword}
            />
            
            <SettingItem
              icon="finger-print"
              title="Biometric Authentication"
              subtitle="Use Face ID or Touch ID to sign in"
              rightElement={
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={biometricAuth ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
          </ThemedView>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Privacy Settings
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="people"
              title="Profile Visibility"
              subtitle={profileVisibility === 'public' ? 'Public - Anyone can see your profile' : 'Private - Only followers can see your profile'}
              onPress={() => {
                Alert.alert(
                  'Profile Visibility',
                  'Choose who can see your profile',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Public', 
                      onPress: () => setProfileVisibility('public'),
                      style: profileVisibility === 'public' ? 'default' : 'cancel'
                    },
                    { 
                      text: 'Private', 
                      onPress: () => setProfileVisibility('private'),
                      style: profileVisibility === 'private' ? 'default' : 'cancel'
                    }
                  ]
                );
              }}
            />
            
            <SettingItem
              icon="restaurant"
              title="Recipe Visibility"
              subtitle={recipeVisibility === 'public' ? 'Public - Anyone can see your recipes' : 'Private - Only you can see your recipes'}
              onPress={() => {
                Alert.alert(
                  'Recipe Visibility',
                  'Choose who can see your recipes',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Public', 
                      onPress: () => setRecipeVisibility('public'),
                      style: recipeVisibility === 'public' ? 'default' : 'cancel'
                    },
                    { 
                      text: 'Private', 
                      onPress: () => setRecipeVisibility('private'),
                      style: recipeVisibility === 'private' ? 'default' : 'cancel'
                    }
                  ]
                );
              }}
            />
            
            <SettingItem
              icon="person-add"
              title="Allow Followers"
              subtitle="Let other users follow your profile"
              rightElement={
                <Switch
                  value={allowFollowers}
                  onValueChange={setAllowFollowers}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={allowFollowers ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            
          </ThemedView>
        </View>

        {/* Data & Analytics Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Data & Analytics
          </ThemedText>
          
          <ThemedView style={styles.sectionContent}>
            <SettingItem
              icon="analytics"
              title="Analytics"
              subtitle="Help improve the app with usage data"
              rightElement={
                <Switch
                  value={analytics}
                  onValueChange={setAnalytics}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={analytics ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="share"
              title="Data Sharing"
              subtitle="Share data with third-party services"
              rightElement={
                <Switch
                  value={dataSharing}
                  onValueChange={setDataSharing}
                  trackColor={{ false: '#767577', true: tintColor }}
                  thumbColor={dataSharing ? '#fff' : '#f4f3f4'}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="download"
              title="Export Data"
              subtitle="Download a copy of your data"
              onPress={handleExportData}
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
              icon="trash"
              title="Delete All Data"
              subtitle="Permanently delete all your data"
              onPress={handleDeleteData}
            />
          </ThemedView>
        </View>
      </ScrollView>

      {/* Delete Data Modal */}
      <ActionModal
        visible={visible}
        onClose={hideModal}
        title="Delete All Data"
        subtitle="Are you sure you want to delete all your data? This action cannot be undone."
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
