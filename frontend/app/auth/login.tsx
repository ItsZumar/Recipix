import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { InputField } from '@/components/inputs';
import { Button } from '@/components/Button';
import { useFormik, useFormSubmission } from '@/hooks/useFormik';
import { loginSchema } from '@/utils/validationSchemas';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const [formState, formActions] = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await login(values);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        throw new Error(result.error || 'Login failed');
      }
    },
    onError: (error) => {
      Alert.alert('Login Failed', error.message || 'Please try again');
    },
  });

  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmission(formState, formActions);

  const handleRegister = () => {
    router.push('/auth/register' as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign in to your Recipix account
            </ThemedText>
          </View>

          <View style={styles.form}>
            <InputField
              label="Email"
              value={formState.values.email}
              onChangeText={(text) => formActions.setFieldValue('email', text)}
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
              onChangeText={(text) => formActions.setFieldValue('password', text)}
              error={formState.touched.password ? formState.errors.password : undefined}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              required
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Button
              title="Sign In"
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Don't have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleRegister}>
              <ThemedText type="link" style={styles.linkText}>Sign Up</ThemedText>
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
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
