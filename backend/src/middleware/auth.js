const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const requireAuth = (resolver) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }
    return resolver(parent, args, context, info);
  };
};

const requireRole = (role) => {
  return (resolver) => {
    return (parent, args, context, info) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      if (context.user.role !== role && context.user.role !== 'admin') {
        throw new Error('Insufficient permissions');
      }
      
      return resolver(parent, args, context, info);
    };
  };
};

module.exports = {
  authenticateToken,
  requireAuth,
  requireRole
};
