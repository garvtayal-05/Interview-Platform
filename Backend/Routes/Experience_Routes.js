const express = require('express');
const { CreateExperience, Get_All_Experiences, Get_User_Experiences, Update_Experience, Delete_Experience, upvoteExperience, downvoteExperience } = require('../Controllers/Experience_Controller');
const { checkforAuth } = require('../MiddleWares/MiddleAuth');
const router = express.Router();



router.post('/add-experience',checkforAuth, CreateExperience);
router.get('/get-experience', Get_All_Experiences);
router.get('/get_user_experiences',checkforAuth, Get_User_Experiences);
router.patch('/Update_Experience/:id',checkforAuth, Update_Experience);
router.delete('/Delete_Experience/:id',checkforAuth, Delete_Experience);

router.patch("/upvote/:id", checkforAuth, upvoteExperience);
router.patch("/downvote/:id", checkforAuth, downvoteExperience);


module.exports = router
