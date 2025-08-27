import { useQuery, useMutation, useApolloClient, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Recipe, CreateRecipeResponse, UpdateRecipeResponse, DeleteRecipeResponse } from '@/types/graphql';

// GraphQL Queries and Mutations
const GET_RECIPES = gql`
  query GetRecipes($filter: RecipeFilterInput, $sort: RecipeSortInput, $first: Int, $after: String) {
    recipes(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

const SEARCH_RECIPES = gql`
  query SearchRecipes($query: String!, $limit: Int, $offset: Int) {
    searchRecipes(query: $query, limit: $limit, offset: $offset) {
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
`;

const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
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
      isPublic
      isPublished
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
`;

const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
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
      isPublic
      isPublished
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
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: UpdateRecipeInput!) {
    updateRecipe(id: $id, input: $input) {
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
      isPublic
      isPublished
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
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

// Hook for getting a single recipe
export const useRecipe = (id: string) => {
  return useQuery(GET_RECIPE, {
    variables: { id },
    skip: !id,
  });
};

// Hook for creating a recipe
export const useCreateRecipe = () => {
  const client = useApolloClient();
  
  const [createRecipe, { loading, error }] = useMutation<CreateRecipeResponse>(CREATE_RECIPE);

  const handleCreateRecipe = async (recipeData: any) => {
    try {
      const { data } = await createRecipe({
        variables: { input: recipeData },
        // Simplify cache update to avoid iterator issues
        refetchQueries: ['GetRecipes'],
      });

      return data?.createRecipe;
    } catch (err) {
      console.error('Error creating recipe:', err);
      throw err;
    }
  };

  return {
    createRecipe: handleCreateRecipe,
    loading,
    error,
  };
};

// Hook for updating a recipe
export const useUpdateRecipe = () => {
  const [updateRecipe, { loading, error }] = useMutation<UpdateRecipeResponse>(UPDATE_RECIPE);

  const handleUpdateRecipe = async (id: string, recipeData: any) => {
    try {
      const { data } = await updateRecipe({
        variables: { id, input: recipeData },
        update: (cache, { data }) => {
          if (data?.updateRecipe) {
            // Update cache with updated recipe
                         cache.writeFragment({
               id: cache.identify({ __typename: 'Recipe', id }),
               fragment: gql`
                 fragment UpdatedRecipe on Recipe {
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
                   isPublic
                   isPublished
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
               `,
               data: data.updateRecipe,
             });
          }
        },
      });

      return data?.updateRecipe;
    } catch (err) {
      console.error('Error updating recipe:', err);
      throw err;
    }
  };

  return {
    updateRecipe: handleUpdateRecipe,
    loading,
    error,
  };
};

// Hook for deleting a recipe
export const useDeleteRecipe = () => {
  const client = useApolloClient();
  
  const [deleteRecipe, { loading, error }] = useMutation<DeleteRecipeResponse>(DELETE_RECIPE);

  const handleDeleteRecipe = async (id: string) => {
    try {
      const { data } = await deleteRecipe({
        variables: { id },
        update: (cache, { data }) => {
          if (data?.deleteRecipe) {
            // Remove recipe from cache
            cache.evict({ id: cache.identify({ __typename: 'Recipe', id }) });
            cache.gc();
          }
        },
      });

      return data?.deleteRecipe;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      throw err;
    }
  };

  return {
    deleteRecipe: handleDeleteRecipe,
    loading,
    error,
  };
};

// Hook for getting all recipes with filters
export const useRecipes = (variables?: {
  filter?: {
    search?: string;
    cuisine?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    minRating?: number;
    maxPrepTime?: number;
    maxCookTime?: number;
    tags?: string[];

  };
  sort?: {
    field: 'title' | 'rating' | 'createdAt' | 'updatedAt' | 'prepTime' | 'cookTime';
    direction: 'ASC' | 'DESC';
  };
  first?: number;
  after?: string;
}) => {
  return useQuery(GET_RECIPES, {
    variables: {
      filter: variables?.filter,
      sort: variables?.sort || { field: 'createdAt', direction: 'DESC' },
      first: variables?.first || 10,
      after: variables?.after,
    },
    fetchPolicy: 'cache-and-network',
  });
};

// Hook for lazy loading recipes (for search)
export const useLazyRecipes = () => {
  return useLazyQuery(SEARCH_RECIPES, {
    fetchPolicy: 'cache-and-network',
  });
};
