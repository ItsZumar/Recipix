const User = require('./User');
const Recipe = require('./Recipe');
const Follow = require('./Follow');
const RecipeView = require('./RecipeView');

// Define associations
User.hasMany(Recipe, { as: 'recipes', foreignKey: 'authorId' });
Recipe.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

// User favorites recipes (many-to-many)
User.belongsToMany(Recipe, { 
  through: 'UserFavorites',
  as: 'favoriteRecipes',
  foreignKey: 'userId',
  otherKey: 'recipeId'
});
Recipe.belongsToMany(User, { 
  through: 'UserFavorites',
  as: 'favoritedBy',
  foreignKey: 'recipeId',
  otherKey: 'userId'
});

// User ratings (many-to-many with additional data)
User.belongsToMany(Recipe, { 
  through: 'UserRatings',
  as: 'ratedRecipes',
  foreignKey: 'userId',
  otherKey: 'recipeId'
});
Recipe.belongsToMany(User, { 
  through: 'UserRatings',
  as: 'ratings',
  foreignKey: 'recipeId',
  otherKey: 'userId'
});

// User following relationships
User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

// Recipe views
Recipe.hasMany(RecipeView, { as: 'views', foreignKey: 'recipeId' });
RecipeView.belongsTo(Recipe, { as: 'recipe', foreignKey: 'recipeId' });
RecipeView.belongsTo(User, { as: 'viewer', foreignKey: 'viewerId' });

module.exports = {
  User,
  Recipe,
  Follow,
  RecipeView
};
