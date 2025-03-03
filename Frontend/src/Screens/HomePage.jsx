import React, { useState, useEffect } from "react";
import FeatureCard from "../Components/FeatureCard";
import { features, testimonials } from "../data";
import { NavLink } from "react-router-dom";
import { ChevronDown, Star, ArrowRight } from "lucide-react";

const HomePage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [isFeaturesHovered, setIsFeaturesHovered] = useState(false);
  const [isTestimonialsHovered, setIsTestimonialsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Array of hero images
  const heroImages = [
    "/Images/hero1.jpg",
    "/Images/hero2.jpg",
    "/Images/hero3.jpg",
    "/Images/hero4.jpg",
    "/Images/hero5.jpg",
    "/Images/hero7.jpg",
    "/Images/hero8.jpg",
    "/Images/hero9.jpg",
    "/Images/hero10.jpg",
    "/Images/hero11.jpg",
    "/Images/hero12.jpg",
    "/Images/hero13.jpg",
    "/Images/hero14.jpg",
  ];

  // Scroll to top on component mount with animation effect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    
    // Add loading animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  useEffect(() => {
    // Select a random image from the heroImages array  
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    const selectedImage = heroImages[randomIndex];
    console.log("Selected Hero Image Path:", selectedImage);

    // Check if the image exists
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      console.log("Image loaded successfully:", selectedImage);
      setHeroImage(selectedImage);
    };
    img.onerror = () => {
      console.error("Failed to load hero image:", selectedImage);
      setHeroImage(null);
    };
  }, []);

  const handleFeatureClick = (featureId) => {
    setSelectedFeature(featureId);
    console.log(`Feature ${featureId} clicked!`);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-4 group overflow-hidden">
        {/* Background Image with Blur Effect (only if image is loaded) */}
        {heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImage}
              alt="Hero Background"
              className="w-full h-full object-cover transition-all duration-500 "
            />
          </div>
        )}

        {/* Overlay (always visible, with solid background if no image) */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            heroImage
              ? "bg-black/40 group-hover:bg-black/60 group-hover:backdrop-blur-md transition-all duration-500"
              : "bg-gradient-to-br from-purple-900 to-indigo-900"
          }`}
        />

        {/* Content Container */}
        <div className={`relative z-10 text-center max-w-4xl px-6 transition-all duration-500 transform ${
          heroImage ? "opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0" : "opacity-100"
        }`}>
          {/* Animated Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 rounded-full backdrop-blur-sm animate-pulse">
            <span className="flex items-center text-sm font-medium">
              <Star className="w-4 h-4 mr-2" /> AI-Powered Interview Preparation
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white bg-clip-text leading-tight">
            Ace Your Interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AceBoard</span>
          </h1>
          
          {/* Paragraph */}
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Practice mock interviews, get real-time feedback, and track your
            progress with our AI-powered Interview Preparation Platform.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Get Started Button */}
            <NavLink to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg border-2 border-transparent hover:from-purple-700 hover:to-indigo-700 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                Get Started
              </button>
            </NavLink>
            
            {/* Learn More Button */}
            <NavLink to="/explore" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-lg">
                Learn More
              </button>
            </NavLink>
          </div>
        </div>
        
        {/* Initial Overlay Message (only when hero image exists) */}
        {/* {heroImage && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
            <div className="text-white text-2xl font-bold bg-black/20 p-6 rounded-lg backdrop-blur-sm">
              Hover to explore AceBoard
            </div>
          </div>
        )} */}
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToFeatures}>
          <ChevronDown className="w-10 h-10 text-white/70 hover:text-white transition-colors" />
        </div>
      </section>

      {/* Infinite Features Carousel */}
      <section id="features-section" className="py-20 px-8 overflow-hidden relative">
        {/* Background Orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative">
          <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
            Key Features
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Designed to help you prepare for any interview scenario with advanced AI technology.
          </p>
          
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
              {/* Map through features data */}
              {features.map((feature) => (
                <div key={feature.id} className="flex-shrink-0 w-80 mx-4">
                  <FeatureCard
                    feature={feature}
                    onClick={handleFeatureClick}
                    isSelected={selectedFeature === feature.id}
                  />
                </div>
              ))}
              {/* Duplicate features for seamless looping */}
              {features.map((feature) => (
                <div
                  key={`duplicate-${feature.id}`}
                  className="flex-shrink-0 w-80 mx-4"
                >
                  <FeatureCard
                    feature={feature}
                    onClick={handleFeatureClick}
                    isSelected={selectedFeature === feature.id}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* View All Features Link */}
          <div className="text-center mt-12">
            <NavLink to="/explore" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
              View All Features <ArrowRight className="ml-2 w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Improved styling */}
      <section className="py-20 px-8 bg-gray-800/70 overflow-hidden relative">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative">
          <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
            What Our Users Say
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of successful job seekers who improved their interview skills with AceBoard.
          </p>
          
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
              {/* Map through testimonials data */}
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-96 bg-gray-700/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border border-gray-600/30"
                >
                  {/* Quotation Mark */}
                  <div className="text-purple-500 text-4xl opacity-30 mb-4">"</div>
                  
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-600/30 flex items-center">
                    {/* User Avatar (if available) */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    
                    <div>
                      <p className="text-purple-400 font-semibold">
                        {testimonial.name}
                      </p>
                      {testimonial.role && (
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate testimonials for seamless looping */}
              {testimonials.map((testimonial) => (
                <div
                  key={`duplicate-${testimonial.id}`}
                  className="flex-shrink-0 w-96 bg-gray-700/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl mx-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border border-gray-600/30"
                >
                  {/* Quotation Mark */}
                  <div className="text-purple-500 text-4xl opacity-30 mb-4">"</div>
                  
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-600/30 flex items-center">
                    {/* User Avatar (if available) */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    
                    <div>
                      <p className="text-purple-400 font-semibold">
                        {testimonial.name}
                      </p>
                      {testimonial.role && (
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="inline-block p-8 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Ready to Ace Your Next Interview?</h3>
              <p className="text-gray-300 mb-6 max-w-lg">
                Join thousands of job seekers who are using AceBoard to prepare for their dream jobs.
              </p>
              <NavLink to="/signup">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg border-2 border-transparent hover:from-purple-700 hover:to-indigo-700 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started Today
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;