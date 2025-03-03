// screens/ExplorePage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeatureCard from "../Components/FeatureCard";
import { features } from "../data";
import { motion } from "framer-motion";

const ExplorePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState(features);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract feature ID from URL if present
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3 && pathParts[1] === "features") {
      const featureId = parseInt(pathParts[2]);
      setSelectedFeature(featureId);
    }
  }, [location]);

  // Filter features based on search term
  useEffect(() => {
    const results = features.filter(feature =>
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeatures(results);
  }, [searchTerm]);

  const handleFeatureClick = (featureId) => {
    setSelectedFeature(featureId);
    console.log(`Feature ${featureId} clicked!`);
    navigate(`/features/${featureId}`);
  };

  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 rounded-full bg-purple-400 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Explore Features
      </h1>
      
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <input
          type="text"
          placeholder="Search features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Feature categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button 
          onClick={() => setFilteredFeatures(features)}
          className={`px-4 py-2 rounded-full ${filteredFeatures.length === features.length ? 'bg-indigo-600' : 'bg-gray-700'} hover:bg-indigo-500 transition-colors`}
        >
          All
        </button>
        {Array.from(new Set(features.map(f => f.category))).map(category => (
          <button
            key={category}
            onClick={() => setFilteredFeatures(features.filter(f => f.category === category))}
            className={`px-4 py-2 rounded-full ${filteredFeatures.length !== features.length && filteredFeatures[0]?.category === category ? 'bg-indigo-600' : 'bg-gray-700'} hover:bg-indigo-500 transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feature cards with animation */}
      {filteredFeatures.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredFeatures.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <FeatureCard
                feature={feature}
                onClick={handleFeatureClick}
                isSelected={selectedFeature === feature.id}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No features found matching "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all opacity-80 hover:opacity-100"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
};

export default ExplorePage;