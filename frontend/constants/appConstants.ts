// App-wide constants and static data

// ============================================================================
// RECIPE CATEGORIES
// ============================================================================
export const RECIPE_CATEGORIES = [
  { id: "Italian", title: "Italian", icon: "pizza" as const },
  { id: "American", title: "American", icon: "restaurant" as const },
  { id: "Indian", title: "Indian", icon: "flame" as const },
  { id: "Mexican", title: "Mexican", icon: "restaurant" as const },
  { id: "Chinese", title: "Chinese", icon: "restaurant" as const },
  { id: "Japanese", title: "Japanese", icon: "fish" as const },
  { id: "Thai", title: "Thai", icon: "leaf" as const },
  { id: "Mediterranean", title: "Mediterranean", icon: "sunny" as const },
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number]["id"];

// ============================================================================
// RECIPE SORT OPTIONS
// ============================================================================
export const RECIPE_SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: "time" as const },
  { id: "oldest", label: "Oldest First", icon: "time-outline" as const },
  { id: "title", label: "A-Z", icon: "text" as const },
  { id: "cookTime", label: "Cook Time", icon: "timer" as const },
  { id: "difficulty", label: "Difficulty", icon: "bar-chart" as const },
] as const;

export type SortOption = (typeof RECIPE_SORT_OPTIONS)[number]["id"];

// ============================================================================
// RECIPE FILTER OPTIONS
// ============================================================================
export const RECIPE_FILTER_OPTIONS = [
  { id: "all", label: "All Recipes", icon: "grid" as const },
  { id: "my", label: "My Recipes", icon: "person" as const },
  { id: "easy", label: "Easy", icon: "leaf" as const },
  { id: "medium", label: "Medium", icon: "flame" as const },
  { id: "hard", label: "Hard", icon: "trophy" as const },
] as const;

export type FilterOption = (typeof RECIPE_FILTER_OPTIONS)[number]["id"];

// ============================================================================
// RECIPE DIFFICULTY LEVELS
// ============================================================================
export const RECIPE_DIFFICULTY_LEVELS = [
  { id: "easy", label: "Easy", icon: "leaf" as const, color: "#4CAF50" },
  { id: "medium", label: "Medium", icon: "flame" as const, color: "#FF9800" },
  { id: "hard", label: "Hard", icon: "trophy" as const, color: "#F44336" },
] as const;

export type DifficultyLevel = (typeof RECIPE_DIFFICULTY_LEVELS)[number]["id"];

// ============================================================================
// CUISINE OPTIONS
// ============================================================================
export const CUISINE_OPTIONS = [
  "Afghan",
  "Albanian",
  "American",
  "Argentine",
  "Australian",
  "Austrian",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bulgarian",
  "Canadian",
  "Caribbean",
  "Cambodian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Croatian",
  "Cuban",
  "Czech",
  "Danish",
  "Dominican",
  "Dutch",
  "Egyptian",
  "Emirati",
  "Estonian",
  "Ethiopian",
  "Filipino",
  "Finnish",
  "Fijian",
  "French",
  "Fusion",
  "German",
  "Gluten-Free",
  "Greek",
  "Haitian",
  "Hawaiian",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Keto",
  "Korean",
  "Kosovar",
  "Kuwaiti",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malaysian",
  "Mediterranean",
  "Mexican",
  "Moldovan",
  "Montenegrin",
  "Moroccan",
  "Myanmar",
  "New Zealand",
  "Nigerian",
  "Norwegian",
  "Omani",
  "Other",
  "Pakistani",
  "Palestinian",
  "Paleo",
  "Peruvian",
  "Polish",
  "Puerto Rican",
  "Qatari",
  "Raw",
  "Romanian",
  "Russian",
  "Saudi Arabian",
  "Scottish",
  "Serbian",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "South African",
  "Spanish",
  "Sri Lankan",
  "Swedish",
  "Swiss",
  "Syrian",
  "Thai",
  "Trinidadian",
  "Turkish",
  "Ukrainian",
  "Vegan",
  "Vegetarian",
  "Venezuelan",
  "Vietnamese",
  "Welsh",
  "Yemeni"
] as const;

export type CuisineOption = (typeof CUISINE_OPTIONS)[number];

// ============================================================================
// PROFILE STATISTICS
// ============================================================================
export const PROFILE_STAT_TYPES = [
  { id: "recipes", label: "Recipes Created", icon: "restaurant" as const },
  { id: "favorites", label: "Favorite Recipes", icon: "heart" as const },
  { id: "views", label: "Recipe Views", icon: "eye" as const },
  { id: "followers", label: "Followers", icon: "people" as const },
] as const;

export type ProfileStatType = (typeof PROFILE_STAT_TYPES)[number]["id"];

// ============================================================================
// SETTINGS SECTIONS
// ============================================================================
export const SETTINGS_SECTIONS = {
  PREFERENCES: "preferences",
  ACCOUNT: "account",
  SUPPORT: "support",
} as const;

