const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Define the ChatMessage model
const groupMembers = sequelize.define('groupMembers', {
    userId: {
        type: Sequelize.INTEGER
      }, 
    groupId: {
    type: Sequelize.INTEGER
  }
});

// Export the ChatMessage model
module.exports = groupMembers;
