import { gql } from '@apollo/client';

export const UPDATE_PROFILE_VISIBILITY = gql`
  mutation UpdateProfileVisibility($visibility: ProfileVisibility!) {
    updateProfileVisibility(visibility: $visibility) {
      id
      username
      email
      firstName
      lastName
      bio
      avatar
      profileVisibility
      isVerified
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      username
      email
      firstName
      lastName
      bio
      avatar
      profileVisibility
      isVerified
      role
      createdAt
      updatedAt
      recipesCount
      favoriteRecipesCount
      followersCount
      followingCount
      totalRecipeViews
    }
  }
`;
