import React, { useState } from "react";

const HomePage = () => {
  const [isFeaturesHovered, setIsFeaturesHovered] = useState(false);
  const [isTestimonialsHovered, setIsTestimonialsHovered] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null); // Track selected feature

  // Handle feature click
  const handleFeatureClick = (index) => {
    setSelectedFeature(index);
    // You can add additional logic here, like navigating to a feature page or showing a modal
    console.log(`Feature ${index + 1} clicked!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-fade-in">
            Ace Your Interviews with AceBoard
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in">
            Practice mock interviews, get real-time feedback, and track your progress with our AI-powered Interview Preparation Platform.
          </p>
          <div className="space-x-4 animate-fade-in">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
            <button className="border border-purple-500 text-purple-500 px-8 py-3 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Infinite Features Carousel */}
      <section className="py-16 px-8 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
          Features
        </h2>
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsFeaturesHovered(true)}
          onMouseLeave={() => setIsFeaturesHovered(false)}
        >
          <div
            className={`flex animate-infinite-scroll ${
              isFeaturesHovered ? "animation-paused" : ""
            }`}
          >
            {/* Feature 1 */}
            <div
              className={`flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
                selectedFeature === 0 ? "border-2 border-purple-500" : ""
              }`}
              onClick={() => handleFeatureClick(0)}
            >
              <img
                src="https://via.placeholder.com/400x200" // Replace with your image URL
                alt="AI-Generated Questions"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-4 text-purple-400">AI-Generated Questions</h3>
              <p className="text-gray-300">
                Get personalized interview questions based on your job role and difficulty level.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
                selectedFeature === 1 ? "border-2 border-purple-500" : ""
              }`}
              onClick={() => handleFeatureClick(1)}
            >
              <img
                src="https://via.placeholder.com/400x200" // Replace with your image URL
                alt="Speech-to-Text Analysis"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Speech-to-Text Analysis</h3>
              <p className="text-gray-300">
                Receive real-time feedback on your fluency, clarity, and confidence.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
                selectedFeature === 2 ? "border-2 border-purple-500" : ""
              }`}
              onClick={() => handleFeatureClick(2)}
            >
              <img
                src="https://via.placeholder.com/400x200" // Replace with your image URL
                alt="Resume Integration"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Resume Integration</h3>
              <p className="text-gray-300">
                Upload your resume to get tailored interview questions.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className={`flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
                selectedFeature === 3 ? "border-2 border-purple-500" : ""
              }`}
              onClick={() => handleFeatureClick(3)}
            >
              <img
                src="https://via.placeholder.com/400x200" // Replace with your image URL
                alt="Video Recording"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Video Recording</h3>
              <p className="text-gray-300">
                Record your mock interviews and review them later.
              </p>
            </div>

            {/* Feature 5 */}
            <div
              className={`flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
                selectedFeature === 4 ? "border-2 border-purple-500" : ""
              }`}
              onClick={() => handleFeatureClick(4)}
            >
              <img
                src="https://via.placeholder.com/400x200" // Replace with your image URL
                alt="Performance Analytics"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Performance Analytics</h3>
              <p className="text-gray-300">
                Track your progress with detailed reports and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Testimonials Carousel */}
      <section className="py-16 px-8 bg-gray-800 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
          What Our Users Say
        </h2>
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsTestimonialsHovered(true)}
          onMouseLeave={() => setIsTestimonialsHovered(false)}
        >
          <div
            className={`flex animate-infinite-scroll ${
              isTestimonialsHovered ? "animation-paused" : ""
            }`}
          >
            {/* Testimonial 1 */}
            <div className="flex-shrink-0 w-96 bg-gray-700 p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <p className="text-gray-300 italic">
                "AceBoard helped me ace my interviews! The AI-generated questions and real-time feedback were incredibly useful."
              </p>
              <p className="text-purple-400 font-semibold mt-4">- John Doe, Software Engineer</p>
            </div>

            {/* Testimonial 2 */}
            <div className="flex-shrink-0 w-96 bg-gray-700 p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <p className="text-gray-300 italic">
                "The speech-to-text analysis is a game-changer. It helped me improve my communication skills significantly."
              </p>
              <p className="text-purple-400 font-semibold mt-4">- Jane Smith, Data Analyst</p>
            </div>

            {/* Testimonial 3 */}
            <div className="flex-shrink-0 w-96 bg-gray-700 p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <p className="text-gray-300 italic">
                "I love the resume integration feature. It made my interview preparation so much easier!"
              </p>
              <p className="text-purple-400 font-semibold mt-4">- Alex Johnson, Product Manager</p>
            </div>

            {/* Testimonial 4 */}
            <div className="flex-shrink-0 w-96 bg-gray-700 p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <p className="text-gray-300 italic">
                "The video recording feature is fantastic. I could review my performance and improve over time."
              </p>
              <p className="text-purple-400 font-semibold mt-4">- Sarah Lee, UX Designer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;