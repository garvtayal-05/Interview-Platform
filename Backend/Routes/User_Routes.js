const express = require('express');
const router = express.Router();
const { User_SignUp, User_Login } = require('../Controllers/User_Controller');

router.post('/signup',User_SignUp);
router.post('/login',User_Login);



module.exports = router
