const express = require('express');
const { CreateJobProfile, GetAllJobProfiles, generateQuestions } = require('../Controllers/JobProfile_Controller');
const { checkforAuth, restrictTo } = require('../MiddleWares/MiddleAuth');
const router = express.Router();

router.post('/create', checkforAuth, restrictTo(['admin']), CreateJobProfile);
router.get('/fetch', checkforAuth, GetAllJobProfiles);
router.get('/fetch/:jobrole/generate-questions', checkforAuth, generateQuestions);

 
module.exports = router