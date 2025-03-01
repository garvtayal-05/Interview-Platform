// screens/ExplorePage.js
import React, { useState } from "react";
import FeatureCard from "../Components/FeatureCard";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const navigate = useNavigate();

  // Sample feature data
  const features = [
    {
      id: 1,
      title: "AI-Generated Questions",
      description: "Get personalized interview questions based on your job role and difficulty level.",
      image: 'Interview_ques.jpg',
    },
    {
      id: 2,
      title: "Speech-to-Text Analysis",
      description: "Receive real-time feedback on your fluency, clarity, and confidence.",
      image: "https://via.placeholder.com/400x200",
    },
    {
      id: 3,
      title: "Resume Integration",
      description: "Upload your resume to get tailored interview questions.",
      image: "https://via.placeholder.com/400x200",
    },
    {
      id: 4,
      title: "Video Recording",
      description: "Record your mock interviews and review them later.",
      image: "https://via.placeholder.com/400x200",
    },
    {
      id: 5,
      title: "Performance Analytics",
      description: "Track your progress with detailed reports and insights.",
      image: "https://via.placeholder.com/400x200",
    },
  ];

  // Handle feature click
  const handleFeatureClick = (featureId) => {
    setSelectedFeature(featureId);
    console.log(`Feature ${featureId} clicked!`);
    // Navigate to a feature-specific page
    navigate(`/features/${featureId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Explore Features
      </h1>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onClick={handleFeatureClick}
            isSelected={selectedFeature === feature.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;