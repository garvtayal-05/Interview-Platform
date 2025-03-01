// components/FeatureCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ feature, onClick, isSelected }) => {
  const navigate = useNavigate();

  // Handle feature click
  const handleClick = () => {
    if (onClick) {
      onClick(feature.id); // Trigger the parent's onClick handler
    } else {
      // Navigate to a feature-specific page
      navigate(`/features/${feature.id}`);
    }
  };

  return (
    <div
      className={`w-80 bg-gray-800 p-6 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer ${
        isSelected ? "border-2 border-purple-500" : ""
      }`}
      onClick={handleClick}
    >
      <img
        src={`/Images/${feature.image}`} // Replace with your image URL
        alt={feature.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold mb-4 text-purple-400">{feature.title}</h3>
      <p className="text-gray-300">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;