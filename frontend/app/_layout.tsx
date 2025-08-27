import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { client } from '@/lib/apollo-client';
import { useAuthStore } from '@/stores/authStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Get auth state
  const user = useAuthStore((state) => state?.user ?? null);
  const isLoading = useAuthStore((state) => state?.isLoading ?? true);
  const isHydrated = useAuthStore((state) => state?.isHydrated ?? false);
  
  // Get onboarding state
  const { isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  
  const segments = useSegments();
  const router = useRouter();

  // Handle authentication and onboarding routing
  useEffect(() => {
    if (!loaded || !isHydrated || isLoading || isOnboardingLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    console.log('Layout routing check:', {
      isOnboardingCompleted,
      inAuthGroup,
      inOnboarding,
      user: !!user,
      segments: segments[0]
    });

    // Check if user needs to see onboarding
    if (isOnboardingCompleted === false && !inOnboarding) {
      console.log('Redirecting to onboarding...');
      router.replace('/onboarding');
      return;
    }

    // Handle authentication routing (only if onboarding is completed)
    if (isOnboardingCompleted === true) {
      if (!user && !inAuthGroup && !inOnboarding) {
        console.log('Redirecting to login...');
        // Redirect to login if not authenticated
        router.replace('/auth/login');
      } else if (user && inAuthGroup) {
        console.log('Redirecting to home...');
        // Redirect to home if authenticated and trying to access auth screens
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, isLoading, isHydrated, loaded, isOnboardingCompleted, isOnboardingLoading, router]);

  if (!loaded || !isHydrated || isOnboardingLoading) {
    // Show loading screen while fonts are loading, store is hydrating, or onboarding is loading
    return <LoadingScreen message="Initializing..." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="user/[id]" />
        <Stack.Screen name="search-users" />
        <Stack.Screen name="recipes" />
        <Stack.Screen name="create-recipe" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <RootLayoutNav />
    </ApolloProvider>
  );
}
