const express = require('express');
const router = express.Router();
const { checkforAuth } = require('../MiddleWares/MiddleAuth');
const {
  commentOnDiscussion,
  getAllCommentsOnDiscussion,
  updateComment,
  deleteComment,
} = require('../Controllers/Comment_Controller');

router.post('/', checkforAuth, commentOnDiscussion); // Post a comment
router.get('/:discussionId', checkforAuth, getAllCommentsOnDiscussion); // Get all comments for a discussion
router.put('/update/:id', checkforAuth, updateComment); // Update a comment
router.delete('/delete/:id', checkforAuth, deleteComment); // Delete a comment

module.exports = router;