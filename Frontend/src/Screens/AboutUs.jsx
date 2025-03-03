import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      {/* Header with subtle animation */}
      <div className="relative mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center py-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          About Us
        </h1>
        <div className="absolute w-16 h-1 bg-purple-400 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"></div>
      </div>

      {/* Main content with improved card layout */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-10 border-b border-gray-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AceBoard</span></h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Your ultimate AI-powered interview preparation platform. We are a team of passionate developers, career coaches, and AI enthusiasts dedicated to helping you succeed in your job interviews.
          </p>
        </div>

        {/* Content sections with improved layout */}
        <div className="p-6 md:p-10">
          {/* Mission & Vision in grid for larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Mission */}
            <div className="bg-gray-850 bg-opacity-50 p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-400 bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-purple-400">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Our mission is to empower job seekers with the tools and confidence they need to ace their interviews. We believe that everyone deserves the opportunity to showcase their skills and land their dream job.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gray-850 bg-opacity-50 p-6 rounded-xl hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-400 bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-purple-400">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We envision a world where job interviews are no longer a source of stress but an opportunity to shine. By leveraging cutting-edge AI technology, we aim to revolutionize the way people prepare for interviews.
              </p>
            </div>
          </div>

          {/* Values with improved layout */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-400 bg-opacity-20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-400">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <span className="text-purple-400 font-semibold text-lg mr-2">Innovation:</span>
                <span className="text-gray-300">We constantly innovate to provide the best tools for interview preparation.</span>
              </div>
              <div className="flex p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <span className="text-purple-400 font-semibold text-lg mr-2">Empathy:</span>
                <span className="text-gray-300">We understand the challenges job seekers face and strive to make their journey easier.</span>
              </div>
              <div className="flex p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <span className="text-purple-400 font-semibold text-lg mr-2">Excellence:</span>
                <span className="text-gray-300">We are committed to delivering high-quality, reliable, and user-friendly solutions.</span>
              </div>
              <div className="flex p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <span className="text-purple-400 font-semibold text-lg mr-2">Community:</span>
                <span className="text-gray-300">We believe in building a supportive community where users can learn and grow together.</span>
              </div>
            </div>
          </div>

          {/* Team section with cards */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-400 bg-opacity-20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-400">Meet Our Team</h2>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <p className="text-gray-300 text-lg leading-relaxed">
                Our team is made up of talented individuals who are passionate about technology and career development. From AI engineers to UX designers, we work together to create a seamless and effective platform for our users.
              </p>
            </div>
          </div>

          {/* Call to Action with improved button */}
          <div className="text-center py-8 px-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Join Us on This Journey</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a job seeker, a career coach, or an employer, we invite you to join us in transforming the interview preparation process. Together, we can make interviews less stressful and more successful.
            </p>
            <a
              href="/signup"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;