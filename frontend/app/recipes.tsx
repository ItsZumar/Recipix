import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { Header } from '@/components/Header';
import { ScreenWrapper, useScreenColors } from '@/components/ScreenWrapper';
import { useRecipes, useLazyRecipes } from '@/hooks/useRecipes';
import { useCurrentUser } from '@/hooks/useUser';
import { useThemeColor } from '@/hooks/useThemeColor';
import { wp, hp } from '@/utils/responsive';
import { Recipe } from '@/types/graphql';
import { 
  RECIPE_SORT_OPTIONS, 
  RECIPE_FILTER_OPTIONS, 
  APP_CONFIG, 
  PLACEHOLDER_TEXTS,
  EMPTY_STATE_MESSAGES,
  LOADING_MESSAGES
} from '@/constants/appConstants';

type SortOption = typeof RECIPE_SORT_OPTIONS[number]['id'];
type FilterOption = typeof RECIPE_FILTER_OPTIONS[number]['id'];

export default function RecipesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Handle URL parameters
  useEffect(() => {
    if (params.filter === 'my') {
      setFilterBy('my');
    }
  }, [params.filter]);

  // Get current user data
  const { data: currentUserData } = useCurrentUser();
  const currentUserId = currentUserData?.me?.id;

  // Fetch all recipes
  const { data: recipesData, loading, error, refetch } = useRecipes({
    first: APP_CONFIG.RECIPES_SCREEN_LIMIT, // Get more recipes for this screen
    sort: { field: 'createdAt', direction: 'DESC' },
  });

  // Lazy search for when user searches
  const [searchRecipes, { data: searchData, loading: searchLoading }] = useLazyRecipes();

  // Handle search
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      searchRecipes({
        variables: {
          query: searchQuery.trim(),
          limit: APP_CONFIG.RECIPES_SCREEN_LIMIT,
        },
      });
    }
  }, [searchQuery, searchRecipes]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Get recipes based on search or default
  const allRecipes = searchQuery.trim() 
    ? (searchData?.searchRecipes || []) 
    : (recipesData?.recipes?.edges?.map((edge: any) => edge.node) || []);

  // Filter recipes by difficulty or user
  const filteredRecipes = allRecipes.filter((recipe: Recipe) => {
    if (filterBy === 'all') return true;
    if (filterBy === 'my') return recipe.authorId === currentUserId;
    return recipe.difficulty === filterBy;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a: Recipe, b: Recipe) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'cookTime':
        return (a.cookTime || 0) - (b.cookTime || 0);
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  // Handle recipe press
  const handleRecipePress = useCallback((recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  }, [router]);

  // Render recipe item
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeItemContainer}>
      <RecipeCard recipe={item} onPress={() => handleRecipePress(item.id)} />
    </View>
  );

  // Render sort option
  const renderSortOption = ({ item }: { item: typeof RECIPE_SORT_OPTIONS[number] }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: sortBy === item.id ? tintColor : backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
          borderColor: sortBy === item.id ? tintColor : iconColor,
        }
      ]}
      onPress={() => setSortBy(item.id as SortOption)}
    >
      <Ionicons
        name={item.icon}
        size={wp(4)}
        color={sortBy === item.id ? '#fff' : textColor}
      />
      <ThemedText
        style={[
          styles.filterButtonText,
          { color: sortBy === item.id ? '#fff' : textColor }
        ]}
      >
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

  // Render difficulty filter
  const renderDifficultyFilter = ({ item }: { item: typeof RECIPE_FILTER_OPTIONS[number] }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filterBy === item.id ? tintColor : backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
          borderColor: filterBy === item.id ? tintColor : iconColor,
        }
      ]}
      onPress={() => setFilterBy(item.id as FilterOption)}
    >
      <Ionicons
        name={item.icon}
        size={wp(4)}
        color={filterBy === item.id ? '#fff' : textColor}
      />
      <ThemedText
        style={[
          styles.filterButtonText,
          { color: filterBy === item.id ? '#fff' : textColor }
        ]}
      >
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

  const isLoading = loading || searchLoading;

  return (
    <ScreenWrapper>
      {/* Header */}
      <Header
        title={filterBy === 'my' ? 'My Recipes' : 'All Recipes'}
        centerSubtitle={`${sortedRecipes.length} recipes`}
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => router.back(),
        }}
        rightAccessory={{
          icon: showFilters ? "close" : "options",
          onPress: () => setShowFilters(!showFilters),
        }}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        placeholder={PLACEHOLDER_TEXTS.SEARCH_RECIPES}
      />

      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Sort Options */}
          <View style={styles.filterSection}>
            <ThemedText style={[styles.filterSectionTitle, { color: textColor }]}>
              Sort By
            </ThemedText>
            <FlatList
              data={RECIPE_SORT_OPTIONS}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}
            />
          </View>

          {/* Difficulty Filters */}
          <View style={styles.filterSection}>
            <ThemedText style={[styles.filterSectionTitle, { color: textColor }]}>
              Difficulty
            </ThemedText>
            <FlatList
              data={RECIPE_FILTER_OPTIONS}
              renderItem={renderDifficultyFilter}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}
            />
          </View>
        </View>
      )}

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <ThemedText style={[styles.resultsText, { color: iconColor }]}>
          {searchQuery.trim() 
            ? `Search results for "${searchQuery}"` 
            : filterBy === 'my' 
              ? 'My recipes' 
              : 'All recipes'
          }
          {' • '}
          {sortedRecipes.length} recipe{sortedRecipes.length !== 1 ? 's' : ''}
        </ThemedText>
        {searchQuery.trim() && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
            <ThemedText style={[styles.clearSearchText, { color: tintColor }]}>
              Clear search
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Recipes List */}
              {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass" size={wp(12)} color={iconColor} />
            <ThemedText style={[styles.loadingText, { color: textColor }]}>
              {LOADING_MESSAGES.LOADING_RECIPES}
            </ThemedText>
          </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={wp(12)} color="#FF3B30" />
          <ThemedText style={[styles.errorText, { color: textColor }]}>
            Failed to load recipes
          </ThemedText>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: tintColor }]} onPress={onRefresh}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : sortedRecipes.length > 0 ? (
        <FlatList
          data={sortedRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.recipesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={searchQuery.trim() ? "search" : "restaurant"} 
            size={wp(15)} 
            color={iconColor} 
          />
          <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
            {searchQuery.trim() 
              ? `No recipes found for "${searchQuery}"` 
              : filterBy === 'my'
                ? EMPTY_STATE_MESSAGES.NO_MY_RECIPES.title
                : EMPTY_STATE_MESSAGES.NO_RECIPES.title
            }
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: iconColor }]}>
            {searchQuery.trim()
              ? EMPTY_STATE_MESSAGES.NO_SEARCH_RESULTS.subtitle
              : filterBy === 'my'
                ? EMPTY_STATE_MESSAGES.NO_MY_RECIPES.subtitle
                : EMPTY_STATE_MESSAGES.NO_RECIPES.subtitle
            }
          </ThemedText>
          {!searchQuery.trim() && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/create-recipe')}
            >
              <Ionicons name="add" size={wp(5)} color="#fff" />
              <ThemedText style={styles.createButtonText}>Create Recipe</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: wp(2),
  },
  filterToggle: {
    padding: wp(2),
  },
  filtersContainer: {
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: hp(2),
  },
  filterSectionTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    marginLeft: wp(4),
    marginBottom: hp(1),
  },
  filtersList: {
    paddingHorizontal: wp(2),
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(6),
    borderWidth: 1,
    marginHorizontal: wp(1),
    gap: wp(1.5),
  },
  filterButtonText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  resultsText: {
    fontSize: wp(3.5),
    flex: 1,
  },
  clearSearchButton: {
    paddingHorizontal: wp(2),
  },
  clearSearchText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  recipesList: {
    padding: wp(2),
  },
  recipeItemContainer: {
    flex: 0.5,
    margin: wp(1),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(10),
  },
  loadingText: {
    fontSize: wp(4),
    marginTop: hp(2),
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(10),
  },
  errorText: {
    fontSize: wp(4),
    marginTop: hp(2),
    textAlign: 'center',
    marginBottom: hp(3),
  },
  retryButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(10),
  },
  emptyTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    marginTop: hp(2),
    textAlign: 'center',
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: wp(3.5),
    textAlign: 'center',
    marginBottom: hp(3),
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    gap: wp(2),
  },
  createButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
  },
});
