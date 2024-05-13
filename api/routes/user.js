const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/check-auth');
const UserController = require("../controllers/user")

//User Signup
router.post('/signup', UserController.user_signup);

//User Login
router.post('/login', UserController.user_login);

// Problem: Any user can delete any other, if they know the ID
// TODO: create like an admin role for this
router.delete('/:userId', checkToken, UserController.user_delete);

module.exports = router;