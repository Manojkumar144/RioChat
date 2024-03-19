const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateMiddleware = require('../middleware/auth');

// api to handle creation of user details
router.post('/signUp', userController.postAddUser);

//api to handle the login form
router.post('/dashboard',userController.postLoginUser);

//api to fetch the userDetails
router.get('/groupchat',userController.getUserDetails);

router.get('/chat', userController.getChat);

//api to store the chat message in the database
router.post('/chat',authenticateMiddleware.authenticateToken,userController.postChatMessage);

//api to get the chat messages of the user 
router.get('/chatmessage', userController.getChatMessages);

module.exports = router;
