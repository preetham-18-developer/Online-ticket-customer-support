const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route:  POST /api/auth/register
// Desc:   Register a new user
router.post('/register', authController.register);

// Route:  POST /api/auth/login
// Desc:   Authenticate user & get token
router.post('/login', authController.login);

// Route:  GET /api/auth/me
// Desc:   Get current logged in user details
// Route:  POST /api/auth/forgot-password
// Desc:   Send OTP to user's email for password reset
router.post('/forgot-password', authController.forgotPassword);

// Route:  POST /api/auth/verify-otp
// Desc:   Verify the OTP sent to email
router.post('/verify-otp', authController.verifyOtp);

// Route:  POST /api/auth/reset-password
// Desc:   Reset the password using OTP
router.post('/reset-password', authController.resetPassword);

module.exports = router;
