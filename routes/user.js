const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// api to handle creation of user details
router.post('/signUp', userController.postAddUser);

//api to handle the login form
router.post('/dashboard',userController.postLoginUser);

//api to fetch the userDetails
router.get('/groupchat',userController.getUserDetails);

router.get('/chat',userController.getChat);


module.exports = router;
