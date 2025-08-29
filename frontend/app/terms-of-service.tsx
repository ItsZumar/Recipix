import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { wp, hp } from "@/utils/responsive";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { textColor } = useScreenColors();
  
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.sectionContent, { color: textColor }]}>
        {children}
      </ThemedText>
    </View>
  );
};

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const { textColor } = useScreenColors();

  return (
    <ScreenWrapper>
      <Header 
        title="Terms of Service" 
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => router.back()
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ThemedText style={[styles.lastUpdated, { color: textColor }]}>
            Last updated: December 2024
          </ThemedText>

          <Section title="1. Acceptance of Terms">
            By downloading, installing, or using the Recipix mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
          </Section>

          <Section title="2. Description of Service">
            Recipix is a recipe sharing and discovery platform that allows users to:
            {"\n"}• Browse and discover recipes from around the world
            {"\n"}• Create and share their own recipes
            {"\n"}• Save favorite recipes to personal collections
            {"\n"}• Follow other users and interact with the community
            {"\n"}• Receive personalized notifications and recommendations
          </Section>

          <Section title="3. User Accounts">
            To access certain features of the App, you must create an account. You agree to:
            {"\n"}• Provide accurate and complete information
            {"\n"}• Maintain the security of your account credentials
            {"\n"}• Accept responsibility for all activities under your account
            {"\n"}• Notify us immediately of any unauthorized use
            {"\n"}• Be at least 13 years old to create an account
          </Section>

          <Section title="4. User Content">
            You retain ownership of content you create and share ("User Content"). By posting content, you grant Recipix a worldwide, non-exclusive license to use, display, and distribute your content within the App. You represent that:
            {"\n"}• You own or have rights to all content you post
            {"\n"}• Your content does not violate any laws or rights
            {"\n"}• Your content is accurate and not misleading
            {"\n"}• You will not post harmful, offensive, or inappropriate content
          </Section>

          <Section title="5. Prohibited Activities">
            You agree not to:
            {"\n"}• Violate any applicable laws or regulations
            {"\n"}• Infringe on intellectual property rights
            {"\n"}• Harass, abuse, or harm other users
            {"\n"}• Post spam, malware, or harmful content
            {"\n"}• Attempt to gain unauthorized access to the App
            {"\n"}• Use the App for commercial purposes without permission
            {"\n"}• Reverse engineer or modify the App
          </Section>

          <Section title="6. Privacy and Data">
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the App, you consent to our data practices as described in the Privacy Policy.
          </Section>

          <Section title="7. Intellectual Property">
            The App and its content, including but not limited to text, graphics, images, logos, and software, are owned by Recipix or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the App without our written permission.
          </Section>

          <Section title="8. Disclaimers">
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED OR ERROR-FREE.
          </Section>

          <Section title="9. Limitation of Liability">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECIPIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE APP.
          </Section>

          <Section title="10. Indemnification">
            You agree to indemnify and hold harmless Recipix, its officers, directors, employees, and agents from any claims, damages, or expenses arising out of your use of the App or violation of these Terms.
          </Section>

          <Section title="11. Termination">
            We may terminate or suspend your account and access to the App at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us. Upon termination, your right to use the App will cease immediately.
          </Section>

          <Section title="12. Governing Law">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Recipix operates, without regard to its conflict of law provisions.
          </Section>

          <Section title="13. Changes to Terms">
            We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms in the App. Your continued use of the App after such changes constitutes acceptance of the new Terms.
          </Section>

          <Section title="14. Severability">
            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
          </Section>

          <Section title="15. Entire Agreement">
            These Terms constitute the entire agreement between you and Recipix regarding the use of the App and supersede all prior agreements and understandings.
          </Section>

          <Section title="16. Contact Information">
            If you have any questions about these Terms of Service, please contact us at:
            {"\n"}Email: legal@recipix.app
            {"\n"}Address: [Your Company Address]
            {"\n"}Website: https://recipix.app/legal
          </Section>

          <View style={styles.footer}>
            <ThemedText style={[styles.footerText, { color: textColor }]}>
              By using Recipix, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  lastUpdated: {
    fontSize: wp(3.5),
    textAlign: "center",
    marginBottom: hp(3),
    opacity: 0.7,
    fontStyle: "italic",
  },
  section: {
    marginBottom: hp(4),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
    marginBottom: hp(1.5),
    lineHeight: wp(6),
  },
  sectionContent: {
    fontSize: wp(4),
    lineHeight: wp(6),
    opacity: 0.9,
  },
  footer: {
    marginTop: hp(4),
    paddingTop: hp(3),
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  footerText: {
    fontSize: wp(4),
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
});
