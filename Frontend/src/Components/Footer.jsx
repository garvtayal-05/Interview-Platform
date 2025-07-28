import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto border-t border-gray-700">
      <div className="max-w-4xl mx-auto px-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Tagline */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-1.5 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6V2H8" />
                <path d="M7 10H3L6 17H9" />
                <path d="M15 10H21L18 17H15" />
                <path d="M12 12V22" />
                <path d="M10 16L12 14L14 16" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                AceBoard
              </h2>
              <p className="text-gray-400 text-xs">
                Your ultimate interview preparation platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6 text-sm">
              <Link to="/about-us" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                About Us
              </Link>
              <Link to="/contact-us" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                Contact Us
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                FAQ
              </Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                Privacy Policy
              </Link>
            </div>

            {/* Social Media */}
            <a 
              // href="https://www.linkedin.com/company/aceboard" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-purple-300 transition-all duration-300 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.04-1.852-3.04-1.854 0-2.137 1.444-2.137 2.938v5.671h-3.554v-11.5h3.414v1.568h.049c.476-.901 1.638-1.852 3.371-1.852 3.604 0 4.27 2.367 4.27 5.451v6.333zm-14.357-13.13a2.067 2.067 0 11.002-4.135 2.067 2.067 0 01-.002 4.135zm1.777 13.13h-3.557v-11.5h3.557v11.5zm14.358-20.452h-17.998c-.88 0-1.6.72-1.6 1.6v20.8c0 .88.72 1.6 1.6 1.6h18c.88 0 1.6-.72 1.6-1.6v-20.8c0-.88-.72-1.6-1.602-1.6z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-4 pt-3">
          <p className="text-center text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} AceBoard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;