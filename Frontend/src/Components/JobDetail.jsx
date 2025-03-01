import React from "react";

const JobDetail = ({ job, onGenerateQuestions, isGenerating }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 animate-fade-in">
      {/* Job Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        {job.jobTitle}
      </h1>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requirements Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 animate-slide-in-left">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Requirements</h2>
          <div className="space-y-3">
            {job.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-300">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 animate-slide-in-right">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Interview Questions</h2>
          <div className="space-y-4">
            {job.questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  question.difficulty === "easy"
                    ? "border-green-400 hover:shadow-green-500/20"
                    : question.difficulty === "medium"
                    ? "border-yellow-400 hover:shadow-yellow-500/20"
                    : "border-red-400 hover:shadow-red-500/20"
                }`}
              >
                <p className="font-semibold text-white">{question.questionText}</p>
                <p className="text-sm text-gray-300 mt-1">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate New Questions Button */}
      <div className="max-w-7xl mx-auto mt-8 text-center animate-fade-in">
        <button
          onClick={onGenerateQuestions}
          disabled={isGenerating} // Disable button when generating
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform ${
            isGenerating ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-indigo-700 hover:scale-105"
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
        </button>
      </div>

      {/* Media Queries for Responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .p-8 {
              padding: 1.5rem;
            }
            .text-4xl {
              font-size: 2rem;
            }
            .text-2xl {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default JobDetail;