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
import { useFormik, useFormField, useFormSubmission } from '@/hooks/useFormik';
import { registrationSchema } from '@/utils/validationSchemas';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const register = useAuthStore((state) => state.register);

  const [formState, formActions] = useFormik<RegisterFormValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      const result = await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    },
    onError: (error) => {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    },
  });

  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmission(formState, formActions);

  const handleLogin = () => {
    router.push('/auth/login' as any);
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
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join Recipix and start sharing your recipes
            </ThemedText>
          </View>

          <View style={styles.form}>
            <FormField
              label="Username"
              value={formState.values.username}
              onChangeText={(text) => formActions.setFieldValue('username', text)}
              onBlur={() => formActions.setFieldTouched('username')}
              error={formState.errors.username}
              touched={formState.touched.username}
              placeholder="Choose a username"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

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
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              required
            />

            <FormField
              label="Confirm Password"
              value={formState.values.confirmPassword}
              onChangeText={(text) => formActions.setFieldValue('confirmPassword', text)}
              onBlur={() => formActions.setFieldTouched('confirmPassword')}
              error={formState.errors.confirmPassword}
              touched={formState.touched.confirmPassword}
              placeholder="Confirm your password"
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
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Already have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleLogin}>
              <ThemedText style={styles.linkText}>Sign In</ThemedText>
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
