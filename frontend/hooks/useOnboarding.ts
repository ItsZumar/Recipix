import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('onboardingCompleted');
      setIsOnboardingCompleted(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markOnboardingCompleted = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setIsOnboardingCompleted(true);
      // Add a small delay to ensure AsyncStorage is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      // Force a re-check to ensure the state is properly updated
      await checkOnboardingStatus();
      return true;
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
      return false;
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingCompleted');
      setIsOnboardingCompleted(false);
      return true;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      return false;
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    markOnboardingCompleted,
    resetOnboarding,
  };
};
