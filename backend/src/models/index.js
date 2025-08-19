const User = require('./User');
const Recipe = require('./Recipe');

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

module.exports = {
  User,
  Recipe
};
