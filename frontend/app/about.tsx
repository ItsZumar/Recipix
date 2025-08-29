import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Alert, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";

interface AboutSectionProps {
  title: string;
  children: React.ReactNode;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, children }) => {
  const { textColor } = useScreenColors();
  
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </ThemedText>
      <ThemedView style={styles.sectionContent}>
        {children}
      </ThemedView>
    </View>
  );
};

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ 
  icon, 
  title, 
  value, 
  onPress, 
  showChevron = false 
}) => {
  const { textColor, iconColor } = useScreenColors();

  return (
    <TouchableOpacity 
      style={styles.infoItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={wp(5)} color={iconColor} />
        </View>
        <View style={styles.infoItemContent}>
          <ThemedText style={[styles.infoTitle, { color: textColor }]}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.infoValue, { color: textColor }]}>
            {value}
          </ThemedText>
        </View>
      </View>
      
      {showChevron && onPress && (
        <Ionicons name="chevron-forward" size={wp(4)} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

export default function AboutScreen() {
  const router = useRouter();
  const { textColor, iconColor } = useScreenColors();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        { text: 'Email', onPress: () => handleOpenLink('mailto:support@recipix.app') },
        { text: 'Website', onPress: () => handleOpenLink('https://recipix.app/support') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRateApp = () => {
    // This would typically open the app store
    Alert.alert('Rate Recipix', 'Thank you for your interest! Rating functionality will be implemented.');
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out Recipix - Your Culinary Journey Starts Here! 🍳\n\nDiscover, create, and share amazing recipes with food lovers around the world.\n\nDownload now: https://recipix.app/download',
        title: 'Recipix - Recipe App',
        url: 'https://recipix.app/download', // This will be used on iOS
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Error', 'Could not share the app. Please try again.');
    }
  };

  return (
    <ScreenWrapper>
      <Header 
        title="About" 
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => router.back()
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* App Info Section */}
        <AboutSection title="App Information">
          <View style={styles.appHeader}>
            <View style={[styles.appIcon, { backgroundColor: iconColor }]}>
              <Ionicons name="restaurant" size={wp(12)} color="#fff" />
            </View>
            <View style={styles.appInfo}>
              <ThemedText style={[styles.appName, { color: textColor }]}>
                Recipix
              </ThemedText>
              <ThemedText style={[styles.appTagline, { color: textColor }]}>
                Your Culinary Journey Starts Here
              </ThemedText>
            </View>
          </View>
          
          <InfoItem
            icon="information-circle"
            title="Version"
            value="1.0.0"
          />
          
          <InfoItem
            icon="calendar"
            title="Build Date"
            value="December 2024"
          />
          
          <InfoItem
            icon="code-slash"
            title="Build Number"
            value="2024.12.001"
          />
        </AboutSection>

        {/* Features Section */}
        <AboutSection title="Features">
          <InfoItem
            icon="search"
            title="Recipe Discovery"
            value="Browse thousands of recipes from around the world"
          />
          
          <InfoItem
            icon="add-circle"
            title="Create & Share"
            value="Create and share your own recipes with the community"
          />
          
          <InfoItem
            icon="heart"
            title="Favorites"
            value="Save and organize your favorite recipes"
          />
          
          <InfoItem
            icon="people"
            title="Social Features"
            value="Follow other chefs and discover new content"
          />
          
          <InfoItem
            icon="notifications"
            title="Smart Notifications"
            value="Stay updated with personalized notifications"
          />
        </AboutSection>

      

        {/* Support Section */}
        <AboutSection title="Support">
          <InfoItem
            icon="mail"
            title="Contact Support"
            value="Get in touch with our team"
            onPress={handleContactSupport}
            showChevron={true}
          />
         
        </AboutSection>

        {/* Actions Section */}
        <AboutSection title="Actions">
          <InfoItem
            icon="share-social"
            title="Share App"
            value="Share with friends and family"
            onPress={handleShareApp}
            showChevron={true}
          />
        </AboutSection>

        {/* Credits Section */}
        <AboutSection title="Credits">
          <InfoItem
            icon="people-circle"
            title="Development Team"
            value="Built with ❤️ by the Recipix team"
          />
          
          <InfoItem
            icon="library"
            title="Open Source"
            value="Powered by React Native & Expo"
          />
          
          <InfoItem
            icon="images"
            title="Icons"
            value="Ionicons by Ionic Team"
          />
          
          <InfoItem
            icon="heart"
            title="Special Thanks"
            value="To all our beta testers and contributors"
          />
        </AboutSection>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: textColor }]}>
            Made with ❤️ for food lovers everywhere
          </ThemedText>
          <ThemedText style={[styles.copyright, { color: textColor }]}>
            © 2024 Recipix. All rights reserved.
          </ThemedText>
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
  appHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(3),
    paddingHorizontal: wp(4),
  },
  appIcon: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: wp(6),
    fontWeight: "bold",
    marginBottom: hp(0.5),
  },
  appTagline: {
    fontSize: wp(4),
    opacity: 0.7,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  infoItemLeft: {
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
  infoItemContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: wp(4),
    fontWeight: "500",
    marginBottom: hp(0.25),
  },
  infoValue: {
    fontSize: wp(3.5),
    opacity: 0.7,
  },
  footer: {
    alignItems: "center",
    paddingVertical: hp(4),
    paddingHorizontal: wp(4),
  },
  footerText: {
    fontSize: wp(4),
    textAlign: "center",
    marginBottom: hp(1),
  },
  copyright: {
    fontSize: wp(3.5),
    textAlign: "center",
    opacity: 0.6,
  },
});
