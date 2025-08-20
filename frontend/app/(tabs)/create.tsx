import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ScreenWrapper, useScreenColors } from '@/components/ScreenWrapper';

export default function CreateTabScreen() {
  const router = useRouter();
  const { textColor } = useScreenColors();

  useEffect(() => {
    // Redirect to the create recipe screen
    router.replace('/create-recipe');
  }, [router]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <ThemedText style={{ marginTop: 16, color: textColor }}>
          Opening Create Recipe...
        </ThemedText>
      </View>
    </ScreenWrapper>
  );
}
