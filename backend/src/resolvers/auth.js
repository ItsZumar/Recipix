const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const { requireAuth } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const authResolvers = {
  Query: {
    me: requireAuth(async (parent, args, context) => {
      return context.user;
    }),
  },
  Mutation: {
    register: async (parent, { input }) => {
      const { username, email, password, firstName, lastName } = input;
      
      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });
      
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }
      
      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName
      });
      
      const token = generateToken(user);
      
      return {
        token,
        user: user.toPublicJSON()
      };
    },
    
    login: async (parent, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check password
      const isValidPassword = await user.comparePassword(password);
      
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }
      
      const token = generateToken(user);
      
      return {
        token,
        user: user.toPublicJSON()
      };
    },
    
    changePassword: requireAuth(async (parent, { currentPassword, newPassword }, context) => {
      const user = context.user;
      
      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      await user.update({ password: newPassword });
      
      return true;
    }),
  },
};

module.exports = authResolvers;
