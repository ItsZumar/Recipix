-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSONB operators
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create UserFavorites table for many-to-many relationship
CREATE TABLE IF NOT EXISTS "UserFavorites" (
  "userId" UUID NOT NULL,
  "recipeId" UUID NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId", "recipeId"),
  FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE CASCADE
);

-- Create UserRatings table for many-to-many relationship with rating data
CREATE TABLE IF NOT EXISTS "UserRatings" (
  "userId" UUID NOT NULL,
  "recipeId" UUID NOT NULL,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "review" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId", "recipeId"),
  FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_favorites_user_id" ON "UserFavorites"("userId");
CREATE INDEX IF NOT EXISTS "idx_user_favorites_recipe_id" ON "UserFavorites"("recipeId");
CREATE INDEX IF NOT EXISTS "idx_user_ratings_user_id" ON "UserRatings"("userId");
CREATE INDEX IF NOT EXISTS "idx_user_ratings_recipe_id" ON "UserRatings"("recipeId");
