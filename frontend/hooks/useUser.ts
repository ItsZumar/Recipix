import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { User } from '@/types/graphql';

// GraphQL Query
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      firstName
      lastName
      bio
      avatar
      createdAt
      updatedAt
      recipesCount
      favoriteRecipesCount
    }
  }
`;

export interface GetCurrentUserResponse {
  me: User;
}

// Hook for getting current user data
export const useCurrentUser = () => {
  return useQuery<GetCurrentUserResponse>(GET_CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
  });
};
