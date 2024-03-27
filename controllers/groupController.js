const Group = require('../models/group');
const GroupMember = require('../models/groupMembers');
const User = require('../models/user');
const path =require('path');

exports.CreateGroup = async (req, res, next) => {
  const { groupName, members } = req.body; // Assuming members is an array of phone numbers

  console.log("inside the create Group function....groupName:", groupName);
  console.log("inside the create Group function....members:", members);

  try {
    // Create group
    const createdGroup = await Group.create({
      groupName: groupName
    });

    if (!createdGroup) {
      return res.status(404).send("Error creating group, Please try again after some time...");
    }

    // Add members to the group
    if (members && members.length > 0) {
      const userIds = await Promise.all(members.map(async (phoneNumber) => {
        const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
        return user ? user.id : null;
      }));

      const groupMembers = userIds.filter(userId => userId !== null).map(userId => ({
        userId: userId,
        groupId: createdGroup.groupId,
      }));

      await GroupMember.bulkCreate(groupMembers);
    }

    // Return success response
    return res.status(200).send("Group created successfully");
  } catch (err) {
    console.error("Error creating group:", err);
    return res.status(500).send("Internal Server Error");
  }
};


 // to  get the Create Group form
 exports.getCreateGroupForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', '/createGroup.html'));
};


//to get the groupDetails
exports.getGroupDetails = async (req, res) => {
  try {
    const userId = req.user.id;


    console.log("inside get group details: user Id...:", userId);

    // Find all group memberships for the user
    const userMemberships = await GroupMember.findAll({ where: { userId: userId } });

    // Extract groupIds from userMemberships
    const groupIds = userMemberships.map(membership => membership.groupId);

    // Find group details using the groupIds
    const groupDetails = await Group.findAll({ where: { groupId: groupIds } });

    res.status(200).json({ groupDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};



// to get the chat page
exports.getChatMessagePage = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', '/chat.html'));
};


//to get the add members to the group form
exports.getAddMembers = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', '/addMembers.html'));
};


// to add members to the already created group
exports.postAddMembers = async (req, res, next) => {
  const { members } = req.body;
  const { groupId } = req.query;

  console.log("Inside the add members function...");
  console.log("Members...", members);
  console.log("groupId...", groupId);

  try {
    // Get the current members of the group
    const currentMembers = await GroupMember.findAll({ where: { groupId: groupId } });
    const currentMemberIds = currentMembers.map(member => member.userId);

    // Add new members to the group
    if (members && members.length > 0) {
      const userIdsToAdd = [];
      for (const phoneNumber of members) {
        // Check if the user with the phone number exists
        const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
        if (user && !currentMemberIds.includes(user.id)) {
          userIdsToAdd.push(user.id);
        }
      }

      // Create group members for new users
      const groupMembers = userIdsToAdd.map(userId => ({
        userId: userId,
        groupId: groupId,
      }));

      await GroupMember.bulkCreate(groupMembers);
    }

    // Return success response
    return res.status(200).send("Members added to the group successfully");
  } catch (err) {
    console.error("Error adding members to the group:", err);
    return res.status(500).send("Internal Server Error");
  }
};
