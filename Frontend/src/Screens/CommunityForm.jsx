import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const CommunityForm = () => {
  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState({});
  const [comments, setComments] = useState({});
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Utility function to handle fetch requests and token expiration
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Check for unauthorized response (401)
      if (response.status === 401) {
        localStorage.removeItem("token"); // Clear the expired token
        toast.error("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login page
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };

  // Fetch all discussions
  const fetchDiscussions = async () => {
    try {
      const data = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/discuss/`);
      if (data) {
        setDiscussions(data);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to fetch discussions. Please try again.");
    }
  };

  // Fetch comments for a specific discussion
  const fetchComments = async (discussionId) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/comment/${discussionId}`
      );
      if (data) {
        setComments((prev) => ({ ...prev, [discussionId]: data }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments. Please try again.");
    }
  };

  // Create a new discussion
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/discuss/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (data) {
        setTitle("");
        setContent("");
        setIsFormVisible(false);
        fetchDiscussions();
        toast.success("Discussion created successfully!");
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error(error.message);
    }
  };

  // Delete a discussion
  const handleDeleteDiscussion = async (id) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/discuss/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response) {
        fetchDiscussions();
        toast.success("Discussion deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting discussion:", error);
      toast.error("Failed to delete discussion. Please try again.");
    }
  };

  // Post a comment on a discussion
  const handlePostComment = async (discussionId) => {
    if (!commentContent[discussionId]?.trim()) return;

    try {
      const data = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentContent[discussionId],
          discussionId,
        }),
      });

      if (data) {
        setCommentContent((prev) => ({ ...prev, [discussionId]: "" }));
        fetchComments(discussionId);
        toast.success("Comment posted successfully!");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(error.message);
    }
  };

  // Update a comment
  const handleUpdateComment = async (commentId, discussionId, updatedContent) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/comment/update/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: updatedContent }),
        }
      );

      if (data) {
        fetchComments(discussionId);
        toast.success("Comment updated successfully!");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error.message);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId, discussionId) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/comment/delete/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response) {
        fetchComments(discussionId);
        toast.success("Comment deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  // Toggle discussion expansion
  const toggleDiscussion = (id) => {
    setExpandedDiscussion(expandedDiscussion === id ? null : id);
  };

  // Fetch discussions and comments on component mount
  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Fetch comments for expanded discussion
  useEffect(() => {
    if (expandedDiscussion) {
      fetchComments(expandedDiscussion);
    }
  }, [expandedDiscussion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Community Discussions</h1>
            <p className="text-purple-200 mt-1">Share your thoughts and connect with others</p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition duration-300 shadow-lg flex items-center"
              >
                {isFormVisible ? "Cancel" : "Start a New Discussion"}
              </button>
            </div>

            {/* Create Discussion Form - Animated slide down */}
            {isFormVisible && (
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700 transform transition-all duration-300 ease-in-out">
                <form onSubmit={handleCreateDiscussion}>
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    Create a New Discussion
                  </h2>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Title"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="4"
                      placeholder="What's on your mind?"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-lg"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Discussions List */}
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <div
                  key={discussion._id}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleDiscussion(discussion._id)}
                  >
                    <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{discussion.content}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {comments[discussion._id]?.length || 0} comments
                      </span>
                      <button className="text-indigo-400 text-sm">
                        {expandedDiscussion === discussion._id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedDiscussion === discussion._id && (
                    <div className="mt-6 pt-6 border-t border-gray-700 animate-fade-in">
                      {/* Full content */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium mb-2">Full Discussion</h4>
                        <p className="text-gray-300">{discussion.content}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Created by: {discussion.author?.name || "Unknown"}
                        </p>
                      </div>

                      {/* Comment Input */}
                      <div className="mb-6">
                        <div className="flex items-start">
                          <textarea
                            value={commentContent[discussion._id] || ""}
                            onChange={(e) =>
                              setCommentContent((prev) => ({
                                ...prev,
                                [discussion._id]: e.target.value,
                              }))
                            }
                            className="flex-grow px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="2"
                            placeholder="Add your thoughts..."
                          />
                          <button
                            onClick={() => handlePostComment(discussion._id)}
                            className="ml-2 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            disabled={!commentContent[discussion._id]?.trim()}
                          >
                            Comment
                          </button>
                        </div>
                      </div>

                      {/* Display Comments */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium mb-2">Comments</h4>
                        {comments[discussion._id]?.length > 0 ? (
                          comments[discussion._id].map((comment) => (
                            <div
                              key={comment._id}
                              className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                            >
                              <p className="text-gray-300 mb-3">{comment.content}</p>
                              <p className="text-sm text-gray-400 mb-2">
                                Commented by: {comment.createdBy?.name || "Unknown"}
                              </p>
                              <div className="flex space-x-2 justify-end text-xs">
                                <button
                                  onClick={() =>
                                    handleUpdateComment(
                                      comment._id,
                                      discussion._id,
                                      prompt("Edit your comment:", comment.content)
                                    )
                                  }
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full transition duration-300"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id, discussion._id)
                                  }
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition duration-300"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No comments yet. Be the first to comment!</p>
                        )}
                      </div>

                      {/* Delete Discussion Button */}
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => handleDeleteDiscussion(discussion._id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300"
                        >
                          Delete Discussion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {discussions.length === 0 && (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                  <p className="text-gray-300 text-lg">No discussions yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Floating action button for small screens */}
            <div className="md:hidden fixed bottom-6 right-6">
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300"
              >
                {isFormVisible ? "×" : "+"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default CommunityForm;