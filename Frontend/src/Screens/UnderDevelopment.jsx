import React from "react";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      {/* Main Heading */}
      <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Under Development
      </h1>

      {/* Creative Subheading */}
      <p className="text-2xl text-gray-300 mb-8 animate-slide-in-up">
        Great things are brewing behind the scenes!
      </p>

      {/* Fun Message */}
      <div className="max-w-2xl text-lg text-gray-400 mb-8 animate-slide-in-up">
        <p>
          Our team of digital wizards is hard at work crafting something magical.
          While you wait, why not grab a cup of coffee and imagine all the
          amazing features coming your way?
        </p>
        <p className="mt-4">
          Stay tuned—this page will be ready before you know it!
        </p>
      </div>

      {/* Countdown or Progress Bar (Optional) */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mt-8 animate-slide-in-up">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
          style={{ width: "60%" }} // Adjust width for progress
        ></div>
      </div>

      {/* Fun Emojis */}
      <div className="mt-8 text-4xl animate-bounce">
        🚀✨👨‍💻
      </div>
    </div>
  );
};

export default UnderDevelopment;