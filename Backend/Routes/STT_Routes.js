const express = require('express');
const { checkforAuth } = require('../MiddleWares/MiddleAuth');
const { analyzeSpeech, generateFinalEvaluation, generateTopicQuestions, generateResumeQuestions, getUserPerformance } = require('../Controllers/STT_Controller');
const router = express.Router();
const upload = require('../Controllers/User_Controller').upload;

// Speech analysis routes
router.post('/', checkforAuth, analyzeSpeech);
router.post('/final-evaluation', checkforAuth, generateFinalEvaluation);

// Question generation routes
router.post('/generate-topic-questions', checkforAuth, generateTopicQuestions);
router.post('/generate-resume-questions', checkforAuth, upload.single('resume'), generateResumeQuestions);

router.get('/getUserPerformance/:userId', checkforAuth, getUserPerformance )

module.exports = router;