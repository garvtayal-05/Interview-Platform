const express = require('express');
const { CreateJobProfile, GetAllJobProfiles, generateQuestions, GetJobProfile, GetJobsCreatedByUser } = require('../Controllers/JobProfile_Controller');
const { checkforAuth, restrictTo } = require('../MiddleWares/MiddleAuth');
const router = express.Router();

router.post('/create', checkforAuth, restrictTo(['admin']), CreateJobProfile);
router.get('/fetch', checkforAuth, GetAllJobProfiles);
router.get('/fetch/:_id', checkforAuth, GetJobProfile);
router.get('/fetch/:jobrole/generate-questions', checkforAuth, generateQuestions);
router.get('/', checkforAuth, GetJobsCreatedByUser),

 
module.exports = router