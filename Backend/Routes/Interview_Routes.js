const express = require("express");
const router = express.Router();
const interviewController = require("../Controllers/Interview_Controller");
const upload = require("../MiddleWares/Multer");
const { checkforAuth, restrictTo } = require('../MiddleWares/MiddleAuth');

// Candidate endpoints
router.post("/text", checkforAuth, interviewController.submitTextInterview);
router.post("/video", checkforAuth, upload.array("videos"), interviewController.submitVideoInterview);
router.get("/my-interviews", checkforAuth, interviewController.getUserInterviews);

// Interviewer/Admin endpoints
// router.get("/evaluate", checkforAuth, interviewController.getInterviewsForEvaluation);
router.get('/all', checkforAuth, restrictTo(['admin']), interviewController.getAllInterviews);
router.get('/:interviewId', checkforAuth, interviewController.getInterviewDetails);
router.put('/evaluate/:interviewId', checkforAuth, restrictTo(['admin']), interviewController.evaluateInterview);

module.exports = router;