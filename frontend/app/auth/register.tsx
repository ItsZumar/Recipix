import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputField } from "@/components/inputs";
import { Button } from "@/components/Button";
import { useFormik, useFormSubmission } from "@/hooks/useFormik";
import { registrationSchema } from "@/utils/validationSchemas";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const register = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formState, formActions] = useFormik<RegisterFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      const result = await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        router.replace("/(tabs)");
      } else {
        throw new Error(result.error || "Registration failed");
      }
    },
    onError: (error) => {
      Alert.alert("Registration Failed", error.message || "Please try again");
    },
  });

  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmission(formState, formActions);

  const handleLogin = () => {
    router.push("/auth/login" as any);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>Join Recipix and start sharing your recipes</ThemedText>
          </View>

          <View style={styles.form}>
            <InputField
              label="Username"
              value={formState.values.username}
              onChangeText={(text) => formActions.setFieldValue("username", text)}
              error={formState.touched.username ? formState.errors.username : undefined}
              placeholder="Choose a username"
              autoCapitalize="none"
              autoCorrect={false}
              required
              leftIcon="person-outline"
            />

            <InputField
              label="Email"
              value={formState.values.email}
              onChangeText={(text) => formActions.setFieldValue("email", text)}
              error={formState.touched.email ? formState.errors.email : undefined}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
              leftIcon="mail-outline"
            />

            <InputField
              label="Password"
              value={formState.values.password}
              onChangeText={(text) => formActions.setFieldValue("password", text)}
              error={formState.touched.password ? formState.errors.password : undefined}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <InputField
              label="Confirm Password"
              value={formState.values.confirmPassword}
              onChangeText={(text) => formActions.setFieldValue("confirmPassword", text)}
              error={formState.touched.confirmPassword ? formState.errors.confirmPassword : undefined}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button
              title="Create Account"
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={handleLogin}>
              <ThemedText type="link" style={styles.linkText}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  form: {
    marginBottom: 32,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
