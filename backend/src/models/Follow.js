const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['followerId', 'followingId']
    },
    {
      fields: ['followerId']
    },
    {
      fields: ['followingId']
    }
  ]
});

module.exports = Follow;
