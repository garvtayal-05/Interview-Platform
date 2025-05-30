import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, FileText, Clock, CheckCircle, Star, ChevronRight, AlertTriangle, User, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/my-interviews`, {
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
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">My Interviews</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 animate-pulse">
                <div className="h-6 bg-gray-700 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded-lg w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded-lg w-1/2"></div>
                <div className="flex justify-between mt-6">
                  <div className="h-8 bg-gray-700 rounded-lg w-24"></div>
                  <div className="h-8 bg-gray-700 rounded-lg w-36"></div>
                </div>
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
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">My Interviews</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">My Interviews</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="text-purple-400 hover:text-purple-300 flex items-center transition-colors"
          >
            Browse Jobs <ChevronRight className="ml-1" size={18} />
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-8 border border-gray-700/50 text-center">
            <h2 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">No interviews yet</h2>
            <p className="text-gray-400 mb-6">Complete interviews to see them listed here</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
            >
              Find Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div 
                key={interview._id} 
                className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/evaluate/${interview._id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                      {interview.jobId?.jobTitle || 'Untitled Position'}
                    </h2>
                    <div className="flex items-center text-gray-400 mb-2">
                      <User size={16} className="mr-2 text-purple-400" />
                      <span>{interview.candidateId?.name || 'Anonymous Candidate'}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                    {interview.interviewType === 'video' ? (
                      <Video className="text-blue-400 mr-2" size={18} />
                    ) : (
                      <FileText className="text-green-400 mr-2" size={18} />
                    )}
                    <span className="capitalize">{interview.interviewType} Interview</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      interview.status === 'completed'
                        ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/50'
                        : interview.status === 'evaluated'
                        ? 'bg-green-900/50 text-green-400 border border-green-500/50'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                    }`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                    {interview.overallScore !== undefined && (
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" />
                        <span className="font-medium">
                          {typeof interview.overallScore === 'number' ? interview.overallScore.toFixed(1) : '--'}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="mr-2" size={16} />
                    {formatDate(interview.completedAt || interview.createdAt)}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    className="bg-gray-700/50 hover:bg-gray-700 text-purple-300 px-4 py-1.5 rounded-lg text-sm flex items-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/evaluate/${interview._id}`);
                    }}
                  >
                    {interview.status === 'evaluated' ? (
                      <>
                        <CheckCircle size={16} className="mr-1" /> View Evaluation
                      </>
                    ) : (
                      <>
                        <Star size={16} className="mr-1" /> {interview.status === 'completed' ? 'Evaluate' : 'View Details'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviews;