import React from 'react';
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
import { FormField } from '@/components/FormField';
import { useFormik, useFormSubmission } from '@/hooks/useFormik';
import { loginSchema } from '@/utils/validationSchemas';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

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
            <FormField
              label="Email"
              value={formState.values.email}
              onChangeText={(text) => formActions.setFieldValue('email', text)}
              onBlur={() => formActions.setFieldTouched('email')}
              error={formState.errors.email}
              touched={formState.touched.email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

            <FormField
              label="Password"
              value={formState.values.password}
              onChangeText={(text) => formActions.setFieldValue('password', text)}
              onBlur={() => formActions.setFieldTouched('password')}
              error={formState.errors.password}
              touched={formState.touched.password}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              required
            />

            <TouchableOpacity
              style={[styles.button, (!canSubmit || isSubmitting) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              <ThemedText style={styles.buttonText}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Don't have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleRegister}>
              <ThemedText style={styles.linkText}>Sign Up</ThemedText>
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
    fontWeight: 'bold',
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '600',
  },
});
