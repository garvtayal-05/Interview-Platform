import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Send, CheckCircle } from 'lucide-react';

const TextInterview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(state.questions.map(q => ({ 
    questionId: q._id, 
    answerText: '' 
  })));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].answerText = e.target.value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < state.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const decoded = jwtDecode(token);
      const userId = decoded._id;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: state.jobId,
          answers,
          userId
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();
      toast.success('Interview submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-300">{state.jobTitle}</h1>
          <div className="h-1 w-20 bg-purple-500 rounded"></div>
        </header>
        
        {submitted ? (
          <div className="bg-gray-800 p-8 rounded-xl text-center shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Interview Submitted Successfully!</h2>
            <p className="text-gray-300 mb-8">Thank you for completing the interview. We'll review your responses shortly.</p>
            <button 
              onClick={() => navigate('/my-interviews')}
              className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-8 py-3 rounded-lg font-medium shadow-lg"
            >
              View My Interviews
            </button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{currentQuestionIndex + 1} of {state.questions.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Questions Panel */}
              <div className="lg:col-span-5 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(state.questions[currentQuestionIndex].difficulty)} bg-gray-700`}>
                    {state.questions[currentQuestionIndex].difficulty}
                  </span>
                </div>
                
                <div className="bg-gray-700 p-5 rounded-lg mb-6 shadow-inner min-h-[180px]">
                  <p className="text-lg leading-relaxed">{state.questions[currentQuestionIndex].questionText}</p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex <= 0}
                    className="bg-gray-700 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex >= state.questions.length - 1}
                    className="bg-gray-700 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>

              {/* Answer Panel */}
              <div className="lg:col-span-7 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
                <textarea
                  value={answers[currentQuestionIndex].answerText}
                  onChange={handleAnswerChange}
                  className="w-full h-64 bg-gray-700 text-white p-4 rounded-lg mb-6 resize-none border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-inner outline-none"
                  placeholder="Type your answer here..."
                />
                
                <div className="flex justify-end">
                  {currentQuestionIndex === state.questions.length - 1 ? (
                    <button
                      onClick={submitInterview}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 transition-colors text-white py-3 px-6 rounded-lg font-semibold shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : (
                        <>
                          Submit Interview <Send size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors text-white py-3 px-6 rounded-lg font-semibold shadow-lg flex items-center"
                    >
                      Next Question <ArrowRight size={16} className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 

export default TextInterview;