import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert, Animated, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useScreenColors } from "@/components/ScreenWrapper";
import { Button } from "@/components/Button";
import { wp, hp } from "@/constants/Theme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAppTheme } from "@/hooks/useAppTheme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string];
  accentColor: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to\nRecipix",
    subtitle: "Your Culinary Journey Starts Here",
    description: "Discover, create, and share amazing recipes with food lovers around the world. Start your cooking adventure today!",
    icon: "restaurant",
    gradient: ["#FF6B35", "#FF8A65"],
    accentColor: "#FF6B35",
  },
  {
    id: "2",
    title: "Discover\nAmazing Recipes",
    subtitle: "Explore Thousands of Recipes",
    description: "Browse through a vast collection of recipes from different cuisines, skill levels, and dietary preferences.",
    icon: "search",
    gradient: ["#4CAF50", "#66BB6A"],
    accentColor: "#4CAF50",
  },
  {
    id: "3",
    title: "Create &\nShare",
    subtitle: "Share Your Culinary Creations",
    description: "Create your own recipes, add beautiful photos, and share your culinary masterpieces with the community.",
    icon: "add-circle",
    gradient: ["#2196F3", "#42A5F5"],
    accentColor: "#2196F3",
  },
  {
    id: "4",
    title: "Save\nFavorites",
    subtitle: "Build Your Recipe Collection",
    description: "Save your favorite recipes, organize them into collections, and access them anytime, anywhere.",
    icon: "heart",
    gradient: ["#E91E63", "#F06292"],
    accentColor: "#E91E63",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingCompleted } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });

      // Animate the transition
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      console.log("Starting onboarding completion...");
      const success = await markOnboardingCompleted();

      if (success) {
        console.log("Onboarding marked as completed, navigating to login...");
        setTimeout(() => {
          router.replace("/auth/login");
        }, 100);
      } else {
        console.log("Failed to mark onboarding as completed");
        Alert.alert("Error", "Failed to save onboarding status. Please try again.");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert("Error", "Failed to complete onboarding. Please try again.");
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: screenWidth }]}>
      {/* Background Gradient */}
      <LinearGradient colors={item.gradient} style={styles.gradientBackground} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Content Container */}
      <View style={styles.slideContent}>
        {/* Icon Section */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name={item.icon} size={wp(12)} color="#fff" />
        </Animated.View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <ThemedText style={[styles.title, { color: "#fff" }]}>{item.title}</ThemedText>

          <ThemedText style={[styles.subtitle, { color: "rgba(255, 255, 255, 0.9)" }]}>{item.subtitle}</ThemedText>

          <ThemedText style={[styles.description, { color: "rgba(255, 255, 255, 0.8)" }]}>{item.description}</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentIndex ? "#fff" : "rgba(255, 255, 255, 0.4)",
                width: index === currentIndex ? wp(8) : wp(2),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  const currentSlide = ONBOARDING_SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <ThemedText style={styles.skipText}>Skip</ThemedText>
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

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        {renderPagination()}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
            variant="primary"
            size="large"
            onPress={currentIndex === ONBOARDING_SLIDES.length - 1 ? handleComplete : handleNext}
            style={{ ...styles.button, backgroundColor: currentSlide.accentColor }}
            textStyle={{ color: "#fff", fontWeight: "600" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  skipButton: {
    position: "absolute",
    top: hp(8),
    right: wp(6),
    zIndex: 10,
    padding: wp(3),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp(6),
  },
  skipText: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#fff",
  },
  slide: {
    flex: 1,
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(8),
    paddingTop: hp(15),
  },
  iconContainer: {
    marginBottom: hp(2),
  },
  iconBackground: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    maxWidth: wp(85),
  },
  title: {
    fontSize: wp(8),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(2),
    lineHeight: wp(9),
  },
  subtitle: {
    fontSize: wp(5),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp(3),
  },
  description: {
    fontSize: wp(4.5),
    textAlign: "center",
    lineHeight: wp(6.5),
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: hp(8),
  },
  paginationContainer: {
    alignItems: "center",
    marginBottom: hp(4),
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(2),
  },
  paginationDot: {
    height: wp(2),
    borderRadius: wp(1),
  },
  buttonContainer: {
    paddingHorizontal: wp(6),
  },
  button: {
    width: "100%",
    borderRadius: wp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
