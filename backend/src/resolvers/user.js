const { Op } = require('sequelize');
const { User, Recipe } = require('../models');
const { requireAuth } = require('../middleware/auth');

const userResolvers = {
  Query: {
    user: async (parent, { id }) => {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Recipe,
            as: 'recipes',
            where: { isPublic: true, isPublished: true },
            required: false
          }
        ]
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user.toPublicJSON();
    },
    
    users: async (parent, { limit = 10, offset = 0 }) => {
      const users = await User.findAll({
        limit,
        offset,
        attributes: { exclude: ['password'] }
      });
      
      return users;
    },
    
    searchUsers: async (parent, { query, limit = 10, offset = 0 }) => {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: `%${query}%` } },
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit,
        offset,
        attributes: { exclude: ['password'] }
      });
      
      return users;
    },
  },
  
  Mutation: {
    updateProfile: requireAuth(async (parent, { input }, context) => {
      const user = context.user;
      
      await user.update(input);
      
      return user.toPublicJSON();
    }),
  },
  
  User: {
    recipes: async (parent, args, context) => {
      const recipes = await Recipe.findAll({
        where: {
          authorId: parent.id,
          isPublic: true,
          isPublished: true
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
          }
        ]
      });
      
      return recipes;
    },
    
    favoriteRecipes: async (parent, args, context) => {
      const user = await User.findByPk(parent.id, {
        include: [
          {
            model: Recipe,
            as: 'favoriteRecipes',
            where: { isPublic: true, isPublished: true },
            required: false,
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
              }
            ]
          }
        ]
      });
      
      return user.favoriteRecipes || [];
    },
  },
};

module.exports = userResolvers;
