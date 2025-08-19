// Common TypeScript types and utilities for Recipix

// Navigation Types
export interface RootStackParamList {
  '(tabs)': undefined;
  'auth': undefined;
  'auth/login': undefined;
  'auth/register': undefined;
  'recipe': { id: string };
  'create-recipe': undefined;
  'edit-recipe': { id: string };
  'profile': undefined;
  '+not-found': undefined;
}

// Form Types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// UI Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

// Filter Types
export interface RecipeFilters {
  search?: string;
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  cookingTime?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
}

// Sort Types
export type SortOption = 'newest' | 'oldest' | 'title' | 'cookingTime' | 'popularity';

export interface SortConfig {
  field: SortOption;
  direction: 'asc' | 'desc';
}

// Image Types
export interface ImageUpload {
  uri: string;
  type: string;
  name: string;
  size: number;
}

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  THEME_PREFERENCE: 'themePreference',
  RECIPE_DRAFTS: 'recipeDrafts',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recentSearches',
} as const;

// Constants
export const RECIPE_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const COOKING_TIME_RANGES = [
  { label: 'Quick (< 30 min)', value: { min: 0, max: 30 } },
  { label: 'Medium (30-60 min)', value: { min: 30, max: 60 } },
  { label: 'Long (> 60 min)', value: { min: 60, max: 999 } },
] as const;

export const CUISINE_TYPES = [
  'Italian',
  'Mexican',
  'Chinese',
  'Indian',
  'Japanese',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Greek',
  'Spanish',
  'Korean',
  'Vietnamese',
  'Middle Eastern',
  'African',
  'Caribbean',
  'Other',
] as const;

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types
export interface RecipeEvent {
  type: 'created' | 'updated' | 'deleted' | 'favorited' | 'shared';
  recipeId: string;
  userId: string;
  timestamp: string;
  metadata?: any;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: string;
    payload: any;
  };
}
