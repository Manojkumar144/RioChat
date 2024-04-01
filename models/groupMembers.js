const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Define the ChatMessage model
const groupMembers = sequelize.define('groupMembers', {
    userId: {
        type: Sequelize.INTEGER
      }, 
    groupId: {
    type: Sequelize.INTEGER
  }, 
isAdmin: {
  type: Sequelize.BOOLEAN,
  defaultValue: false 
}
});

// Export the ChatMessage model
module.exports = groupMembers;
