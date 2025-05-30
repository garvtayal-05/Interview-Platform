import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleDot, StopCircle, ArrowLeft, ArrowRight, Camera, Check, Loader } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const VideoInterview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideos(prev => {
          // Replace existing recording for this question if it exists
          const questionId = state.questions[currentQuestionIndex]._id;
          const exists = prev.findIndex(v => v.questionId === questionId);
          
          if (exists >= 0) {
            const updated = [...prev];
            updated[exists] = { questionId, blob };
            return updated;
          } else {
            return [...prev, { questionId, blob }];
          }
        });
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error('Error accessing camera/microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Error stopping recording: ' + error.message);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < state.questions.length - 1) {
      stopRecording();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      stopRecording();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Make sure to stop recording when navigating away
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const submitInterview = async () => {
    try {
      // Ensure we stop any ongoing recording before submitting
      stopRecording();
      
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const decoded = jwtDecode(token);
      const userId = decoded._id;

      const formData = new FormData();
      formData.append('jobId', state.jobId);
      formData.append('userId', userId);
      formData.append('answers', JSON.stringify(
        state.questions.map((q, i) => ({
          questionId: q._id,
          videoIndex: i
        }))
      ));
      
      recordedVideos.forEach((video, i) => {
        // Ensure the filename has a .webm extension
        const filename = `question-${i}-${Date.now()}.webm`;
        formData.append('videos', video.blob, filename);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/interview/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let the browser set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const data = await response.json();
      toast.success('Video interview submitted successfully!');
      navigate('/my-interviews');
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

  // Clean up resources when the component unmounts
  useEffect(() => {
    return () => {
      // Ensure we stop recording and release camera/mic permissions
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clean up video URLs
      recordedVideos.forEach(video => {
        if (video.url) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  }, []);

  const questionHasRecording = () => {
    return recordedVideos.some(video => 
      video.questionId === state.questions[currentQuestionIndex]._id
    );
  };

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
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-300">{state.jobTitle}</h1>
          <p className="text-gray-400">Video Interview</p>
          <div className="h-1 w-20 bg-purple-500 rounded mt-2"></div>
        </header>
        
        {/* Progress bar */}
        <div className="mb-8">
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
            
            {/* Question status indicator */}
            <div className="flex items-center justify-center mb-6">
              {questionHasRecording() ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Check size={20} />
                  <span>Response recorded</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Camera size={20} />
                  <span>Record your response</span>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex <= 0 || isRecording}
                className="bg-gray-700 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} className="mr-2" /> Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex >= state.questions.length - 1 || isRecording}
                className="bg-gray-700 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="aspect-video bg-gray-900 rounded-lg mb-6 overflow-hidden relative shadow-lg border border-gray-700">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-full h-full object-cover"
              />
              {!isRecording && !videoRef.current?.srcObject && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <Camera size={48} />
                  <p className="mt-4">Click Record to start your response</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-3 rounded-lg flex items-center shadow-lg"
                >
                  <StopCircle className="w-5 h-5 mr-2" /> Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded-lg flex items-center shadow-lg"
                >
                  <CircleDot className="w-5 h-5 mr-2" /> {questionHasRecording() ? 'Record Again' : 'Record Response'}
                </button>
              )}
            </div>

            {/* Recording status */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recording Status</h3>
                <span className="text-gray-400 text-sm">
                  {recordedVideos.length} of {state.questions.length} responses recorded
                </span>
              </div>
              <div className="mt-2 grid grid-cols-6 md:grid-cols-10 gap-2">
                {state.questions.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-2 rounded-full ${
                      recordedVideos.some(v => v.questionId === state.questions[idx]._id)
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <button
              onClick={submitInterview}
              disabled={loading || recordedVideos.length !== state.questions.length}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                recordedVideos.length === state.questions.length 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              } text-white shadow-lg`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : 'Submit Interview'}
            </button>

            {recordedVideos.length !== state.questions.length && (
              <p className="text-center text-sm text-gray-400 mt-2">
                Please record responses for all questions before submitting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;