import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, FileText, Star, Clock, CheckCircle, Search, Filter, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }
        
        const data = await response.json();
        setInterviews(data.interviews);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        toast.error(`Error loading interviews: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'from-gray-500 to-gray-400';
      case 'completed':
        return 'from-yellow-600 to-amber-500';
      case 'evaluated':
        return 'from-green-600 to-emerald-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'evaluated':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInterviews = interviews
    .filter(interview => 
      (filterStatus === 'all' || interview.status === filterStatus) &&
      (interview.jobId?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       interview.candidateId?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center relative mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
              Interview Evaluations
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 animate-pulse">
                <div className="h-7 bg-gray-700 rounded-md w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-700 rounded-md w-1/2 mb-3"></div>
                <div className="h-5 bg-gray-700 rounded-md w-1/3 mb-3"></div>
                <div className="h-5 bg-gray-700 rounded-md w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-700 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center relative mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
              Interview Evaluations
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
          </h1>
          <p className="text-red-400 mb-6">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center relative mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
            Interview Evaluations
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
        </h1>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by job title or candidate name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gray-800/80 border border-gray-700/50 rounded-lg px-4 py-2 hover:bg-gray-700/80 transition-colors"
            >
              <Filter size={18} />
              <span>Filter Status</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {['all', 'pending', 'completed', 'evaluated'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                        filterStatus === status ? 'bg-gray-700 text-purple-400' : 'text-white'
                      }`}
                    >
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50 text-center">
            <h2 className="text-xl font-semibold mb-2">No interviews found</h2>
            <p className="text-gray-400 mb-6">Try changing your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-6 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/evaluate/${interview._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {interview.jobId?.jobTitle || 'Untitled Position'}
                  </h2>
                  <div className="p-2 rounded-full bg-gradient-to-br from-gray-700 to-gray-800">
                    {interview.interviewType === 'video' ? (
                      <Video className="text-blue-400" size={20} />
                    ) : (
                      <FileText className="text-green-400" size={20} />
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-gray-300">Candidate:</span>
                    <span className="ml-2 text-white font-medium">
                      {interview.candidateId?.name || interview.candidateName || 'Anonymous Candidate'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-gray-300">Interview Type:</span>
                    <span className="ml-2 text-white capitalize font-medium">
                      {interview.interviewType}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-gray-300">Date:</span>
                    <span className="ml-2 text-white font-medium">
                      {formatDate(interview.completedAt || interview.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(interview.status)}`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                  
                  {interview.overallScore !== undefined && interview.overallScore !== null && (
                    <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span className="font-bold">{interview.overallScore.toFixed(1)}/10</span>
                    </div>
                  )}
                </div>
                
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-bold flex items-center justify-center transition-all duration-300 shadow-lg bg-gradient-to-r ${
                    interview.status === 'evaluated'
                      ? 'from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 hover:shadow-green-500/30'
                      : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30'
                  }`}
                >
                  {interview.status === 'evaluated' ? (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      View Evaluation
                    </>
                  ) : (
                    <>
                      <Star size={18} className="mr-2" />
                      Evaluate Interview
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewList;