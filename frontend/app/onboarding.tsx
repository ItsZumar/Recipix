import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ScreenWrapper, useScreenColors } from '@/components/ScreenWrapper';
import { Button } from '@/components/Button';
import { Theme, wp, hp } from '@/constants/Theme';
import { useOnboarding } from '@/hooks/useOnboarding';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Recipix',
    subtitle: 'Your Culinary Journey Starts Here',
    description: 'Discover, create, and share amazing recipes with food lovers around the world.',
    icon: 'restaurant-outline',
    color: '#FF6B35',
  },
  {
    id: '2',
    title: 'Discover Recipes',
    subtitle: 'Explore Thousands of Recipes',
    description: 'Browse through a vast collection of recipes from different cuisines and skill levels.',
    icon: 'search-outline',
    color: '#FF8A65',
  },
  {
    id: '3',
    title: 'Create & Share',
    subtitle: 'Share Your Culinary Creations',
    description: 'Create your own recipes, add photos, and share them with the community.',
    icon: 'add-circle-outline',
    color: '#FF6B35',
  },
  {
    id: '4',
    title: 'Save Favorites',
    subtitle: 'Build Your Recipe Collection',
    description: 'Save your favorite recipes and organize them for easy access anytime.',
    icon: 'heart-outline',
    color: '#FF8A65',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { backgroundColor, textColor } = useScreenColors();
  const { markOnboardingCompleted } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      console.log('Starting onboarding completion...');
      // Mark onboarding as completed
      const success = await markOnboardingCompleted();
      
      if (success) {
        console.log('Onboarding marked as completed, navigating to login...');
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          router.replace('/auth/login');
        }, 100);
      } else {
        console.log('Failed to mark onboarding as completed');
        Alert.alert('Error', 'Failed to save onboarding status. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: screenWidth }]}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={wp(15)} color="#fff" />
        </View>
      </View>
      
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          {item.title}
        </ThemedText>
        
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          {item.subtitle}
        </ThemedText>
        
        <ThemedText style={[styles.description, { color: textColor }]}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {ONBOARDING_SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? '#FF6B35' : '#E0E0E0',
              width: index === currentIndex ? wp(8) : wp(2),
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={[styles.skipText, { color: textColor }]}>
            Skip
          </ThemedText>
        </TouchableOpacity>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* Pagination */}
        {renderPagination()}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            variant="primary"
            size="large"
            onPress={handleComplete}
            style={styles.button}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: hp(8),
    right: wp(4),
    zIndex: 1,
    padding: wp(2),
  },
  skipText: {
    fontSize: wp(4),
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  iconContainer: {
    marginBottom: hp(6),
  },
  iconBackground: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    maxWidth: wp(80),
  },
  title: {
    fontSize: wp(7),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: wp(5),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(2),
    opacity: 0.8,
  },
  description: {
    fontSize: wp(4),
    textAlign: 'center',
    lineHeight: wp(6),
    opacity: 0.7,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(4),
    gap: wp(2),
  },
  paginationDot: {
    height: wp(2),
    borderRadius: wp(1),
  },
  buttonContainer: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(4),
  },
  button: {
    width: '100%',
  },
});
