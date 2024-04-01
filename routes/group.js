const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticateMiddleware = require('../middleware/auth');

// api to handle creation of user details
router.post('/createGroup', authenticateMiddleware.authenticateToken, groupController.CreateGroup);

router.get('/createGroupForm', groupController.getCreateGroupForm);

router.get('/user/groups',authenticateMiddleware.authenticateToken, groupController.getGroupDetails);

router.get('/getChatMessages/:groupId?', groupController.getChatMessagePage);

router.get('/addmembers/:groupId?', groupController.getAddMembers);

router.get('/removemembers/:groupId?', groupController.getRemoveMembersPage);

router.post('/addmembers', groupController.postAddMembers);

router.post('/removeMembers', groupController.deleteGroupMembers);

module.exports = router;
