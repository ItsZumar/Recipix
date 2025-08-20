// GraphQL Types for Recipix App

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  recipesCount?: number;
  favoriteRecipes?: Recipe[];
  favoriteRecipesCount?: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  image?: string;
  isPublic: boolean;
  isPublished: boolean;
  rating: number;
  ratingCount: number;
  viewCount: number;
  favoriteCount: number;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  tags?: string[];
  image?: string;
  isPublic?: boolean;
  isPublished?: boolean;
}

export interface UpdateRecipeInput {
  title?: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  tags?: string[];
  image?: string;
  isPublic?: boolean;
  isPublished?: boolean;
}

// GraphQL Response Types
export interface LoginResponse {
  login: AuthResponse;
}

export interface RegisterResponse {
  register: AuthResponse;
}

export interface RecipeEdge {
  node: Recipe;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface RecipeConnection {
  edges: RecipeEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface GetRecipesResponse {
  recipes: RecipeConnection;
}

export interface SearchRecipesResponse {
  searchRecipes: Recipe[];
}

export interface GetRecentRecipesResponse {
  recentRecipes: Recipe[];
}

export interface GetRecipeResponse {
  recipe: Recipe;
}

export interface CreateRecipeResponse {
  createRecipe: Recipe;
}

export interface UpdateRecipeResponse {
  updateRecipe: Recipe;
}

export interface DeleteRecipeResponse {
  deleteRecipe: boolean;
}

export interface FavoriteRecipeResponse {
  favoriteRecipe: boolean;
}

export interface UnfavoriteRecipeResponse {
  unfavoriteRecipe: boolean;
}

export interface GetUserFavoritesResponse {
  me: {
    favoriteRecipes: Recipe[];
  };
}

// Pagination Types
export interface PaginationInput {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface GraphQLError {
  message: string;
  code?: string;
  path?: string[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
