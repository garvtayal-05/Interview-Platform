const Comment = require('../models/Comment_Model');

async function commentOnDiscussion(req, res) {
  const { content, discussionId } = req.body;
  const author = req.user._id; // Get the authenticated user's ID

  try {
    const comment = new Comment({ content, author, discussion: discussionId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllCommentsOnDiscussion(req, res) {
    const comments = await Comment.find({
      discussion: req.params.discussionId,
    }).populate("author", "username");
    res.json(comments);
  }

async function updateComment(req, res) {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  comment.content = content;
  comment.updatedAt = Date.now();
  await comment.save();
  res.json(comment);
}

async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await comment.remove();
  res.json({ message: "Comment deleted" });
}

module.exports = {
  commentOnDiscussion,
  getAllCommentsOnDiscussion,
  updateComment,
  deleteComment,
};
