import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Contact Us
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Contact Information */}
        <div className="mb-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Get in Touch</h2>
            <p className="text-gray-300 text-lg mb-6">
              We'd love to hear from you. Reach out for questions, feedback, or collaborations.
            </p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-lg">
                    <span className="text-purple-400 font-semibold">Email:</span>{" "}
                    <a href="mailto:hello.aceboard@gmail.com" className="hover:text-purple-300 transition-colors">
                      hello.aceboard@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-lg mb-2">
                    <span className="text-purple-400 font-semibold">Address:</span>
                  </p>
                  <div className="text-gray-300 text-base leading-relaxed">
                    <p>Born in TG-402.</p>
                    <p>Built in Magellan-512.</p>
                    <p className="text-purple-300 font-medium">Made for impact.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="h-full bg-gray-700 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-6">Our Vision</h3>
                <div className="space-y-3">
                  <p className="text-gray-300 text-lg">Empowering careers</p>
                  <p className="text-gray-300 text-lg">through innovation</p>
                  <p className="text-purple-300 font-medium">Excellence in every opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Connect With Us</h2>
          <p className="text-gray-300 text-lg mb-6">
            Stay updated with our latest features and career insights.
          </p>
          <div className="flex space-x-6">
            <a
              // href="https://linkedin.com/company/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
