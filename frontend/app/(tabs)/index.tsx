import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, TouchableOpacity, ScrollView, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { wp, hp } from "@/utils/responsive";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { RecipeCard } from "@/components/RecipeCard";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { useUser } from "@/stores/authStore";

import { useRecipes, useLazyRecipes } from "@/hooks/useRecipes";
import { useUserFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { RECIPE_CATEGORIES, APP_CONFIG, PLACEHOLDER_TEXTS } from "@/constants/appConstants";

export default function HomeScreen() {
  const router = useRouter();
  const user = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { backgroundColor, textColor, tintColor } = useScreenColors();

  // Favorite functionality
  const { data: favoritesData } = useUserFavorites();
  const { toggleFavorite, loading: toggleLoading } = useToggleFavorite();
  const favoriteRecipeIds = favoritesData?.me?.favoriteRecipes?.map((recipe) => recipe.id) || [];

  // Fetch trending recipes with category filtering
  const {
    data: trendingData,
    loading: trendingLoading,
    refetch: refetchTrending,
  } = useRecipes({
    first: APP_CONFIG.DEFAULT_RECIPE_LIMIT,
    sort: { field: "createdAt", direction: "DESC" },
    filter: selectedCategory
      ? {
          cuisine: selectedCategory,
        }
      : undefined,
  });

  // Lazy search for when user searches
  const [searchRecipes, { data: searchData, loading: searchLoading }] = useLazyRecipes();

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      searchRecipes({
        variables: {
          query: searchQuery.trim(),
          limit: APP_CONFIG.SEARCH_RECIPE_LIMIT,
        },
      });
    }
  }, [searchQuery, searchRecipes]);

  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      const newCategory = selectedCategory === categoryId ? null : categoryId;
      setSelectedCategory(newCategory);

      // Clear search when selecting a category
      if (searchQuery.trim()) {
        setSearchQuery("");
      }

      // Refetch recipes with new category filter
      refetchTrending();
    },
    [selectedCategory, searchQuery, refetchTrending]
  );

  const handleRecipePress = useCallback(
    (recipeId: string) => {
      // Navigate to recipe detail screen
      router.push(`/recipe/${recipeId}`);
    },
    [router]
  );

  const renderCategoryItem = ({ item }: { item: (typeof RECIPE_CATEGORIES)[number] }) => (
    <CategoryCard
      title={item.title}
      icon={item.icon}
      onPress={() => handleCategoryPress(item.id)}
      isSelected={selectedCategory === item.id}
    />
  );

  const renderRecipeItem = ({ item }: { item: any }) => {
    if (!item || !item.id) return null;

    const isFavorited = favoriteRecipeIds.includes(item.id);

    const handleFavoritePress = async () => {
      const success = await toggleFavorite(item.id, isFavorited);
      if (!success) {
        Alert.alert("Error", "Failed to update favorite status");
      }
    };

    return (
      <RecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item.id)}
        onFavoritePress={handleFavoritePress}
        isFavorited={isFavorited}
        showFavoriteButton={true}
      />
    );
  };

  const trendingRecipes = trendingData?.recipes?.edges?.map((edge: any) => edge.node) || [];
  const searchResults = searchData?.searchRecipes || [];
  const displayRecipes = searchQuery.trim() ? searchResults : trendingRecipes;
  const isLoading = trendingLoading || searchLoading;

  return (
    <ScreenWrapper>
      {/* Header */}
      <Header
        title={`Welcome, ${user?.username || "Chef"}! 👨‍🍳`}
        centerSubtitle="Discover delicious recipes and start cooking today"
        rightAccessory={{
          icon: "person-circle-outline",
          onPress: () => router.push("/profile"),
        }}
      />

      <ScrollView style={styles.scrollContent}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder={PLACEHOLDER_TEXTS.SEARCH_RECIPES}
        />

        {/* Categories Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">{selectedCategory ? `Category: ${selectedCategory}` : "Categories"}</ThemedText>
            <View style={{ flexDirection: "row", gap: wp(3) }}>
              {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <ThemedText style={[styles.seeAllText, { color: "#FF3B30" }]}>Clear</ThemedText>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => router.push("/recipes")}>
                <ThemedText style={[styles.seeAllText, { color: tintColor }]}>See All</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
          <FlatList
            data={RECIPE_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </ThemedView>

        {/* Trending Recipes Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">
              {searchQuery.trim() ? "Search Results" : selectedCategory ? `${selectedCategory} Recipes` : "Trending Recipes"}
            </ThemedText>
            {!searchQuery.trim() && (
              <TouchableOpacity onPress={() => router.push("/recipes")}>
                <ThemedText style={[styles.seeAllText, { color: tintColor }]}>See All</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>

          {isLoading ? (
            <ThemedView style={styles.loadingContainer}>
              <ThemedText style={[styles.loadingText, { color: textColor }]}>Loading recipes...</ThemedText>
            </ThemedView>
          ) : displayRecipes.length > 0 ? (
            <FlatList
              data={displayRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesList}
            />
          ) : searchQuery.trim() ? (
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="search" size={wp(12)} color={textColor} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>No recipes found for &quot;{searchQuery}&quot;</ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>Try different keywords or browse categories</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="restaurant" size={wp(12)} color={textColor} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>
                {selectedCategory ? `No ${selectedCategory} recipes available` : "No trending recipes available"}
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                {selectedCategory ? "Try selecting a different category or check back later" : "Check back later for new recipes"}
              </ThemedText>
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
  sectionContainer: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  seeAllText: {
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  categoriesList: {
    paddingHorizontal: wp(3),
  },
  recipesList: {
    paddingHorizontal: wp(2),
  },
  loadingContainer: {
    padding: wp(10),
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp(4),
    marginTop: hp(1.5),
  },
  emptyContainer: {
    padding: wp(10),
    alignItems: "center",
  },
  emptyText: {
    fontSize: wp(4),
    fontWeight: "600",
    marginTop: hp(1.5),
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: wp(3.5),
    marginTop: hp(0.5),
    textAlign: "center",
    opacity: 0.7,
  },
});
