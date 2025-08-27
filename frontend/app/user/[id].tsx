import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { RecipeCard } from "@/components/RecipeCard";
import { FollowButton } from "@/components/FollowButton";
import { useFollow } from "@/hooks/useFollow";
import { useUser } from "@/stores/authStore";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id: userId } = useLocalSearchParams<{ id: string }>();
  const currentUser = useUser();
  const { backgroundColor, textColor, tintColor, iconColor } = useScreenColors();
  
  const [activeTab, setActiveTab] = useState<'recipes' | 'favorites'>('recipes');
  
  const { user, isFollowing, isLoading, toggleFollow } = useFollow(userId);

  // Debug logging
  console.log('User profile data:', {
    userId,
    user,
    recipesCount: user?.recipesCount,
    recipes: user?.recipes,
    favoriteRecipes: user?.favoriteRecipes
  });

  const isOwnProfile = currentUser?.id === userId;

  const handleFollow = async () => {
    try {
      await toggleFollow();
    } catch (error) {
      Alert.alert("Error", "Failed to update follow status. Please try again.");
    }
  };

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const profileStats = [
    { 
      id: 1, 
      label: "Recipes", 
      value: user?.recipesCount?.toString() || "0", 
      icon: "restaurant" as const 
    },
    { 
      id: 2, 
      label: "Followers", 
      value: user?.followersCount?.toString() || "0", 
      icon: "people" as const 
    },
    { 
      id: 3, 
      label: "Following", 
      value: user?.followingCount?.toString() || "0", 
      icon: "person-add" as const 
    },
    { 
      id: 4, 
      label: "Views", 
      value: user?.totalRecipeViews?.toString() || "0", 
      icon: "eye" as const 
    },
  ];

  if (!user) {
    return (
      <ScreenWrapper>
        <Header
          title="User Profile"
          leftAccessory={{
            icon: "arrow-back",
            onPress: handleBack,
          }}
        />
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={[styles.loadingText, { color: textColor }]}>
            Loading profile...
          </ThemedText>
        </ThemedView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <Header
        title="Profile"
        leftAccessory={{
          icon: "arrow-back",
          onPress: handleBack,
        }}
        rightAccessory={
          !isOwnProfile ? {
            icon: "ellipsis-horizontal",
            onPress: () => {
              Alert.alert(
                "Options",
                "More options coming soon!",
                [{ text: "OK" }]
              );
            },
          } : undefined
        }
      />

      <ScrollView style={styles.scrollContent}>
        {/* Profile Info */}
        <ThemedView style={styles.profileContainer}>
          <ThemedView style={[styles.avatarContainer, { borderColor: tintColor }]}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={wp(20)} color={iconColor} />
            )}
          </ThemedView>

          <ThemedText type="subtitle" style={[styles.username, { color: textColor }]}>
            {user.username}
          </ThemedText>

          {user.firstName && user.lastName && (
            <ThemedText style={[styles.fullName, { color: textColor }]}>
              {user.firstName} {user.lastName}
            </ThemedText>
          )}

          {user.bio && (
            <ThemedText style={[styles.bio, { color: textColor }]}>
              {user.bio}
            </ThemedText>
          )}

          {!isOwnProfile && (
            <FollowButton
              isFollowing={isFollowing}
              onPress={handleFollow}
              loading={isLoading}
              size="large"
              variant="filled"
            />
          )}
        </ThemedView>

        {/* Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statsGrid}>
            {profileStats.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                style={[styles.statItem, { borderColor: iconColor }]}
                onPress={() => {
                  if (stat.label === "Followers") {
                    // Navigate to followers list
                    Alert.alert("Followers", "Followers list coming soon!");
                  } else if (stat.label === "Following") {
                    // Navigate to following list
                    Alert.alert("Following", "Following list coming soon!");
                  }
                }}
              >
                <Ionicons name={stat.icon} size={wp(6)} color={tintColor} />
                <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: textColor }]}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: textColor }]}>
                  {stat.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Tabs */}
        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'recipes' && { borderBottomColor: tintColor, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab('recipes')}
          >
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'recipes' ? tintColor : textColor }
            ]}>
              Recipes
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'favorites' && { borderBottomColor: tintColor, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <ThemedText style={[
              styles.tabText,
              { color: activeTab === 'favorites' ? tintColor : textColor }
            ]}>
              Favorites
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Content */}
        <ThemedView style={styles.contentContainer}>
          {activeTab === 'recipes' ? (
            <ThemedView style={styles.recipesContainer}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                {user.username}'s Recipes
              </ThemedText>
              
              {user.recipes && user.recipes.length > 0 ? (
                <FlatList
                  data={user.recipes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <RecipeCard
                      recipe={item}
                      onPress={() => handleRecipePress(item.id)}
                    />
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <ThemedView style={styles.emptyState}>
                  <Ionicons name="restaurant-outline" size={wp(15)} color={iconColor} />
                  <ThemedText style={[styles.emptyStateText, { color: textColor }]}>
                    {user.recipesCount > 0 ? "Loading recipes..." : "No recipes yet"}
                  </ThemedText>
                  <ThemedText style={[styles.emptyStateSubtext, { color: textColor }]}>
                    {user.recipesCount > 0 
                      ? "Please wait while we load the recipes..." 
                      : `${user.username} hasn't created any recipes yet.`
                    }
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          ) : (
            <ThemedView style={styles.favoritesContainer}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                {user.username}'s Favorites
              </ThemedText>
              
              {user.favoriteRecipes && user.favoriteRecipes.length > 0 ? (
                <FlatList
                  data={user.favoriteRecipes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <RecipeCard
                      recipe={item}
                      onPress={() => handleRecipePress(item.id)}
                    />
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <ThemedView style={styles.emptyState}>
                  <Ionicons name="heart-outline" size={wp(15)} color={iconColor} />
                  <ThemedText style={[styles.emptyStateText, { color: textColor }]}>
                    No favorites yet
                  </ThemedText>
                  <ThemedText style={[styles.emptyStateSubtext, { color: textColor }]}>
                    {user.username} hasn't favorited any recipes yet.
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp(4),
  },
  profileContainer: {
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
  avatarContainer: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(12.5),
  },
  username: {
    fontSize: wp(5.5),
    marginBottom: hp(0.5),
  },
  fullName: {
    fontSize: wp(4),
    marginBottom: hp(1),
    opacity: 0.8,
  },
  bio: {
    fontSize: wp(3.5),
    textAlign: "center",
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
  },
  statsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: wp(42),
    alignItems: "center",
    paddingVertical: hp(2),
    borderWidth: 1,
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  statValue: {
    fontSize: wp(5),
    marginTop: hp(1),
  },
  statLabel: {
    fontSize: wp(3),
    textAlign: "center",
    marginTop: hp(0.5),
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    marginTop: hp(2),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(2),
    alignItems: "center",
  },
  tabText: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  recipesContainer: {
    flex: 1,
  },
  favoritesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: wp(4.5),
    marginBottom: hp(2),
  },
  recipeCard: {
    marginBottom: hp(2),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(8),
  },
  emptyStateText: {
    fontSize: wp(4.5),
    fontWeight: "600",
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptyStateSubtext: {
    fontSize: wp(3.5),
    textAlign: "center",
    opacity: 0.7,
  },
});
