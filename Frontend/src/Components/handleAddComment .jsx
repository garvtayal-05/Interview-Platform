const [commentContent, setCommentContent] = useState('');

const handleAddComment = async (discussionId) => {
  try {
    const response = await fetch('http://localhost:1564/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: commentContent, discussionId }),
    });
    const data = await response.json();
    if (response.ok) {
      setCommentContent('');
      fetchComments(discussionId); // Refresh comments
    } else {
      console.error('Error adding comment:', data.message);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

// Inside the discussion map, add a form to post comments
{discussions.map((discussion) => (
  <div key={discussion._id} className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-xl font-bold">{discussion.title}</h3>
    <p className="text-gray-700">{discussion.content}</p>
    <p className="text-sm text-gray-500">Posted by: {discussion.author.username}</p>
    <button
      onClick={() => handleDeleteDiscussion(discussion._id)}
      className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
    <div className="mt-4">
      <h4 className="text-lg font-bold">Comments</h4>
      {comments[discussion._id]?.map(comment => (
        <div key={comment._id} className="mt-2 p-2 bg-gray-50 rounded">
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-sm text-gray-500">Commented by: {comment.author.username}</p>
        </div>
      ))}
      <div className="mt-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows="2"
          placeholder="Add a comment"
        />
        <button
          onClick={() => handleAddComment(discussion._id)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post Comment
        </button>
      </div>
    </div>
  </div>
))}