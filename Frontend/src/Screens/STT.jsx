import { jwtDecode } from "jwt-decode";
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STT = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;

  const [state, setState] = useState({
    isRecording: false,
    transcript: '',
    testMode: null,
    topic: '',
    loading: false,
    resumeFile: null,
    currentQuestionIndex: 0,
    questions: [],
    introduction: '',
    currentEvaluation: null,
    finalEvaluation: null,
    showEvaluation: false,
    userId: userId,
    responseTimes: [], 
    questionStartTime: null, 
  });

  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Automatically scroll to top when changing questions
  useEffect(() => {
    if (shouldScrollToTop && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  // Track question display time
  useEffect(() => {
    if (state.questions.length > 0 && state.currentQuestionIndex < state.questions.length) {
      setState(prev => ({
        ...prev,
        questionStartTime: new Date()
      }));
    }
  }, [state.currentQuestionIndex, state.questions]);

  const calculateResponseTime = () => {
    if (!state.questionStartTime) return 0;
    const endTime = new Date();
    return (endTime - state.questionStartTime) / 1000; // Convert to seconds
  };

  const startRecognition = () => {
    
    const responseTime = calculateResponseTime();
    const updatedResponseTimes = [...state.responseTimes];
    updatedResponseTimes[state.currentQuestionIndex] = responseTime;

    setState(prev => ({
      ...prev,
      responseTimes: updatedResponseTimes
    }));

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Browser doesn't support speech recognition");

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      
      let interimTranscript = '';

      recognition.onresult = (e) => {
        interimTranscript = '';
        let finalTranscript = '';

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setState(prev => ({ 
          ...prev, 
          transcript: finalTranscript || interimTranscript 
        }));
      };

      recognition.onerror = (e) => {
        console.error('Recognition error:', e.error);
        setState(prev => ({ ...prev, isRecording: false }));
      };

      recognition.onend = () => {
        if (state.isRecording) {
          recognition.start();
        }
      };
    }

    try {
      recognitionRef.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (err) {
      toast.error('Failed to start recording: ' + err.message);
    }
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    setState(prev => ({ ...prev, isRecording: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setState(prev => ({ ...prev, resumeFile: file }));
  };

  const generateQuestions = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const endpoint = state.testMode === 'resume'
        ? '/stt/generate-resume-questions'
        : '/stt/generate-topic-questions';

      const formData = new FormData();
      if (state.testMode === 'resume') {
        if (!state.resumeFile) {
          toast.error('Please upload your resume first');
          return;
        }
        formData.append('resume', state.resumeFile);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          ...(state.testMode === 'topic' && { 'Content-Type': 'application/json' })
        },
        body: state.testMode === 'topic' 
          ? JSON.stringify({ topic: state.topic })
          : formData
      });

      const data = await res.json();
      setState(prev => ({
        ...prev,
        questions: data.questions || [],
        introduction: data.introLine || '',
        currentQuestionIndex: 0,
        transcript: '',
        loading: false,
        showEvaluation: false,
        responseTimes: [],
        questionStartTime: new Date()
      }));
      
      // Scroll to top when questions are generated
      setShouldScrollToTop(true);
    } catch (err) {
      toast.error(err.message || 'Failed to generate questions');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const submitAnswer = async () => {
    if (!state.transcript) return toast.error('Please record an answer first');
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const responseTime = state.responseTimes[state.currentQuestionIndex] || calculateResponseTime();
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/stt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question: state.questions[state.currentQuestionIndex],
          answer: state.transcript,
          userId: state.userId,
          responseTime
        })
      });

      const data = await res.json();
      setState(prev => ({ 
        ...prev, 
        currentEvaluation: data,
        showEvaluation: true,
        loading: false
      }));
      
      // Scroll to evaluation after submitting
      if (containerRef.current) {
        const evalSection = containerRef.current.querySelector('.evaluation-section');
        if (evalSection) {
          evalSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      toast.error('Failed to submit answer');
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const moveToNextQuestion = async () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        transcript: '',
        showEvaluation: false,
        currentEvaluation: null,
        questionStartTime: new Date()
      }));
      // Set flag to scroll to top
      setShouldScrollToTop(true);
    } else {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const finalRes = await fetch(`${import.meta.env.VITE_API_URL}/stt/final-evaluation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            userId: state.userId,
            responseTimes: state.responseTimes
          })
        });
        const finalData = await finalRes.json();
        setState(prev => ({ 
          ...prev, 
          finalEvaluation: finalData,
          showEvaluation: false,
          loading: false
        }));
        // Set flag to scroll to top
        setShouldScrollToTop(true);
      } catch (err) {
        toast.error('Failed to get final evaluation');
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  };

  const resetTest = () => {
    setState({
      isRecording: false,
      transcript: '',
      testMode: null,
      topic: '',
      loading: false,
      resumeFile: null,
      currentQuestionIndex: 0,
      questions: [],
      introduction: '',
      currentEvaluation: null,
      finalEvaluation: null,
      showEvaluation: false,
      userId: userId,
      responseTimes: [],
      questionStartTime: null
    });
  };

  const calculateAverageScore = (scores) => {
    if (!scores || Object.keys(scores).length === 0) return "N/A";
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return (total / Object.keys(scores).length).toFixed(1);
  };

  const renderTestModeSelection = () => (
    <div className="space-y-6 py-6">
      <h2 className="text-xl font-semibold text-center mb-8">Choose Your Interview Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setState(prev => ({ ...prev, testMode: 'resume' }))}
          className="bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500"
        >
          <h3 className="text-lg font-medium mb-2">Resume-Based Interview</h3>
          <p className="text-gray-300 text-sm">Upload your resume and get personalized interview questions</p>
        </div>
        
        <div 
          onClick={() => setState(prev => ({ ...prev, testMode: 'topic' }))}
          className="bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500"
        >
          <h3 className="text-lg font-medium mb-2">Topic-Based Interview</h3>
          <p className="text-gray-300 text-sm">Practice with questions on a specific skill or technology</p>
        </div>
      </div>
    </div>
  );

  const renderResumeUpload = () => (
    <div className="space-y-6 py-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setState(prev => ({ ...prev, testMode: null }))} 
          className="flex items-center text-purple-400 hover:text-purple-300 mr-2 transition-colors"
        >
          <span>← Back</span>
        </button>
        <h2 className="text-xl font-semibold">Resume Upload</h2>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 transition-shadow hover:shadow-xl">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
        />
        
        {state.resumeFile ? (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-1">{state.resumeFile.name}</h3>
            <p className="text-gray-400 mb-4">Resume uploaded successfully</p>
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <h3 className="text-lg font-medium mb-1">Upload Resume</h3>
            <p className="text-gray-400 mb-6">PDF or DOCX files accepted</p>
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Select File
            </button>
          </div>
        )}
      </div>
      
      <button 
        onClick={generateQuestions} 
        disabled={!state.resumeFile || state.loading} 
        className={`w-full py-3 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${!state.resumeFile || state.loading 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'}`}
      >
        {state.loading ? "Generating Questions..." : "Generate Interview Questions"}
      </button>
    </div>
  );

  const renderTopicInput = () => (
    <div className="space-y-6 py-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setState(prev => ({ ...prev, testMode: null }))} 
          className="flex items-center text-purple-400 hover:text-purple-300 mr-2 transition-colors"
        >
          <span>← Back</span>
        </button>
        <h2 className="text-xl font-semibold">Topic Selection</h2>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 transition-shadow hover:shadow-xl">
        <div className="flex flex-col items-center justify-center p-4">
          <h3 className="text-lg font-medium mb-1">Enter Interview Topic</h3>
          <p className="text-gray-400 mb-6 text-center">Specify a skill, technology, or job role you want to practice</p>
          
          <input
            type="text"
            value={state.topic}
            onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g. ReactJS, Data Science, Project Management"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all"
          />
          
          <div className="mt-4 text-sm text-gray-400 w-full">
            <p className="mb-2">Popular topics:</p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'Python', 'Data Science', 'UI/UX Design', 'Product Management'].map(topic => (
                <button 
                  key={topic} 
                  onClick={() => setState(prev => ({ ...prev, topic }))}
                  className="px-3 py-1 bg-gray-700 rounded-full border border-gray-600 text-purple-400 hover:bg-gray-600 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={generateQuestions} 
        disabled={!state.topic || state.loading} 
        className={`w-full py-3 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${!state.topic || state.loading 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'}`}
      >
        {state.loading ? "Generating Questions..." : "Generate Interview Questions"}
      </button>
    </div>
  );

  const renderEvaluationWithTiming = () => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 evaluation-section">
      <h3 className="text-lg font-medium mb-4">Response Evaluation</h3>
      
      {state.responseTimes[state.currentQuestionIndex] !== undefined && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Response Time: <span className="font-medium">{state.responseTimes[state.currentQuestionIndex].toFixed(2)} seconds</span>
          </p>
        </div>
      )}
      
      <ScoreGrid scores={state.currentEvaluation.scores} />
      
      <div className="mt-6 bg-gray-700 rounded-lg p-4 border border-gray-600">
        <h4 className="font-medium mb-2">Feedback:</h4>
        <p className="text-gray-300">{state.currentEvaluation.feedback}</p>
      </div>
      
      <button 
        onClick={moveToNextQuestion}
        disabled={state.loading}
        className={`w-full mt-6 py-3 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${state.loading 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'}`}
      >
        {state.loading ? "Processing..." : (
          state.currentQuestionIndex < state.questions.length - 1 
            ? "Next Question"
            : "Complete Interview"
        )}
      </button>
    </div>
  );

  const renderFinalEvaluation = () => {
    const avgResponseTime = state.responseTimes.length > 0 
      ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(2)
      : 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Final Evaluation</h2>
          <button 
            onClick={resetTest} 
            className="px-4 py-2 bg-gray-800 text-purple-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            New Test
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transition-shadow hover:shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600 text-white text-2xl font-bold mb-2 shadow-lg">
              {calculateAverageScore(state.finalEvaluation.overallScores)}
            </div>
            <h3 className="text-xl font-medium">Overall Score</h3>
            {avgResponseTime > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Average Response Time: {avgResponseTime} seconds
              </p>
            )}
          </div>
          
          <ScoreGrid scores={state.finalEvaluation.overallScores} />
          
          <div className="mt-8 space-y-6">
            <EvaluationSection 
              title="Strengths" 
              items={state.finalEvaluation.strengths} 
            />
            
            <EvaluationSection 
              title="Areas for Improvement" 
              items={state.finalEvaluation.weaknesses} 
            />
            
            <EvaluationSection 
              title="Recommendations" 
              items={state.finalEvaluation.recommendations} 
            />
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={resetTest}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              Start a New Interview
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionSection = () => {
    const totalQuestions = state.questions.length;
    const currentQuestion = state.currentQuestionIndex + 1;
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    
    return (
      <div className="space-y-6">
        {state.finalEvaluation ? (
          renderFinalEvaluation()
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <button 
                  onClick={resetTest} 
                  className="mr-2 text-gray-400 hover:text-gray-300 transition-colors"
                  title="Start over"
                >
                  Home
                </button>
                <h2 className="text-xl font-semibold">
                  {state.testMode === 'resume' ? 'Resume Interview' : 'Topic Interview'}
                </h2>
              </div>
              
              <div className="text-sm text-gray-400 flex items-center">
                <span className="bg-purple-800 text-white px-2 py-1 rounded-md">
                  {currentQuestion} of {totalQuestions}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="h-2.5 rounded-full bg-purple-600 transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {state.introduction && (
              <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg italic mb-4">
                <p>{state.introduction}</p>
              </div>
            )}
            
            <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700 mb-6 transition-shadow hover:shadow-xl">
              <h3 className="text-lg font-medium mb-2">Question:</h3>
              <p className="text-lg">{state.questions[state.currentQuestionIndex]}</p>
            </div>
            
            <div className="flex justify-center mb-6">
              {state.isRecording ? (
                <button 
                  onClick={stopRecognition} 
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 animate-pulse"
                >
                  <span>Stop Recording</span>
                </button>
              ) : (
                <button 
                  onClick={startRecognition} 
                  disabled={state.showEvaluation}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${state.showEvaluation 
                    ? 'bg-gray-600 cursor-not-allowed text-white' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  <span>Start Answering</span>
                </button>
              )}
            </div>
            
            {state.transcript && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700 mb-6 transition-shadow hover:shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Your Answer:</h3>
                  {state.isRecording && (
                    <span className="text-sm text-red-400 flex items-center animate-pulse">
                      Recording...
                    </span>
                  )}
                </div>
                <p className="text-gray-300">{state.transcript}</p>
              </div>
            )}
            
            {state.transcript && !state.isRecording && !state.showEvaluation && (
              <button 
                onClick={submitAnswer} 
                disabled={state.loading}
                className={`w-full py-3 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${state.loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'}`}
              >
                {state.loading ? "Evaluating Response..." : "Submit Answer for Evaluation"}
              </button>
            )}
            
            {state.showEvaluation && state.currentEvaluation && (
              renderEvaluationWithTiming()
            )}
          </>
        )}
      </div>
    );
  };

  const EvaluationSection = ({ title, items }) => {
    return (
      <div className="p-4 rounded-lg bg-gray-700 border border-gray-600 transition-all hover:border-gray-500">
        <h4 className="font-medium mb-3">{title}</h4>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-purple-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const ScoreGrid = ({ scores }) => {
    const scoreCategories = {
      relevance: "Relevance",
      clarity: "Clarity",
      depth: "Depth",
      confidence: "Confidence",
      structure: "Structure"
    };
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
        {Object.entries(scores).map(([key, score]) => {
          const label = scoreCategories[key] || key;
          let colorClass;
          
          if (score >= 4) colorClass = "bg-green-900 border-green-700";
          else if (score >= 3) colorClass = "bg-blue-900 border-blue-700";
          else if (score >= 2) colorClass = "bg-yellow-900 border-yellow-700";
          else colorClass = "bg-red-900 border-red-700";
          
          return (
            <div key={key} className={`rounded-lg p-3 border text-center ${colorClass} transition-transform hover:scale-105`}>
              <div className="text-xl font-bold mb-1">{score}</div>
              <div className="text-xs font-medium">{label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-3xl mx-auto pt-8 pb-16 px-4">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden" 
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            ref={containerRef}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-white">AceBoard Interview Simulator</h1>
            <p className="text-purple-200 mt-1">Practice your interview skills and get instant feedback</p>
          </div>
          
          <div className="p-6">
            {!state.testMode ? renderTestModeSelection() :
             state.testMode === 'resume' && state.questions.length === 0 ? renderResumeUpload() :
             state.testMode === 'topic' && state.questions.length === 0 ? renderTopicInput() :
             state.questions.length > 0 ? renderQuestionSection() : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default STT;