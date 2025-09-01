import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { InputField } from "@/components/inputs";
import { Button } from "@/components/Button";
import { ActionModal, useActionModal, ModalAction } from "@/components/ActionModal";
import { useFormik, useFormSubmission } from "@/hooks/useFormik";
import { changePasswordSchema } from "@/utils/validationSchemas";
import { useChangePassword } from "@/hooks/useAuth";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  const { visible, showModal, hideModal } = useActionModal();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword, loading } = useChangePassword();

  const [formState, formActions] = useFormik<ChangePasswordFormValues>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      const result = await changePassword(values.currentPassword, values.newPassword);
      if (result.success) {
        const actions: ModalAction[] = [
          {
            id: 'ok',
            title: 'OK',
            onPress: () => {
              hideModal();
              router.back();
            },
            style: 'primary',
          },
        ];

        showModal();
        formActions.resetForm();
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Please try again');
    },
  });

  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmission(formState, formActions);

  const handleCancel = () => {
    if (formState.values.currentPassword || formState.values.newPassword || formState.values.confirmPassword) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <ScreenWrapper>
      <Header 
        title="Change Password" 
        leftAccessory={{
          icon: 'arrow-back',
          onPress: handleCancel
        }}
      />

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
              <Ionicons name="key" size={wp(8)} color={tintColor} />
            </View>
            <ThemedText style={[styles.title, { color: textColor }]}>
              Change Your Password
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: iconColor }]}>
              Enter your current password and choose a new one
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Current Password"
              value={formState.values.currentPassword}
              onChangeText={(text) => formActions.setFieldValue('currentPassword', text)}
              error={formState.touched.currentPassword ? formState.errors.currentPassword : undefined}
              placeholder="Enter your current password"
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowCurrentPassword(!showCurrentPassword)}
            />

            <InputField
              label="New Password"
              value={formState.values.newPassword}
              onChangeText={(text) => formActions.setFieldValue('newPassword', text)}
              error={formState.touched.newPassword ? formState.errors.newPassword : undefined}
              placeholder="Enter your new password"
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showNewPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowNewPassword(!showNewPassword)}
            />

            <InputField
              label="Confirm New Password"
              value={formState.values.confirmPassword}
              onChangeText={(text) => formActions.setFieldValue('confirmPassword', text)}
              error={formState.touched.confirmPassword ? formState.errors.confirmPassword : undefined}
              placeholder="Confirm your new password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <ThemedText style={[styles.requirementsTitle, { color: textColor }]}>
                Password Requirements:
              </ThemedText>
              <View style={styles.requirementsList}>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={formState.values.newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                    size={wp(4)} 
                    color={formState.values.newPassword.length >= 6 ? "#4CAF50" : iconColor} 
                  />
                  <ThemedText style={[styles.requirementText, { color: iconColor }]}>
                    At least 6 characters
                  </ThemedText>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={formState.values.newPassword === formState.values.confirmPassword && formState.values.newPassword ? "checkmark-circle" : "ellipse-outline"} 
                    size={wp(4)} 
                    color={formState.values.newPassword === formState.values.confirmPassword && formState.values.newPassword ? "#4CAF50" : iconColor} 
                  />
                  <ThemedText style={[styles.requirementText, { color: iconColor }]}>
                    Passwords match
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Change Password"
                variant="primary"
                size="large"
                onPress={handleSubmit}
                disabled={!canSubmit || loading}
                loading={loading}
                style={styles.primaryButton}
              />
              
              <Button
                title="Cancel"
                variant="secondary"
                size="large"
                onPress={handleCancel}
                disabled={loading}
                style={styles.secondaryButton}
              />
            </View>
          </View>
        </ThemedView>
      </ScrollView>

      {/* Success Modal */}
      <ActionModal
        visible={visible}
        onClose={hideModal}
        title="Password Changed Successfully"
        subtitle="Your password has been updated. You'll need to use your new password the next time you sign in."
        actions={[
          {
            id: 'ok',
            title: 'OK',
            onPress: () => {
              hideModal();
              router.back();
            },
            style: 'primary',
          },
        ]}
        showCancelButton={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
  },
  content: {
    flex: 1,
    paddingVertical: hp(2),
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  iconContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(6),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: wp(4),
    textAlign: 'center',
    lineHeight: hp(3),
  },
  form: {
    flex: 1,
  },
  requirementsContainer: {
    marginTop: hp(3),
    marginBottom: hp(4),
  },
  requirementsTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    marginBottom: hp(1.5),
  },
  requirementsList: {
    gap: hp(1),
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  requirementText: {
    fontSize: wp(3.5),
  },
  buttonContainer: {
    gap: hp(2),
  },
  primaryButton: {
    marginBottom: hp(1),
  },
  secondaryButton: {
    marginBottom: hp(2),
  },
});
