const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// api to handle creation of user details
router.post('/signUp', userController.postAddUser);

module.exports = router;
