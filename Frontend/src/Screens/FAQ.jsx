import React, { useState, useEffect } from "react";

const FAQ = () => {
  // State for expanded FAQ item
  const [expandedIndex, setExpandedIndex] = useState(null);
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  // State for animation
  const [showAnimation, setShowAnimation] = useState(false);

  // FAQ data
  const faqItems = [
    {
      question: "How do I get started?",
      answer: "To get started, simply sign up for an account on AceBoard. Once registered, you can explore our features, such as mock interviews, resume integration, and performance analytics.",
      category: "getting-started"
    },
    {
      question: "How do I contact support?",
      answer: "You can reach out to our support team at support@aceboard.com. We typically respond within 24 hours.",
      category: "support"
    },
    {
      question: "Can I use AceBoard on mobile?",
      answer: "Yes, AceBoard is fully responsive and works seamlessly on both desktop and mobile devices. You can practice mock interviews and track your progress on the go.",
      category: "platform"
    },
    {
      question: "How does the AI-generated feedback work?",
      answer: "Our AI analyzes your responses during mock interviews and provides real-time feedback on your fluency, clarity, and confidence. It also suggests areas for improvement based on industry standards.",
      category: "features"
    },
    {
      question: "What types of interviews does AceBoard support?",
      answer: "AceBoard supports a wide range of interview types, including technical, behavioral, and case interviews. You can customize the interview settings based on your job role and difficulty level.",
      category: "features"
    },
    {
      question: "Can I share my progress with others?",
      answer: "Yes, you can share your progress and interview recordings with mentors, friends, or colleagues for additional feedback and guidance.",
      category: "features"
    },
    {
      question: "How secure is my data on AceBoard?",
      answer: "Your data is encrypted and stored securely. We follow industry-standard security practices to ensure your information is safe and private.",
      category: "security"
    },
    {
      question: "What if I encounter technical issues?",
      answer: "If you experience any technical issues, please contact our support team at support@aceboard.com. We'll assist you in resolving the issue as quickly as possible.",
      category: "support"
    }
  ];

  // Categories for filtering
  const categories = [...new Set(faqItems.map(item => item.category))];

  // Filter FAQs based on search query
  useEffect(() => {
    const results = faqItems.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaqs(results);
  }, [searchQuery]);

  // Animation on component mount
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Toggle the expanded state of an FAQ item
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Reset search and filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilteredFaqs(faqItems);
  };

  // Filter by category
  const filterByCategory = (category) => {
    const results = faqItems.filter(item => item.category === category);
    setFilteredFaqs(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 rounded-full bg-purple-400 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main content container */}
      <div className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header with animated elements */}
        <div className="relative mb-12 md:mb-16">
          <div className="absolute -top-6 left-1/4 w-12 h-12 rounded-full bg-purple-500 opacity-20 blur-xl"></div>
          <div className="absolute top-10 right-1/3 w-20 h-20 rounded-full bg-indigo-400 opacity-10 blur-xl"></div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-center relative z-10 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-gradient">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-gray-400 max-w-2xl mx-auto px-4">
            Find answers to common questions about AceBoard and how it can help you ace your next interview
          </p>
        </div>

        {/* Search and filter section */}
        <div className="max-w-3xl mx-auto mb-8 transition-all duration-700 delay-300 px-4" style={{ transitionDelay: "200ms" }}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions..."
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-6 pl-12 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
            <svg 
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={resetFilters}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button 
              onClick={resetFilters}
              className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${searchQuery ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => filterByCategory(category)}
                className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white transition-all duration-300 capitalize"
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-50 border border-gray-700 transition-all duration-700 delay-500" style={{ transitionDelay: "400ms" }}>
          {(searchQuery ? filteredFaqs : faqItems).length > 0 ? (
            (searchQuery ? filteredFaqs : faqItems).map((item, index) => (
              <div 
                key={index} 
                className={`border-b border-gray-700 last:border-0 transition-all duration-300 ${expandedIndex === index ? 'bg-opacity-50 bg-purple-900' : ''}`}
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full text-left p-6 focus:outline-none flex justify-between items-center group"
                >
                  <div className="flex items-center">
                    <div className={`mr-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${expandedIndex === index ? 'bg-purple-500' : 'bg-gray-700 group-hover:bg-purple-500'} transition-all duration-300`}>
                      <svg 
                        className={`w-4 h-4 text-white transform transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300">{item.question}</h2>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 capitalize">{item.category.replace('-', ' ')}</span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 pl-18 ml-12 text-gray-300 border-l-2 border-purple-500/30">
                    {item.question.includes("contact") || item.question.includes("technical issues") ? (
                      <p>
                        {item.question.includes("contact") ? 
                          "You can reach out to our support team at " :
                          "If you experience any technical issues, please contact our support team at "}
                        <a href="mailto:support@aceboard.com" className="text-purple-400 hover:underline transition-all duration-300">
                          support@aceboard.com
                        </a>
                        {item.question.includes("contact") ? 
                          ". We typically respond within 24 hours." :
                          ". We'll assist you in resolving the issue as quickly as possible."}
                      </p>
                    ) : (
                      <p>{item.answer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p>We couldn't find any FAQs matching your search.</p>
              <button 
                onClick={resetFilters}
                className="mt-4 text-purple-400 hover:text-purple-300 underline"
              >
                Reset search
              </button>
            </div>
          )}
        </div>

        {/* Contact card */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 shadow-xl transition-all duration-700 delay-700" style={{ transitionDelay: "600ms" }}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="bg-purple-500/20 rounded-full inline-flex items-center justify-center p-3 mb-4">
                <svg className="w-6 h-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0.004 3h.001M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Still have questions?</h3>
              <p className="text-gray-300">Get in touch with our team for personalized assistance</p>
            </div>
            <a 
              href="mailto:support@aceboard.com"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="relative z-10">Contact Support</span>
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </a>
          </div>
        </div>

        {/* Quick links section */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 delay-1000 px-4" style={{ transitionDelay: "800ms" }}>
          <div className="bg-gray-800 bg-opacity-30 p-4 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-purple-500/10 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-purple-400 font-medium mb-1">User Guide</h3>
            <p className="text-gray-400 text-sm">Get started with our comprehensive user guide</p>
          </div>
          <div className="bg-gray-800 bg-opacity-30 p-4 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-purple-500/10 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-purple-400 font-medium mb-1">Video Tutorials</h3>
            <p className="text-gray-400 text-sm">Watch step-by-step guides for all features</p>
          </div>
          <div className="bg-gray-800 bg-opacity-30 p-4 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-purple-500/10 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-purple-400 font-medium mb-1">Community</h3>
            <p className="text-gray-400 text-sm">Join discussions with other AceBoard users</p>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default FAQ;