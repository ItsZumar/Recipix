import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, CreateRecipeInput, UpdateRecipeInput } from '@/types/graphql';

interface RecipeState {
  // State
  recipes: Recipe[];
  userRecipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  setUserRecipes: (recipes: Recipe[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Recipe management
  createRecipe: (input: CreateRecipeInput) => Promise<Recipe | null>;
  updateRecipeById: (id: string, input: UpdateRecipeInput) => Promise<Recipe | null>;
  deleteRecipeById: (id: string) => Promise<boolean>;
  
  // Search and filtering
  searchRecipes: (query: string) => Recipe[];
  filterRecipesByCuisine: (cuisine: string) => Recipe[];
  filterRecipesByDifficulty: (difficulty: string) => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  
        // Favorites
      favoriteRecipes: Recipe[];
      toggleFavorite: (recipeId: string) => void;
      addToFavorites: (recipe: Recipe) => void;
      removeFromFavorites: (recipeId: string) => void;
      isFavorite: (recipeId: string) => boolean;
  
  // Reset
  reset: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      // Initial state
      recipes: [],
      userRecipes: [],
      currentRecipe: null,
      isLoading: false,
      error: null,
      favoriteRecipes: [],
      
      // Basic setters
      setRecipes: (recipes) => set({ recipes }),
      addRecipe: (recipe) => set((state) => ({ 
        recipes: [recipe, ...state.recipes],
        userRecipes: [recipe, ...state.userRecipes]
      })),
      updateRecipe: (id, updates) => set((state) => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id ? { ...recipe, ...updates } : recipe
        ),
        userRecipes: state.userRecipes.map(recipe => 
          recipe.id === id ? { ...recipe, ...updates } : recipe
        ),
        currentRecipe: state.currentRecipe?.id === id 
          ? { ...state.currentRecipe, ...updates }
          : state.currentRecipe
      })),
      removeRecipe: (id) => set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        userRecipes: state.userRecipes.filter(recipe => recipe.id !== id),
        currentRecipe: state.currentRecipe?.id === id ? null : state.currentRecipe
      })),
      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      setUserRecipes: (recipes) => set({ userRecipes: recipes }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Recipe management (these would typically call your GraphQL mutations)
      createRecipe: async (input) => {
        set({ isLoading: true, error: null });
        try {
          // This would typically call your GraphQL mutation
          // For now, we'll create a mock recipe
          const newRecipe: Recipe = {
            id: Date.now().toString(),
            ...input,
            description: input.description || '',
            difficulty: input.difficulty || 'easy',
            cuisine: input.cuisine || 'Other',
            tags: input.tags || [],
            isPublic: input.isPublic ?? true,
            isPublished: input.isPublished ?? true,
            authorId: 'current-user-id', // This should come from auth store
            author: {
              id: 'current-user-id',
              username: 'Current User',
              email: 'user@example.com'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          get().addRecipe(newRecipe);
          set({ isLoading: false });
          return newRecipe;
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to create recipe' });
          return null;
        }
      },
      
      updateRecipeById: async (id, input) => {
        set({ isLoading: true, error: null });
        try {
          // This would typically call your GraphQL mutation
          const updates = { ...input, updatedAt: new Date().toISOString() };
          get().updateRecipe(id, updates);
          set({ isLoading: false });
          return get().getRecipeById(id) || null;
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to update recipe' });
          return null;
        }
      },
      
      deleteRecipeById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // This would typically call your GraphQL mutation
          get().removeRecipe(id);
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to delete recipe' });
          return false;
        }
      },
      
      // Search and filtering
      searchRecipes: (query) => {
        const { recipes } = get();
        const lowercaseQuery = query.toLowerCase();
        return recipes.filter(recipe => 
          recipe.title.toLowerCase().includes(lowercaseQuery) ||
          recipe.description.toLowerCase().includes(lowercaseQuery) ||
          recipe.ingredients.some(ingredient => 
            ingredient.name.toLowerCase().includes(lowercaseQuery)
          ) ||
          recipe.tags.some(tag => 
            tag.toLowerCase().includes(lowercaseQuery)
          )
        );
      },
      
      filterRecipesByCuisine: (cuisine) => {
        const { recipes } = get();
        return recipes.filter(recipe => 
          recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
        );
      },
      
      filterRecipesByDifficulty: (difficulty) => {
        const { recipes } = get();
        return recipes.filter(recipe => 
          recipe.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
      },
      
      getRecipeById: (id) => {
        const { recipes } = get();
        return recipes.find(recipe => recipe.id === id);
      },
      
      // Favorites
      addToFavorites: (recipe) => set((state) => ({
        favoriteRecipes: [...state.favoriteRecipes, recipe]
      })),
      
      removeFromFavorites: (recipeId) => set((state) => ({
        favoriteRecipes: state.favoriteRecipes.filter(recipe => recipe.id !== recipeId)
      })),
      
      toggleFavorite: (recipeId) => set((state) => {
        const isCurrentlyFavorite = state.favoriteRecipes.some(recipe => recipe.id === recipeId);
        if (isCurrentlyFavorite) {
          return { favoriteRecipes: state.favoriteRecipes.filter(recipe => recipe.id !== recipeId) };
        } else {
          const recipe = get().getRecipeById(recipeId);
          if (recipe) {
            return { favoriteRecipes: [...state.favoriteRecipes, recipe] };
          }
          return state;
        }
      }),
      
      isFavorite: (recipeId) => {
        const { favoriteRecipes } = get();
        return favoriteRecipes.some(recipe => recipe.id === recipeId);
      },
      
      // Reset
      reset: () => set({
        recipes: [],
        userRecipes: [],
        currentRecipe: null,
        isLoading: false,
        error: null,
        favoriteRecipes: [],
      }),
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteRecipes: state.favoriteRecipes,
        // Don't persist recipes as they should be fetched from server
        // Only persist user preferences like favorites
      }),
    }
  )
);
