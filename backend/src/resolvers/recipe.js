const { Op } = require('sequelize');
const { User, Recipe } = require('../models');
const { requireAuth } = require('../middleware/auth');

const recipeResolvers = {
  Query: {
    recipe: async (parent, { id }) => {
      const recipe = await Recipe.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
          }
        ],
        where: { isPublic: true, isPublished: true }
      });
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      return recipe;
    },
    
    recipes: async (parent, { filter, sort, first = 10, after }) => {
      const where = { isPublic: true, isPublished: true };
      
      if (filter) {
        if (filter.search) {
          where[Op.or] = [
            { title: { [Op.iLike]: `%${filter.search}%` } },
            { description: { [Op.iLike]: `%${filter.search}%` } }
          ];
        }
        
        if (filter.cuisine) {
          where.cuisine = filter.cuisine;
        }
        
        if (filter.difficulty) {
          where.difficulty = filter.difficulty;
        }
        
        if (filter.minRating) {
          where.rating = { [Op.gte]: filter.minRating };
        }
        
        if (filter.maxPrepTime) {
          where.prepTime = { [Op.lte]: filter.maxPrepTime };
        }
        
        if (filter.maxCookTime) {
          where.cookTime = { [Op.lte]: filter.maxCookTime };
        }
        
        if (filter.authorId) {
          where.authorId = filter.authorId;
        }
      }
      
      const order = sort ? [[sort.field, sort.direction]] : [['createdAt', 'DESC']];
      
      const recipes = await Recipe.findAndCountAll({
        where,
        order,
        limit: first,
        offset: after ? parseInt(Buffer.from(after, 'base64').toString()) : 0,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
          }
        ]
      });
      
      const edges = recipes.rows.map((recipe, index) => ({
        node: recipe,
        cursor: Buffer.from((recipes.offset + index).toString()).toString('base64')
      }));
      
      const hasNextPage = recipes.offset + recipes.rows.length < recipes.count;
      const hasPreviousPage = recipes.offset > 0;
      
      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
        },
        totalCount: recipes.count
      };
    },
    
    searchRecipes: async (parent, { query, limit = 10, offset = 0 }) => {
      const recipes = await Recipe.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { tags: { [Op.overlap]: [query] } }
          ],
          isPublic: true,
          isPublished: true
        },
        limit,
        offset,
        order: [['rating', 'DESC']],
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
    
    popularRecipes: async (parent, { limit = 10 }) => {
      const recipes = await Recipe.findAll({
        where: { isPublic: true, isPublished: true },
        limit,
        order: [['rating', 'DESC'], ['viewCount', 'DESC']],
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
    
    recentRecipes: async (parent, { limit = 10 }) => {
      const recipes = await Recipe.findAll({
        where: { isPublic: true, isPublished: true },
        limit,
        order: [['createdAt', 'DESC']],
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
  },
  
  Mutation: {
    createRecipe: requireAuth(async (parent, { input }, context) => {
      const recipe = await Recipe.create({
        ...input,
        authorId: context.user.id
      });
      
      return recipe;
    }),
    
    updateRecipe: requireAuth(async (parent, { id, input }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      if (recipe.authorId !== context.user.id && context.user.role !== 'admin') {
        throw new Error('Not authorized to update this recipe');
      }
      
      await recipe.update(input);
      
      return recipe;
    }),
    
    deleteRecipe: requireAuth(async (parent, { id }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      if (recipe.authorId !== context.user.id && context.user.role !== 'admin') {
        throw new Error('Not authorized to delete this recipe');
      }
      
      await recipe.destroy();
      
      return true;
    }),
    
    publishRecipe: requireAuth(async (parent, { id }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      if (recipe.authorId !== context.user.id && context.user.role !== 'admin') {
        throw new Error('Not authorized to publish this recipe');
      }
      
      await recipe.update({ isPublished: true });
      
      return recipe;
    }),
    
    unpublishRecipe: requireAuth(async (parent, { id }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      if (recipe.authorId !== context.user.id && context.user.role !== 'admin') {
        throw new Error('Not authorized to unpublish this recipe');
      }
      
      await recipe.update({ isPublished: false });
      
      return recipe;
    }),
    
    favoriteRecipe: requireAuth(async (parent, { id }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      await context.user.addFavoriteRecipe(recipe);
      await recipe.increment('favoriteCount');
      
      return true;
    }),
    
    unfavoriteRecipe: requireAuth(async (parent, { id }, context) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      await context.user.removeFavoriteRecipe(recipe);
      await recipe.decrement('favoriteCount');
      
      return true;
    }),
    
    rateRecipe: requireAuth(async (parent, { id, rating }, context) => {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      // Update or create rating
      await context.user.addRatedRecipe(recipe, { through: { rating } });
      
      // Recalculate average rating
      const ratings = await recipe.getRatings();
      const totalRating = ratings.reduce((sum, user) => sum + user.UserRatings.rating, 0);
      const averageRating = totalRating / ratings.length;
      
      await recipe.update({
        rating: averageRating,
        ratingCount: ratings.length
      });
      
      return recipe;
    }),
    
    viewRecipe: async (parent, { id }, { user, req }) => {
      const recipe = await Recipe.findByPk(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      try {
        const { RecipeView } = require('../models');
        
        // Get IP address and user agent
        const ipAddress = req?.ip || req?.connection?.remoteAddress || 'unknown';
        const userAgent = req?.headers?.['user-agent'] || 'unknown';
        
        // Check if this view already exists (prevent duplicate views from same user/IP)
        const existingView = await RecipeView.findOne({
          where: {
            recipeId: id,
            viewerId: user?.id || null,
            ipAddress: ipAddress
          }
        });
        
        if (!existingView) {
          // Create new view record
          await RecipeView.create({
            recipeId: id,
            viewerId: user?.id || null,
            ipAddress: ipAddress,
            userAgent: userAgent
          });
          
          // Increment recipe view count
          await recipe.increment('viewCount');
        }
      } catch (error) {
        console.error('Error tracking recipe view:', error);
        // Still increment view count even if tracking fails
        await recipe.increment('viewCount');
      }
      
      return recipe;
    },
  },
  
  Recipe: {
    author: async (parent) => {
      const user = await User.findByPk(parent.authorId, {
        attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
      });
      
      return user;
    },
  },
};

module.exports = recipeResolvers;
