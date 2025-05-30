import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icon Components
const VideoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const JobDetail = ({ job, onGenerateQuestions, isGenerating, onApplyJob }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAppliedJobsPage = location.pathname.includes('applied-jobs');
  
  const [interviewDate, setInterviewDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMockOptions, setShowMockOptions] = useState(false);

  const handleApplyJob = () => {
    if (!interviewDate) {
      alert("Please select an interview date.");
      return;
    }
    onApplyJob(interviewDate);
    setShowCalendar(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-8">
      {/* Header with enhanced styling */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 animate-pulse">
            {job.jobTitle}
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
        </h1>
      </div>

      {/* Main Content Grid with enhanced shadows and effects */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Requirements Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
            Requirements
          </h2>
          <div className="space-y-3">
            {job.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start group">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions Section with improved cards */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.15)] p-6 border border-gray-700/50">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
            Interview Questions
          </h2>
          <div className="space-y-4">
            {job.questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:translate-x-1 ${
                  question.difficulty === "easy"
                    ? "border-green-400 hover:shadow-[0_5px_15px_rgba(74,222,128,0.2)]"
                    : question.difficulty === "medium"
                    ? "border-yellow-400 hover:shadow-[0_5px_15px_rgba(250,204,21,0.2)]"
                    : "border-red-400 hover:shadow-[0_5px_15px_rgba(248,113,113,0.2)]"
                }`}
              >
                <p className="font-semibold text-white">{question.questionText}</p>
                <br />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-300">
                    Difficulty:{" "}
                    <span
                      className={`font-semibold ${
                        question.difficulty === "easy"
                          ? "text-green-400"
                          : question.difficulty === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </p>
                  <div className={`h-1 w-16 rounded-full ${
                    question.difficulty === "easy"
                      ? "bg-gradient-to-r from-green-500 to-green-300"
                      : question.difficulty === "medium"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-300"
                      : "bg-gradient-to-r from-red-500 to-red-300"
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons Section with improved styling */}
      <div className="max-w-7xl mx-auto mt-8 text-center space-y-6">
        {/* Generate New Questions Button */}
        <button
          onClick={onGenerateQuestions}
          disabled={isGenerating}
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 ${
            isGenerating ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1"
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <span>Generating...</span>
              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            "Generate New Questions"
          )}
        </button><br/>

        {/* Conditional Button Section */}
        {isAppliedJobsPage ? (
          /* Mock Interview Button */
          <button
            onClick={() => setShowMockOptions(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:from-green-700 hover:to-teal-700 hover:-translate-y-1"
          >
            Give Mock Interview
          </button>
        ) : (
          /* Apply Job Flow */
          <div className="space-y-4">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:from-green-700 hover:to-teal-700 hover:-translate-y-1"
            >
              Apply for this Job
            </button>

            {showCalendar && (
              <div className="mt-6 p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 max-w-md mx-auto shadow-[0_10px_20px_rgba(79,70,229,0.15)]">
                <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center justify-center">
                  <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                  Select Interview Date
                </h3>
                <DatePicker
                  selected={interviewDate}
                  onChange={(date) => setInterviewDate(date)}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  wrapperClassName="mb-4"
                />
                <button
                  onClick={handleApplyJob}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-700 hover:-translate-y-1 w-full"
                >
                  Confirm Application
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mock Interview Options Modal */}
      {showMockOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-400">
              Mock Interview Options
            </h3>
            
            <div className="space-y-4">
              {/* Video Interview Option */}
              <button
                onClick={() => navigate('/mock-interview/video', { 
                  state: { 
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    questions: job.questions 
                  }
                })}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg flex flex-col items-center hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                <VideoIcon className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">Video Interview</span>
                <p className="text-sm text-gray-300 mt-1">
                  Record your answers with webcam
                </p>
              </button>

              {/* Text Interview Option */}
              <button
                onClick={() => navigate('/mock-interview/text', { 
                  state: { 
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    questions: job.questions 
                  }
                })}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg flex flex-col items-center hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <TextIcon className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">Text Interview</span>
                <p className="text-sm text-gray-300 mt-1">
                  Type your answers to questions
                </p>
              </button>

              <button
                onClick={() => setShowMockOptions(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;