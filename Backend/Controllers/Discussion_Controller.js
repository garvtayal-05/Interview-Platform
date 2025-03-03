const Discussion = require('../models/Discussion_Model');

async function createDiscussion(req, res) {
  const { title, content } = req.body;

  // Extract the author ID from the authenticated user
  const author = req.user._id; 
  console.log(author)

  try {
    const discussion = new Discussion({ title, content, author });
    await discussion.save();
    await discussion.populate('author', 'name');

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllDiscussions(req, res) {
  const discussions = await Discussion.find().populate("author", "name");
  res.json(discussions);
}

async function getDiscussion(req, res) {
  const discussion = await Discussion.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!discussion)
    return res.status(404).json({ message: "Discussion not found" });
  res.json(discussion);
}

async function updateDiscussion(req, res) {
  const { title, content } = req.body;
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion)
    return res.status(404).json({ message: "Discussion not found" });
  if (discussion.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  discussion.title = title;
  discussion.content = content;
  discussion.updatedAt = Date.now();
  await discussion.save();
  res.json(discussion);
}

async function deleteDiscussion(req, res) {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion)
    return res.status(404).json({ message: "Discussion not found" });
  if (discussion.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await discussion.remove();
  res.json({ message: "Discussion deleted" });
}

module.exports = {
  createDiscussion,
  getAllDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
};
