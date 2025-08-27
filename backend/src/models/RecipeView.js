const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const RecipeView = sequelize.define('RecipeView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recipeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Recipes',
      key: 'id'
    }
  },
  viewerId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow anonymous views
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  viewedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      fields: ['recipeId']
    },
    {
      fields: ['viewerId']
    },
    {
      fields: ['viewedAt']
    },
    {
      unique: true,
      fields: ['recipeId', 'viewerId', 'ipAddress']
    }
  ]
});

module.exports = RecipeView;
