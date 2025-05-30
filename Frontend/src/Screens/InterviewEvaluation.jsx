import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, ChevronLeft, Video, FileText, Calendar, User, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const InterviewEvaluation = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleScoreChange = (answerId, value) => {
    setScores(prev => ({
      ...prev,
      [answerId]: Math.min(10, Math.max(0, Number(value) || 0))
    }));
  };

  const handleFeedbackChange = (answerId, text) => {
    setFeedback(prev => ({
      ...prev,
      [answerId]: text
    }));
  };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/interview/${interviewId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch interview: ' + response.status);
        }

        const data = await response.json();
        
        if (!data?.interview) {
          throw new Error('Invalid interview data structure');
        }

        setInterview(data.interview);
        
        const initialScores = {};
        const initialFeedback = {};
        data.interview.answers?.forEach(answer => {
          if (answer?._id) {
            initialScores[answer._id] = answer.score || 0;
            initialFeedback[answer._id] = answer.feedback || '';
          }
        });
        setScores(initialScores);
        setFeedback(initialFeedback);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        toast.error('Error loading interview: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  const submitEvaluation = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const evaluations = Object.keys(scores).map(answerId => ({
        answerId,
        score: scores[answerId],
        feedback: feedback[answerId] || ''
      }));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/interview/evaluate/${interviewId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ evaluations })
        }
      );

      if (!response.ok) {
        throw new Error('Evaluation failed: ' + response.status);
      }

      toast.success('Evaluation submitted successfully!');
      navigate('/interview-list');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 border-green-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'hard':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-gray-800 rounded-lg w-40 animate-pulse"></div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50 mb-8">
            <div className="h-8 bg-gray-700 rounded-lg w-1/3 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded-lg w-1/2 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50 animate-pulse">
                <div className="h-6 bg-gray-700 rounded-lg w-1/4 mb-4"></div>
                <div className="h-24 bg-gray-700 rounded-lg mb-6"></div>
                <div className="h-24 bg-gray-700 rounded-lg mb-6"></div>
                <div className="h-12 bg-gray-700 rounded-lg"></div>
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
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error Loading Interview</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-700/50">
            <h1 className="text-2xl font-bold mb-4">Interview Not Found</h1>
            <p className="text-gray-400 mb-6">The interview you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/interview-list')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30"
            >
              Back to Interview List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-400 mb-6 hover:text-purple-300 transition-colors"
        >
          <ChevronLeft className="mr-1" /> Back to Interviews
        </button>
        
        {/* Interview Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50 mb-8">
          <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
            {interview.jobId?.jobTitle || 'Untitled Job'}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-gray-300 mb-6">
            <div className="flex items-center">
              <User size={16} className="mr-2 text-purple-400" />
              <span>Candidate: <span className="text-white">{interview.candidateId?.name || 'Unknown'}</span></span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-purple-400" />
              <span>Date: <span className="text-white">{formatDate(interview.completedAt || interview.createdAt)}</span></span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center">
                {interview.interviewType === 'video' ? (
                  <Video className="text-blue-400 mr-2" size={20} />
                ) : (
                  <FileText className="text-green-400 mr-2" size={20} />
                )}
                <h3 className="font-medium">Interview Type</h3>
              </div>
              <p className="mt-2 capitalize text-white">{interview.interviewType || 'unknown'}</p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  interview.status === 'completed' ? 'bg-yellow-400' :
                  interview.status === 'evaluated' ? 'bg-green-400' : 'bg-gray-400'
                }`}></span>
                <h3 className="font-medium">Status</h3>
              </div>
              <p className="mt-2 capitalize text-white">{interview.status || 'unknown'}</p>
            </div>
          </div>
        </div>
        
        {/* Evaluation Header */}
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
            Evaluation
          </h2>
          <div className="ml-4 h-px flex-1 bg-gradient-to-r from-purple-600/50 to-transparent"></div>
        </div>
        
        {/* Questions and Answers */}
        <div className="space-y-6">
          {interview.answers?.map((answer, index) => (
            <div key={answer._id || index} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mr-3 text-purple-400 text-sm">
                  {index + 1}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                  Question {index + 1}
                </span>
              </h3>
              
              <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
                <p className="font-medium text-indigo-300 mb-2">Question:</p>
                <p className="text-white">{answer.questionId?.questionText || 'Question text not available'}</p>
                
                {answer.questionId?.difficulty && (
                  <div className="mt-3 flex items-center">
                    <span className={`text-sm px-3 py-1 border rounded-full ${getDifficultyClass(answer.questionId?.difficulty)}`}>
                      {answer.questionId?.difficulty}
                    </span>
                  </div>
                )}
              </div>
              
              {interview.interviewType === 'text' ? (
                <div className="mb-6">
                  <p className="font-medium text-indigo-300 mb-2">Candidate's Answer:</p>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-white">
                    {answer.answerText || 'No answer provided'}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="font-medium text-indigo-300 mb-2">Candidate's Video Answer:</p>
                  {answer.videoUrl ? (
                    <video 
                      src={answer.videoUrl} 
                      controls 
                      className="w-full rounded-lg bg-black"
                      poster="/video-placeholder.jpg"
                    />
                  ) : (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-white">
                      Video not available
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <label className="block font-medium text-indigo-300 mb-2">
                  Score (0-10):
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scores[answer._id] || 0}
                    onChange={(e) => handleScoreChange(answer._id, e.target.value)}
                    className="w-16 p-2 bg-gray-700 border border-gray-600 rounded text-white text-center focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    disabled={interview.status === 'evaluated'}
                  />
                  <div className="ml-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`cursor-pointer ${
                          (scores[answer._id] || 0) / 2 > i
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-500'
                        }`}
                        onClick={() => interview.status !== 'evaluated' && handleScoreChange(answer._id, (i + 1) * 2)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block font-medium text-indigo-300 mb-2">
                  Feedback:
                </label>
                <textarea
                  value={feedback[answer._id] || ''}
                  onChange={(e) => handleFeedbackChange(answer._id, e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  rows="4"
                  placeholder="Provide detailed feedback for this answer..."
                  disabled={interview.status === 'evaluated'}
                />
              </div>
            </div>
          ))}
        </div>
        
        {interview.status !== 'evaluated' && (
          <div className="mt-8 mb-12 flex justify-end">
            <button
              onClick={submitEvaluation}
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg flex items-center justify-center shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 min-w-40"
            >
              {submitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                <>
                  <CheckCircle className="mr-2" /> Submit Evaluation
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewEvaluation;