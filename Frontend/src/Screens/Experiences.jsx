import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  Plus, Search, Filter, ThumbsUp, ThumbsDown, User, Building, 
  Calendar, Edit, Trash2, X, Eye, Mail, Linkedin, UserCheck
} from "lucide-react";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOffer, setFilterOffer] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [showOnlyUserExperiences, setShowOnlyUserExperiences] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    currentRole: "",
    companyName: "",
    offer: "",
    experience: "",
    difficulty: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExperiences();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    // First try to get from userData
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Current User from userData:", user._id);
        setCurrentUserId(user._id);
        setIsLoggedIn(true);
        return;
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }

    // If userData not available, try to get from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        console.log("Current User from token:", decodedToken);
        const userId = decodedToken._id || decodedToken.id || decodedToken.userId;
        setCurrentUserId(userId);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // ✅ NEW: Function to check login and show error
  const requireLogin = (action) => {
    if (!isLoggedIn) {
      toast.error(`Please login to ${action}`);
      return false;
    }
    return true;
  };

  const fetchExperiences = async () => {
    try {
      // ✅ MODIFIED: Make API call without token for public access
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/get-experience`,
        {
          method: "GET",
          headers,
        }
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.Error);
      
      setExperiences(data);
      setShowOnlyUserExperiences(false);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to fetch experiences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserExperiences = async () => {
    if (!requireLogin("view your experiences")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/Get_User_Experiences`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.Error);
      
      setExperiences(data);
      setShowOnlyUserExperiences(true);
      toast.success("Showing your experiences only");
    } catch (error) {
      console.error("Error fetching user experiences:", error);
      toast.error("Failed to fetch your experiences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (experienceId, voteType) => {
    if (!requireLogin("vote on experiences")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/${voteType}/${experienceId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.Error);

      // Update local state
      const updateExperience = (exp) => 
        exp._id === experienceId 
          ? { 
              ...exp, 
              upvotes: voteType === 'upvote' ? 
                (exp.upvotes?.includes(currentUserId) ? 
                  exp.upvotes.filter(id => id !== currentUserId) : 
                  [...(exp.upvotes || []), currentUserId]) : 
                exp.upvotes?.filter(id => id !== currentUserId) || [],
              downvotes: voteType === 'downvote' ? 
                (exp.downvotes?.includes(currentUserId) ? 
                  exp.downvotes.filter(id => id !== currentUserId) : 
                  [...(exp.downvotes || []), currentUserId]) : 
                exp.downvotes?.filter(id => id !== currentUserId) || []
            } 
          : exp;

      setExperiences(prev => prev.map(updateExperience));
      
      // Update selected experience if it's open in detail modal
      if (selectedExperience && selectedExperience._id === experienceId) {
        setSelectedExperience(prev => updateExperience(prev));
      }

      toast.success(data.Message);
    } catch (error) {
      toast.error(error.message || "Failed to vote");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requireLogin("share experience")) return;

    if (!formData.currentRole || !formData.companyName || !formData.offer || !formData.experience || !formData.difficulty) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      const url = editingExperience 
        ? `${import.meta.env.VITE_API_URL}/experience/Update_Experience/${editingExperience._id}`
        : `${import.meta.env.VITE_API_URL}/experience/add-experience`;
      
      const method = editingExperience ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) throw new Error(data.Error);

      toast.success(data.Message);
      setIsFormOpen(false);
      setEditingExperience(null);
      setFormData({
        name: "",
        email: "",
        linkedin: "",
        currentRole: "",
        companyName: "",
        offer: "",
        experience: "",
        difficulty: "",
      });
      
      // Refresh the appropriate list based on current view
      if (showOnlyUserExperiences) {
        fetchUserExperiences();
      } else {
        fetchExperiences();
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (experience) => {
    if (!requireLogin("edit experience")) return;

    setEditingExperience(experience);
    setFormData({
      name: experience.name || "",
      email: experience.email || "",
      linkedin: experience.linkedin || "",
      currentRole: experience.currentRole || "",
      companyName: experience.companyName || "",
      offer: experience.offer || "",
      experience: experience.experience || "",
      difficulty: experience.difficulty || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (experienceId) => {
    if (!requireLogin("delete experience")) return;

    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/Delete_Experience/${experienceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.Error);

      toast.success(data.Message);
      setExperiences(prev => prev.filter(exp => exp._id !== experienceId));
      
      // Close detail modal if the deleted experience was open
      if (selectedExperience && selectedExperience._id === experienceId) {
        setIsDetailModalOpen(false);
        setSelectedExperience(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete experience");
    }
  };

  // ✅ MODIFIED: Check login before opening detail modal
  const handleViewDetails = (experience) => {
    if (!requireLogin("view full experience")) return;
    
    setSelectedExperience(experience);
    setIsDetailModalOpen(true);
  };

  // ✅ MODIFIED: Check login before opening share form
  const handleShareExperience = () => {
    if (!requireLogin("share experience")) return;

    setIsFormOpen(true);
    setEditingExperience(null);
    setFormData({
      name: "",
      email: "",
      linkedin: "",
      currentRole: "",
      companyName: "",
      offer: "",
      experience: "",
      difficulty: "",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getOfferColor = (offer) => {
    return offer === 'Accepted' ? 'bg-green-600' : 'bg-red-600';
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.currentRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOffer = !filterOffer || exp.offer === filterOffer;
    const matchesDifficulty = !filterDifficulty || exp.difficulty === filterDifficulty;
    
    return matchesSearch && matchesOffer && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Interview Experiences
        </h1>
        <div className="flex items-center space-x-3">
          {/* ✅ MODIFIED: Only show "My Experiences" if logged in */}
          {isLoggedIn && currentUserId && (
            <button
              onClick={showOnlyUserExperiences ? fetchExperiences : fetchUserExperiences}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                showOnlyUserExperiences 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <UserCheck size={18} />
              <span>{showOnlyUserExperiences ? 'Show All' : 'My Experiences'}</span>
            </button>
          )}
          
          <button
            onClick={handleShareExperience}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
          >
            <Plus size={20} />
            <span>Share Experience</span>
          </button>
        </div>
      </div>

      {/* ✅ MODIFIED: Only show user experience indicator if logged in */}
      {isLoggedIn && showOnlyUserExperiences && (
        <div className="mb-4 p-3 bg-indigo-800/30 border border-indigo-600 rounded-lg">
          <p className="text-indigo-300 text-sm flex items-center">
            <UserCheck size={16} className="mr-2" />
            Showing only your experiences ({experiences.length} found)
          </p>
        </div>
      )}

      {/* ✅ NEW: Show login prompt for non-logged-in users */}
      {!isLoggedIn && (
        <div className="mb-4 p-4 bg-yellow-800/30 border border-yellow-600 rounded-lg">
          <p className="text-yellow-300 text-sm">
            📖 You can browse experiences as a guest. Please login to vote, view full details, or share your own experience.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by company, name, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <select
          value={filterOffer}
          onChange={(e) => setFilterOffer(e.target.value)}
          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Offers</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Experiences Grid */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center text-gray-300 text-xl">
          <p>
            {showOnlyUserExperiences 
              ? "You haven't shared any experiences yet." 
              : "No experiences found."
            }
          </p>
          <p className="mt-2">
            {showOnlyUserExperiences 
              ? "Click 'Share Experience' to add your first interview experience!"
              : "Be the first to share your interview experience!"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((experience) => (
            <div key={experience._id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              {/* Header with gradient and badges */}
              <div className="relative">
                <div className="h-6 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`${getOfferColor(experience.offer)} text-xs font-bold text-white px-3 py-1 rounded-full`}>
                    {experience.offer}
                  </span>
                  <span className={`${getDifficultyColor(experience.difficulty)} text-xs font-bold text-white px-3 py-1 rounded-full`}>
                    {experience.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* User Info with Owner Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 rounded-full p-2">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{experience.name}</h3>
                      <p className="text-gray-400 text-sm">{experience.currentRole}</p>
                    </div>
                  </div>
                  
                  {/* ✅ MODIFIED: Only show edit/delete for logged in owners */}
                  {isLoggedIn && currentUserId && experience.createdBy === currentUserId && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(experience);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                        title="Edit Experience"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(experience._id);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="flex items-center text-gray-300">
                  <Building className="text-purple-400 mr-2" size={16} />
                  <span className="font-medium">{experience.companyName}</span>
                </div>

                {/* Experience Preview */}
                <div className="mt-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Experience:</h4>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {experience.experience.length > 150 
                      ? `${experience.experience.substring(0, 150)}...` 
                      : experience.experience}
                  </p>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(experience)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                >
                  <Eye size={16} />
                  <span>View Full Experience</span>
                </button>

                {/* Voting Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(experience._id, 'upvote');
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        isLoggedIn && experience.upvotes?.includes(currentUserId)
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-green-600/20'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span>{experience.upvotes?.length || 0}</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(experience._id, 'downvote');
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        isLoggedIn && experience.downvotes?.includes(currentUserId)
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-red-600/20'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      <span>{experience.downvotes?.length || 0}</span>
                    </button>
                  </div>

                  {/* Date */}
                  {/* <div className="flex items-center text-gray-500 text-xs">
                    <Calendar size={14} className="mr-1" />
                    {new Date(experience.createdAt).toLocaleDateString()}
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal - keeping the same structure */}
      {isDetailModalOpen && selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 rounded-full p-3">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedExperience.name}</h2>
                  <p className="text-gray-400">{selectedExperience.currentRole} at {selectedExperience.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`${getOfferColor(selectedExperience.offer)} text-sm font-bold text-white px-4 py-2 rounded-full`}>
                  {selectedExperience.offer}
                </span>
                <span className={`${getDifficultyColor(selectedExperience.difficulty)} text-sm font-bold text-white px-4 py-2 rounded-full`}>
                  {selectedExperience.difficulty} Difficulty
                </span>
                <span className="bg-gray-600 text-sm font-medium text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>{new Date(selectedExperience.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              {/* Company Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-300 mb-2">
                  <Building className="text-purple-400 mr-2" size={20} />
                  <span className="font-bold text-lg">{selectedExperience.companyName}</span>
                </div>
                <p className="text-gray-400">Position: {selectedExperience.currentRole}</p>
              </div>

              {/* Contact Information */}
              {(selectedExperience.email || selectedExperience.linkedin) && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-400 mb-3 text-lg">Contact Information</h3>
                  <div className="space-y-2">
                    {selectedExperience.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="text-purple-400" size={16} />
                        <a href={`mailto:${selectedExperience.email}`} className="text-gray-300 hover:text-white transition-colors">
                          {selectedExperience.email}
                        </a>
                      </div>
                    )}
                    {selectedExperience.linkedin && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="text-purple-400" size={16} />
                        <a 
                          href={selectedExperience.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Experience */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-purple-400 mb-3 text-lg">Full Interview Experience</h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedExperience.experience}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(selectedExperience._id, 'upvote')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isLoggedIn && selectedExperience.upvotes?.includes(currentUserId)
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-green-600/20'
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span>{selectedExperience.upvotes?.length || 0} Helpful</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(selectedExperience._id, 'downvote')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isLoggedIn && selectedExperience.downvotes?.includes(currentUserId)
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-red-600/20'
                    }`}
                  >
                    <ThumbsDown size={18} />
                    <span>{selectedExperience.downvotes?.length || 0}</span>
                  </button>
                </div>

                {/* Owner actions in modal */}
                {isLoggedIn && currentUserId && selectedExperience.createdBy === currentUserId && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleEdit(selectedExperience);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedExperience._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal - keeping the same structure */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                {editingExperience ? "Update Experience" : "Share Your Experience"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name (optional)"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com (optional)"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile (optional)"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Current Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g., Google, Microsoft, etc."
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Offer Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offer Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.offer}
                  onChange={(e) => setFormData(prev => ({ ...prev, offer: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select offer status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interview Difficulty <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Share your interview experience, questions asked, tips, etc."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : editingExperience ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experiences;
