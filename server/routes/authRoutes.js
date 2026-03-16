const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');


//Register a new user
router.post('/register',authController.registerUser);

// //Login a user
 router.post('/login',authController.loginUser);

// //verify OTP
 router.post('/verify-otp',authController.verifyOTP);
module.exports = router;