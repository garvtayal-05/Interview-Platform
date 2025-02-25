const express = require('express');
const router = express.Router();
const { User_SignUp, User_Login, User_PasswordReset, User_ForgotPassword } = require('../Controllers/User_Controller');

router.post('/signup',User_SignUp);
router.post('/login',User_Login);
router.post('/reset-password', User_PasswordReset)
router.post('/forgot-password', User_ForgotPassword)



module.exports = router
