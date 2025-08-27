import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { UserSearch } from '@/components/UserSearch';

export default function UserSearchScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title="Search Users"
        leftAccessory={{
          icon: "arrow-back",
          onPress: handleBack,
        }}
      />
      
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.description}>
          Find and connect with other food lovers
        </ThemedText>
        
        <UserSearch 
          placeholder="Search by username, name, or bio..."
          showResults={true}
        />
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
});
