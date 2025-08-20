import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RecipeCard } from "@/components/RecipeCard";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { useUserFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { Recipe } from "@/types/graphql";

export default function FavoritesScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useUserFavorites();
  const { toggleFavorite, loading: toggleLoading } = useToggleFavorite();

  const { backgroundColor, textColor, tintColor } = useScreenColors();

  const favoriteRecipes = data?.me?.favoriteRecipes || [];

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  const handleUnfavorite = async (recipe: Recipe) => {
    Alert.alert("Remove from Favorites", `Are you sure you want to remove "${recipe.title}" from your favorites?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const success = await toggleFavorite(recipe.id, true);
          if (success) {
            // Refetch to update the list
            refetch();
          } else {
            Alert.alert("Error", "Failed to remove recipe from favorites");
          }
        },
      },
    ]);
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <ThemedView style={styles.recipeContainer}>
      <RecipeCard recipe={item} onPress={() => handleRecipePress(item.id)} />
      <TouchableOpacity
        style={[styles.unfavoriteButton, { backgroundColor: "#FF3B30" }]}
        onPress={() => handleUnfavorite(item)}
        disabled={toggleLoading}
      >
        <Ionicons name="heart-dislike" size={wp(4)} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="My Favorites" />
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={[styles.loadingText, { color: textColor }]}>Loading your favorite recipes...</ThemedText>
        </ThemedView>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <Header title="My Favorites" />
        <ThemedView style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={wp(12)} color="#FF3B30" />
          <ThemedText style={[styles.errorText, { color: textColor }]}>Failed to load favorites</ThemedText>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: tintColor }]} onPress={() => refetch()}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="My Favorites" />

      {favoriteRecipes.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={wp(15)} color={textColor} />
          <ThemedText style={[styles.emptyTitle, { color: textColor }]}>No Favorite Recipes Yet</ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: textColor }]}>
            Start exploring recipes and add them to your favorites!
          </ThemedText>
          <TouchableOpacity style={[styles.exploreButton, { backgroundColor: tintColor }]} onPress={() => router.push("/")}>
            <ThemedText style={styles.exploreButtonText}>Explore Recipes</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  loadingText: {
    fontSize: wp(4),
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  errorText: {
    fontSize: wp(4),
    textAlign: "center",
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  retryButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  emptyTitle: {
    fontSize: wp(5),
    fontWeight: "600",
    textAlign: "center",
    marginTop: hp(2),
  },
  emptySubtitle: {
    fontSize: wp(3.5),
    textAlign: "center",
    marginTop: hp(1),
    marginBottom: hp(3),
    opacity: 0.7,
  },
  exploreButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    borderRadius: wp(3),
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },
  listContainer: {
    padding: wp(4),
  },
  recipeContainer: {
    position: "relative",
    marginBottom: hp(2),
  },
  unfavoriteButton: {
    position: "absolute",
    top: wp(2),
    right: wp(2),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
