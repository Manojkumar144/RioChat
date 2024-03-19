const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Define the ChatMessage model
const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,  
},
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Export the ChatMessage model
module.exports = ChatMessage;
