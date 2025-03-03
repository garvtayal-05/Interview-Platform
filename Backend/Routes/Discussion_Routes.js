const express = require('express');
const router = express.Router();
const { createDiscussion, getAllDiscussions, getDiscussion, updateDiscussion, deleteDiscussion } = require('../Controllers/Discussion_Controller');
const { checkforAuth } = require('../MiddleWares/MiddleAuth');


router.get('/', checkforAuth, getAllDiscussions)
router.post('/create', checkforAuth, createDiscussion)
router.get('/:id', checkforAuth, getDiscussion)
router.put('/edit/:id', checkforAuth, updateDiscussion);
router.delete('/delete/:id', checkforAuth, deleteDiscussion);


module.exports = router;