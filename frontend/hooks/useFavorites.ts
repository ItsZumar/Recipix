import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { 
  Recipe, 
  FavoriteRecipeResponse, 
  UnfavoriteRecipeResponse,
  GetUserFavoritesResponse
} from '@/types/graphql';

// GraphQL Queries
const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    me {
      id
      favoriteRecipes {
        id
        title
        description
        ingredients {
          name
          amount
          unit
          notes
        }
        instructions
        prepTime
        cookTime
        servings
        difficulty
        cuisine
        tags
        image
        rating
        ratingCount
        viewCount
        favoriteCount
        author {
          id
          username
          firstName
          lastName
          avatar
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// GraphQL Mutations
const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipe($id: ID!) {
    favoriteRecipe(id: $id)
  }
`;

const UNFAVORITE_RECIPE = gql`
  mutation UnfavoriteRecipe($id: ID!) {
    unfavoriteRecipe(id: $id)
  }
`;

// Hook for getting user's favorite recipes
export const useUserFavorites = () => {
  return useQuery<GetUserFavoritesResponse>(GET_USER_FAVORITES, {
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for favoriting a recipe
export const useFavoriteRecipe = () => {
  const [favoriteRecipe, { loading, error }] = useMutation<FavoriteRecipeResponse>(FAVORITE_RECIPE, {
    refetchQueries: [
      { query: GET_USER_FAVORITES },
      // You might want to refetch other queries that show recipe data
    ],
  });

  const favoriteRecipeHandler = async (recipeId: string): Promise<boolean> => {
    try {
      const { data } = await favoriteRecipe({
        variables: { id: recipeId },
      });
      return data?.favoriteRecipe || false;
    } catch (err) {
      console.error('Error favoriting recipe:', err);
      return false;
    }
  };

  return {
    favoriteRecipe: favoriteRecipeHandler,
    loading,
    error,
  };
};

// Hook for unfavoriting a recipe
export const useUnfavoriteRecipe = () => {
  const [unfavoriteRecipe, { loading, error }] = useMutation<UnfavoriteRecipeResponse>(UNFAVORITE_RECIPE, {
    refetchQueries: [
      { query: GET_USER_FAVORITES },
      // You might want to refetch other queries that show recipe data
    ],
  });

  const unfavoriteRecipeHandler = async (recipeId: string): Promise<boolean> => {
    try {
      const { data } = await unfavoriteRecipe({
        variables: { id: recipeId },
      });
      return data?.unfavoriteRecipe || false;
    } catch (err) {
      console.error('Error unfavoriting recipe:', err);
      return false;
    }
  };

  return {
    unfavoriteRecipe: unfavoriteRecipeHandler,
    loading,
    error,
  };
};

// Hook for toggling favorite status
export const useToggleFavorite = () => {
  const { favoriteRecipe, loading: favoriteLoading, error: favoriteError } = useFavoriteRecipe();
  const { unfavoriteRecipe, loading: unfavoriteLoading, error: unfavoriteError } = useUnfavoriteRecipe();

  const toggleFavorite = async (recipeId: string, isCurrentlyFavorited: boolean): Promise<boolean> => {
    try {
      if (isCurrentlyFavorited) {
        return await unfavoriteRecipe(recipeId);
      } else {
        return await favoriteRecipe(recipeId);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return false;
    }
  };

  return {
    toggleFavorite,
    loading: favoriteLoading || unfavoriteLoading,
    error: favoriteError || unfavoriteError,
  };
};
