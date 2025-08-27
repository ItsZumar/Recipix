import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";
import { showImagePickerOptions, getProfileImageOptions } from "@/utils/imagePicker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { useUser } from "@/stores/authStore";
import { useUserFavorites } from "@/hooks/useFavorites";
import { useCurrentUser } from "@/hooks/useUser";
import { PROFILE_STAT_TYPES, QUICK_ACTIONS } from "@/constants/appConstants";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: favoritesData } = useUserFavorites();
  const { data: currentUserData } = useCurrentUser();

  const { backgroundColor, textColor, tintColor, iconColor } = useScreenColors();

  const favoriteRecipesCount = currentUserData?.me?.favoriteRecipesCount || 0;
  const recipesCreatedCount = currentUserData?.me?.recipesCount || 0;
  const recipeViewsCount = currentUserData?.me?.totalRecipeViews || 0;
  const followersCount = currentUserData?.me?.followersCount || 0;

  const handleProfileImageChange = async () => {
    const result = await showImagePickerOptions(getProfileImageOptions());
    if (result) {
      setProfileImage(result.uri);
      // Here you would typically upload the image to your backend
      // and update the user's profile
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleViewRecipes = () => {
    router.push("/recipes");
  };

  const profileStats = [
    { id: 1, label: "Recipes Created", value: recipesCreatedCount.toString(), icon: "restaurant" as const },
    { id: 2, label: "Favorite Recipes", value: favoriteRecipesCount.toString(), icon: "heart" as const },
    { id: 3, label: "Recipe Views", value: recipeViewsCount.toString(), icon: "eye" as const },
    { id: 4, label: "Followers", value: followersCount.toString(), icon: "people" as const },
  ];

  return (
    <ScreenWrapper>
      {/* Header */}
      <Header
        title="Profile"
        rightAccessory={{
          icon: "settings-outline",
          onPress: () => router.push("/settings"),
        }}
      />

      <ScrollView style={styles.scrollContent}>
        {/* Profile Info */}
        <ThemedView style={styles.profileContainer}>
          <TouchableOpacity style={[styles.avatarContainer, { borderColor: tintColor }]} onPress={handleProfileImageChange}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={wp(20)} color={iconColor} />
            )}
            <ThemedView style={styles.avatarOverlay}>
              <Ionicons name="camera" size={wp(6)} color="#fff" />
            </ThemedView>
          </TouchableOpacity>

          <ThemedText type="subtitle" style={[styles.username, { color: textColor }]}>
            {user?.username || "Chef User"}
          </ThemedText>

          <ThemedText style={[styles.email, { color: textColor }]}>{user?.email || "chef@example.com"}</ThemedText>

          {user?.bio && <ThemedText style={[styles.bio, { color: textColor }]}>{user.bio}</ThemedText>}

          <TouchableOpacity style={[styles.editButton, { backgroundColor: tintColor }]} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={wp(4)} color="#fff" />
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Statistics
          </ThemedText>

          <ThemedView style={styles.statsGrid}>
            {profileStats.map((stat) => (
              <TouchableOpacity
                key={stat.id}
                style={[styles.statItem, { borderColor: iconColor }]}
                onPress={() => {
                  if (stat.label === "Favorite Recipes") {
                    router.push("/favorites");
                  } else if (stat.label === "Recipes Created") {
                    router.push("/recipes?filter=my");
                  }
                }}
              >
                <Ionicons name={stat.icon} size={wp(6)} color={tintColor} />
                <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: textColor }]}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: textColor }]}>{stat.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.actionsContainer}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Quick Actions
          </ThemedText>

          <TouchableOpacity style={[styles.actionButton, { borderColor: iconColor }]} onPress={() => router.push("/create-recipe")}>
            <Ionicons name="add-circle-outline" size={wp(6)} color={tintColor} />
            <ThemedView style={styles.actionTextContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.actionTitle, { color: textColor }]}>
                Create New Recipe
              </ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: textColor }]}>Share your culinary creation</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={wp(5)} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { borderColor: iconColor }]} onPress={handleViewRecipes}>
            <Ionicons name="restaurant-outline" size={wp(6)} color={tintColor} />
            <ThemedView style={styles.actionTextContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.actionTitle, { color: textColor }]}>
                My Recipes
              </ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: textColor }]}>View and manage your recipes</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={wp(5)} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { borderColor: iconColor }]} onPress={() => router.push("/favorites")}>
            <Ionicons name="heart-outline" size={wp(6)} color={tintColor} />
            <ThemedView style={styles.actionTextContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.actionTitle, { color: textColor }]}>
                Favorite Recipes
              </ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: textColor }]}>Your saved recipes</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={wp(5)} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { borderColor: iconColor }]} onPress={() => router.push("/search-users")}>
            <Ionicons name="people-outline" size={wp(6)} color={tintColor} />
            <ThemedView style={styles.actionTextContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.actionTitle, { color: textColor }]}>
                Search Users
              </ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: textColor }]}>Find and connect with others</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={wp(5)} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
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
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(12.5),
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: wp(3),
    padding: wp(1),
  },
  username: {
    fontSize: wp(5.5),
    marginBottom: hp(0.5),
  },
  email: {
    fontSize: wp(3.5),
    opacity: 0.7,
    marginBottom: hp(1),
  },
  bio: {
    fontSize: wp(3.5),
    textAlign: "center",
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(6),
    gap: wp(2),
  },
  editButtonText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  statsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    marginBottom: hp(2),
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
  actionsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderRadius: wp(3),
    marginBottom: hp(2),
    gap: wp(3),
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: wp(4),
    marginBottom: hp(0.5),
  },
  actionSubtitle: {
    fontSize: wp(3),
    opacity: 0.7,
  },
});
