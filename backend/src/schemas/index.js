const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    avatar: String
    bio: String
    isVerified: Boolean!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    recipes: [Recipe!]!
    recipesCount: Int!
    favoriteRecipes: [Recipe!]!
    favoriteRecipesCount: Int!
    followers: [User!]!
    followersCount: Int!
    following: [User!]!
    followingCount: Int!
    isFollowing: Boolean
    totalRecipeViews: Int!
  }

  type Recipe {
    id: ID!
    title: String!
    description: String
    ingredients: [Ingredient!]!
    instructions: [String!]!
    prepTime: Int
    cookTime: Int
    servings: Int
    difficulty: Difficulty!
    cuisine: String
    tags: [String!]!
    image: String
    isPublic: Boolean!
    isPublished: Boolean!
    rating: Float!
    ratingCount: Int!
    viewCount: Int!
    favoriteCount: Int!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type Ingredient {
    name: String!
    amount: Float!
    unit: String!
    notes: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type RecipeConnection {
    edges: [RecipeEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type RecipeEdge {
    node: Recipe!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  enum UserRole {
    user
    admin
  }

  enum Difficulty {
    easy
    medium
    hard
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    firstName: String
    lastName: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    bio: String
    avatar: String
  }

  input CreateRecipeInput {
    title: String!
    description: String
    ingredients: [IngredientInput!]!
    instructions: [String!]!
    prepTime: Int
    cookTime: Int
    servings: Int
    difficulty: Difficulty
    cuisine: String
    tags: [String!]
    image: String
    isPublic: Boolean
    isPublished: Boolean
  }

  input UpdateRecipeInput {
    title: String
    description: String
    ingredients: [IngredientInput!]
    instructions: [String!]
    prepTime: Int
    cookTime: Int
    servings: Int
    difficulty: Difficulty
    cuisine: String
    tags: [String!]
    image: String
    isPublic: Boolean
    isPublished: Boolean
  }

  input IngredientInput {
    name: String!
    amount: Float!
    unit: String!
    notes: String
  }

  input RecipeFilterInput {
    search: String
    cuisine: String
    difficulty: Difficulty
    minRating: Float
    maxPrepTime: Int
    maxCookTime: Int
    tags: [String!]
    authorId: ID
  }

  input RecipeSortInput {
    field: RecipeSortField!
    direction: SortDirection!
  }

  enum RecipeSortField {
    title
    rating
    createdAt
    updatedAt
    prepTime
    cookTime
  }

  enum SortDirection {
    ASC
    DESC
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(limit: Int, offset: Int): [User!]!
    
    # Recipe queries
    recipe(id: ID!): Recipe
    recipes(
      filter: RecipeFilterInput
      sort: RecipeSortInput
      first: Int
      after: String
      last: Int
      before: String
    ): RecipeConnection!
    
    # Search queries
    searchRecipes(query: String!, limit: Int, offset: Int): [Recipe!]!
    searchUsers(query: String!, limit: Int, offset: Int): [User!]!
    
    # Popular queries
    popularRecipes(limit: Int): [Recipe!]!
    recentRecipes(limit: Int): [Recipe!]!
    
    # Follow queries
    userFollowers(userId: ID!, limit: Int, offset: Int): [User!]!
    userFollowing(userId: ID!, limit: Int, offset: Int): [User!]!
  }

  type Mutation {
    # Authentication
    register(input: CreateUserInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # User management
    updateProfile(input: UpdateUserInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    
    # Recipe management
    createRecipe(input: CreateRecipeInput!): Recipe!
    updateRecipe(id: ID!, input: UpdateRecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
    publishRecipe(id: ID!): Recipe!
    unpublishRecipe(id: ID!): Recipe!
    
    # Recipe interactions
    favoriteRecipe(id: ID!): Boolean!
    unfavoriteRecipe(id: ID!): Boolean!
    rateRecipe(id: ID!, rating: Int!): Recipe!
    viewRecipe(id: ID!): Recipe!
    
    # Follow interactions
    followUser(userId: ID!): Boolean!
    unfollowUser(userId: ID!): Boolean!
  }

  type Subscription {
    recipeCreated: Recipe!
    recipeUpdated: Recipe!
    recipeDeleted: ID!
  }
`;

module.exports = typeDefs;
