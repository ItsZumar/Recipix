const { User, Follow } = require('../models');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const followResolvers = {
  Query: {
    userFollowers: async (_, { userId, limit = 20, offset = 0 }, { user }) => {
      try {
        const targetUser = await User.findByPk(userId);
        if (!targetUser) {
          throw new UserInputError('User not found');
        }

        const followers = await targetUser.getFollowers({
          limit,
          offset,
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'bio']
        });

        return followers;
      } catch (error) {
        throw new Error(`Failed to fetch followers: ${error.message}`);
      }
    },

    userFollowing: async (_, { userId, limit = 20, offset = 0 }, { user }) => {
      try {
        const targetUser = await User.findByPk(userId);
        if (!targetUser) {
          throw new UserInputError('User not found');
        }

        const following = await targetUser.getFollowing({
          limit,
          offset,
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'bio']
        });

        return following;
      } catch (error) {
        throw new Error(`Failed to fetch following: ${error.message}`);
      }
    }
  },

  Mutation: {
    followUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to follow users');
      }

      if (user.id === userId) {
        throw new UserInputError('You cannot follow yourself');
      }

      try {
        const targetUser = await User.findByPk(userId);
        if (!targetUser) {
          throw new UserInputError('User not found');
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
          where: {
            followerId: user.id,
            followingId: userId
          }
        });

        if (existingFollow) {
          throw new UserInputError('You are already following this user');
        }

        // Create follow relationship
        await Follow.create({
          followerId: user.id,
          followingId: userId
        });

        return true;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error(`Failed to follow user: ${error.message}`);
      }
    },

    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You must be logged in to unfollow users');
      }

      if (user.id === userId) {
        throw new UserInputError('You cannot unfollow yourself');
      }

      try {
        const targetUser = await User.findByPk(userId);
        if (!targetUser) {
          throw new UserInputError('User not found');
        }

        // Check if following
        const existingFollow = await Follow.findOne({
          where: {
            followerId: user.id,
            followingId: userId
          }
        });

        if (!existingFollow) {
          throw new UserInputError('You are not following this user');
        }

        // Remove follow relationship
        await existingFollow.destroy();

        return true;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error(`Failed to unfollow user: ${error.message}`);
      }
    }
  },

  User: {
    followersCount: async (parent) => {
      try {
        const count = await parent.countFollowers();
        return count;
      } catch (error) {
        return 0;
      }
    },

    followingCount: async (parent) => {
      try {
        const count = await parent.countFollowing();
        return count;
      } catch (error) {
        return 0;
      }
    },

    isFollowing: async (parent, _, { user }) => {
      if (!user) return false;
      
      try {
        const follow = await Follow.findOne({
          where: {
            followerId: user.id,
            followingId: parent.id
          }
        });
        return !!follow;
      } catch (error) {
        return false;
      }
    },

    totalRecipeViews: async (parent) => {
      try {
        const { RecipeView } = require('../models');
        const { Op } = require('sequelize');
        
        const totalViews = await RecipeView.sum('id', {
          include: [{
            model: require('../models').Recipe,
            as: 'recipe',
            where: {
              authorId: parent.id
            }
          }]
        });

        return totalViews || 0;
      } catch (error) {
        return 0;
      }
    }
  }
};

module.exports = followResolvers;
