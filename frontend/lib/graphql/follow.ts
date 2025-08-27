import { gql } from '@apollo/client';

// Queries
export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: ID!, $limit: Int, $offset: Int) {
    userFollowers(userId: $userId, limit: $limit, offset: $offset) {
      id
      username
      firstName
      lastName
      avatar
      bio
      followersCount
      followingCount
      isFollowing
    }
  }
`;

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: ID!, $limit: Int, $offset: Int) {
    userFollowing(userId: $userId, limit: $limit, offset: $offset) {
      id
      username
      firstName
      lastName
      avatar
      bio
      followersCount
      followingCount
      isFollowing
    }
  }
`;

// Mutations
export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId)
  }
`;

// Enhanced user query with follow data
export const GET_USER_WITH_FOLLOW_DATA = gql`
  query GetUserWithFollowData($userId: ID!) {
    user(id: $userId) {
      id
      username
      firstName
      lastName
      avatar
      bio
      recipesCount
      favoriteRecipesCount
      followersCount
      followingCount
      isFollowing
      totalRecipeViews
      recipes {
        id
        title
        description
        image
        prepTime
        cookTime
        servings
        difficulty
        cuisine
        rating
        ratingCount
        viewCount
        favoriteCount
        createdAt
        author {
          id
          username
          avatar
        }
      }
      favoriteRecipes {
        id
        title
        description
        image
        prepTime
        cookTime
        servings
        difficulty
        cuisine
        rating
        ratingCount
        viewCount
        favoriteCount
        createdAt
        author {
          id
          username
          avatar
        }
      }
    }
  }
`;
