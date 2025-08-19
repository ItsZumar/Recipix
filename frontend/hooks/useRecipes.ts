import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { 
  Recipe, 
  GetRecipesResponse, 
  GetRecipeResponse, 
  CreateRecipeResponse, 
  UpdateRecipeResponse, 
  DeleteRecipeResponse,
  CreateRecipeInput,
  UpdateRecipeInput,
  PaginationInput
} from '@/types/graphql';

// GraphQL Queries
const GET_RECIPES = gql`
  query GetRecipes($page: Int, $limit: Int, $search: String, $cuisine: String, $difficulty: String) {
    recipes(page: $page, limit: $limit, search: $search, cuisine: $cuisine, difficulty: $difficulty) {
      id
      title
      description
      ingredients
      instructions
      cookingTime
      servings
      difficulty
      cuisine
      tags
      imageUrl
      authorId
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      description
      ingredients
      instructions
      cookingTime
      servings
      difficulty
      cuisine
      tags
      imageUrl
      authorId
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_USER_RECIPES = gql`
  query GetUserRecipes($userId: ID!, $page: Int, $limit: Int) {
    userRecipes(userId: $userId, page: $page, limit: $limit) {
      id
      title
      description
      ingredients
      instructions
      cookingTime
      servings
      difficulty
      cuisine
      tags
      imageUrl
      authorId
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

// GraphQL Mutations
const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      description
      ingredients
      instructions
      cookingTime
      servings
      difficulty
      cuisine
      tags
      imageUrl
      authorId
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: UpdateRecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      description
      ingredients
      instructions
      cookingTime
      servings
      difficulty
      cuisine
      tags
      imageUrl
      authorId
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

// Hook for getting all recipes
export const useRecipes = (variables?: {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  difficulty?: string;
}) => {
  return useQuery<GetRecipesResponse>(GET_RECIPES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for getting a single recipe
export const useRecipe = (id: string) => {
  return useQuery<GetRecipeResponse>(GET_RECIPE, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for getting user recipes
export const useUserRecipes = (userId: string, variables?: PaginationInput) => {
  return useQuery<GetRecipesResponse>(GET_USER_RECIPES, {
    variables: { userId, ...variables },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for lazy loading recipes (for search)
export const useLazyRecipes = () => {
  return useLazyQuery<GetRecipesResponse>(GET_RECIPES, {
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for creating a recipe
export const useCreateRecipe = () => {
  const [createRecipe, { loading, error }] = useMutation<CreateRecipeResponse>(CREATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
  });

  const createRecipeHandler = async (input: CreateRecipeInput): Promise<Recipe | null> => {
    try {
      const { data } = await createRecipe({
        variables: { input },
      });
      return data?.createRecipe || null;
    } catch (err) {
      console.error('Error creating recipe:', err);
      return null;
    }
  };

  return {
    createRecipe: createRecipeHandler,
    loading,
    error,
  };
};

// Hook for updating a recipe
export const useUpdateRecipe = () => {
  const [updateRecipe, { loading, error }] = useMutation<UpdateRecipeResponse>(UPDATE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
  });

  const updateRecipeHandler = async (id: string, input: UpdateRecipeInput): Promise<Recipe | null> => {
    try {
      const { data } = await updateRecipe({
        variables: { id, input },
      });
      return data?.updateRecipe || null;
    } catch (err) {
      console.error('Error updating recipe:', err);
      return null;
    }
  };

  return {
    updateRecipe: updateRecipeHandler,
    loading,
    error,
  };
};

// Hook for deleting a recipe
export const useDeleteRecipe = () => {
  const [deleteRecipe, { loading, error }] = useMutation<DeleteRecipeResponse>(DELETE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }],
  });

  const deleteRecipeHandler = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteRecipe({
        variables: { id },
      });
      return data?.deleteRecipe || false;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      return false;
    }
  };

  return {
    deleteRecipe: deleteRecipeHandler,
    loading,
    error,
  };
};
