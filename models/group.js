const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Define the ChatMessage model
const group = sequelize.define('group', {
  groupId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,  
},
});

// Export the ChatMessage model
module.exports = group;
