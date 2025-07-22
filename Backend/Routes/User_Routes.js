const express = require('express');
const router = express.Router();
const { User_SignUp, User_Login, User_PasswordReset, User_ForgotPassword, User_CreateProfile, User_ApplyJob, User_AppliedJobs, getJobApplications, Google_Login, verify_token } = require('../Controllers/User_Controller');
const { checkforAuth, restrictTo} = require('../MiddleWares/MiddleAuth');
require('../Controllers/User_Controller');
const upload = require('../Controllers/User_Controller').upload;

router.post('/signup',User_SignUp);
router.post('/login',User_Login);
router.post('/google-login', Google_Login);
router.post('/reset-password', User_PasswordReset)
router.post('/forgot-password', User_ForgotPassword)
router.post('/verify-token', verify_token)
router.post('/create-profile', checkforAuth,  upload.single('file'), User_CreateProfile);
router.post('/apply-job/:_id', checkforAuth, User_ApplyJob);
router.get('/applied-jobs', checkforAuth, User_AppliedJobs);
router.get('/applications', checkforAuth, restrictTo(['admin']), getJobApplications);


module.exports = router
