// GraphQL Types for Recipix App

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  imageUrl?: string;
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
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  imageUrl?: string;
}

export interface UpdateRecipeInput {
  id: string;
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  cookingTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  tags?: string[];
  imageUrl?: string;
}

// GraphQL Response Types
export interface LoginResponse {
  login: AuthResponse;
}

export interface RegisterResponse {
  register: AuthResponse;
}

export interface GetRecipesResponse {
  recipes: Recipe[];
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
