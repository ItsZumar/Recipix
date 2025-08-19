const authResolvers = require('./auth');
const userResolvers = require('./user');
const recipeResolvers = require('./recipe');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...recipeResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...recipeResolvers.Mutation,
  },
  User: userResolvers.User,
  Recipe: recipeResolvers.Recipe,
};

module.exports = resolvers;
