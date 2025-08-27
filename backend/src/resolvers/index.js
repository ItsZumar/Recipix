const authResolvers = require('./auth');
const userResolvers = require('./user');
const recipeResolvers = require('./recipe');
const followResolvers = require('./follow');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...recipeResolvers.Query,
    ...followResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...recipeResolvers.Mutation,
    ...followResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
    ...followResolvers.User,
  },
  Recipe: recipeResolvers.Recipe,
};

module.exports = resolvers;