export const SETTINGS_ITEMS = {
  // Preferences
  NOTIFICATIONS: {
    id: "notifications",
    icon: "notifications-outline" as const,
    title: "Push Notifications",
    subtitle: "Receive notifications for new recipes",
    type: "switch" as const,
  },
  DARK_MODE: {
    id: "darkmode",
    icon: "moon-outline" as const,
    title: "Dark Mode",
    subtitle: "Switch to dark theme",
    type: "switch" as const,
  },
  EMAIL_UPDATES: {
    id: "email",
    icon: "mail-outline" as const,
    title: "Email Updates",
    subtitle: "Receive recipe updates via email",
    type: "switch" as const,
  },

  // Account
  EDIT_PROFILE: {
    id: "profile",
    icon: "person-outline" as const,
    title: "Edit Profile",
    subtitle: "Update your profile information",
    type: "button" as const,
  },
  CHANGE_PASSWORD: {
    id: "password",
    icon: "lock-closed-outline" as const,
    title: "Change Password",
    subtitle: "Update your password",
    type: "button" as const,
  },
  PRIVACY_SETTINGS: {
    id: "privacy",
    icon: "shield-outline" as const,
    title: "Privacy Settings",
    subtitle: "Manage your privacy preferences",
    type: "button" as const,
  },

  // Support
  HELP_SUPPORT: {
    id: "help",
    icon: "help-circle-outline" as const,
    title: "Help & Support",
    subtitle: "Get help and contact support",
    type: "button" as const,
  },
  SEND_FEEDBACK: {
    id: "feedback",
    icon: "chatbubble-outline" as const,
    title: "Send Feedback",
    subtitle: "Help us improve the app",
    type: "button" as const,
  },
  ABOUT: {
    id: "about",
    icon: "information-circle-outline" as const,
    title: "About",
    subtitle: "App version and information",
    type: "button" as const,
  },
} as const;

// ============================================================================
// QUICK ACTIONS
// ============================================================================
export const QUICK_ACTIONS = [
  {
    id: "create-recipe",
    icon: "add-circle-outline" as const,
    title: "Create New Recipe",
    subtitle: "Share your culinary creation",
    route: "/create-recipe",
  },
  {
    id: "my-recipes",
    icon: "restaurant-outline" as const,
    title: "My Recipes",
    subtitle: "View and manage your recipes",
    route: "/recipes?filter=my",
  },
  {
    id: "favorites",
    icon: "heart-outline" as const,
    title: "Favorite Recipes",
    subtitle: "Your saved recipes",
    route: "/favorites",
  },
] as const;

// ============================================================================
// APP CONFIGURATION
// ============================================================================
export const APP_CONFIG = {
  NAME: "Recipix",
  VERSION: "1.0.0",
  DESCRIPTION: "Your personal recipe companion",
  DEFAULT_RECIPE_LIMIT: 10,
  SEARCH_RECIPE_LIMIT: 20,
  RECIPES_SCREEN_LIMIT: 50,
  IMAGE_QUALITY: 0.8,
  IMAGE_ASPECT_RATIO: [16, 9] as [number, number],
  PROFILE_IMAGE_ASPECT_RATIO: [1, 1] as [number, number],
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_\s]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  RECIPE_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  RECIPE_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  USER_BIO: {
    MAX_LENGTH: 500,
  },
  USER_NAME: {
    MAX_LENGTH: 50,
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================
export const ERROR_MESSAGES = {
  PERMISSION_DENIED: "Sorry, we need camera roll permissions to make this work!",
  CAMERA_PERMISSION_DENIED: "Sorry, we need camera permissions to make this work!",
  IMAGE_PICK_ERROR: "Failed to pick image. Please try again.",
  PHOTO_ERROR: "Failed to take photo. Please try again.",
  FAVORITE_ERROR: "Failed to update favorite status",
  RECIPE_CREATE_ERROR: "Failed to create recipe. Please try again.",
  RECIPE_UPDATE_ERROR: "Failed to update recipe. Please try again.",
  RECIPE_DELETE_ERROR: "Failed to delete recipe. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================
export const SUCCESS_MESSAGES = {
  RECIPE_CREATED: "Your recipe has been created successfully!",
  RECIPE_UPDATED: "Recipe updated successfully!",
  RECIPE_DELETED: "Recipe deleted successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  FAVORITE_ADDED: "Recipe added to favorites!",
  FAVORITE_REMOVED: "Recipe removed from favorites!",
  PROFILE_PICTURE_UPDATED: "Profile picture updated!",
} as const;

// ============================================================================
// PLACEHOLDER TEXTS
// ============================================================================
export const PLACEHOLDER_TEXTS = {
  SEARCH_RECIPES: "Search for recipes or cuisines...",
  SEARCH_MY_RECIPES: "Search your recipes...",
  RECIPE_TITLE: "Enter recipe title",
  RECIPE_DESCRIPTION: "Describe your recipe",
  INGREDIENT: "Ingredient",
  INSTRUCTION: "Step",
  TAG: "Tag",
  CUISINE: "e.g., Italian, Asian, Mexican",
  IMAGE_URL: "https://example.com/image.jpg",
  USERNAME: "Enter username",
  EMAIL: "Enter email",
  PASSWORD: "Enter password",
  BIO: "Tell us about yourself...",
} as const;

// ============================================================================
// EMPTY STATE MESSAGES
// ============================================================================
export const EMPTY_STATE_MESSAGES = {
  NO_FAVORITES: {
    title: "No Favorite Recipes Yet",
    subtitle: "Start exploring recipes and add them to your favorites!",
    action: "Explore Recipes",
  },
  NO_MY_RECIPES: {
    title: "No recipes created yet",
    subtitle: "Start creating your first recipe!",
    action: "Create Recipe",
  },
  NO_RECIPES: {
    title: "No recipes available",
    subtitle: "Be the first to create a recipe!",
    action: "Create Recipe",
  },
  NO_SEARCH_RESULTS: {
    title: "No recipes found",
    subtitle: "Try different keywords or check your spelling",
    action: null,
  },
} as const;

// ============================================================================
// LOADING MESSAGES
// ============================================================================
export const LOADING_MESSAGES = {
  LOADING_RECIPES: "Loading recipes...",
  LOADING_FAVORITES: "Loading your favorite recipes...",
  CREATING_RECIPE: "Creating Recipe...",
  UPDATING_RECIPE: "Updating Recipe...",
  DELETING_RECIPE: "Deleting Recipe...",
  UPLOADING_IMAGE: "Uploading image...",
} as const;
