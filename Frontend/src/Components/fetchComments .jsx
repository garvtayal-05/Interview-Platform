const [comments, setComments] = useState({});

const fetchComments = async (discussionId) => {
  try {
    const response = await fetch(`http://localhost:1564/comment/${discussionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setComments(prev => ({ ...prev, [discussionId]: data }));
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

useEffect(() => {
  discussions.forEach(discussion => {
    fetchComments(discussion._id);
  });
}, [discussions]);

// Inside the discussion map, add a section to display comments
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
    </div>
  </div>
))}