import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6V2H8" />
                <path d="M7 10H3L6 17H9" />
                <path d="M15 10H21L18 17H15" />
                <path d="M12 12V22" />
                <path d="M10 16L12 14L14 16" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              AceBoard
            </h2>
          </div>
          <p className="text-gray-400 text-center max-w-md">
            Your ultimate interview preparation platform, designed to help you ace your interviews with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400 border-b border-gray-800 pb-2">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Our Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Careers
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400 border-b border-gray-800 pb-2">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Blog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Tutorials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-purple-400 transition duration-300 flex items-center">
                  <span className="mr-2">•</span> Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400 border-b border-gray-800 pb-2">Connect With Us</h3>
            <div className="space-y-4">
              <p className="text-gray-400">
                Stay updated with our latest features and interview tips.
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Modern Facebook Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                  </svg>
                </a>
                
                {/* Modern Twitter/X Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                
                {/* Modern LinkedIn Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                
                {/* Modern Instagram Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.064A5.135 5.135 0 0117.135 12 5.135 5.135 0 0112 17.135 5.135 5.135 0 016.865 12 5.135 5.135 0 0112 6.865zm0 8.468A3.333 3.333 0 018.667 12 3.333 3.333 0 0112 8.667 3.333 3.333 0 0115.333 12 3.333 3.333 0 0112 15.333zm6.535-8.668a1.2 1.2 0
                    0 10-1.2 1.199 1.2 1.2 0 001.2 1.2 1.2 1.2 0 001.2-1.2 1.2 1.2 0 00-1.2-1.2z" />
                  </svg>
                </a>
                
                {/* Modern GitHub Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                
                {/* Modern Discord Icon */}
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-all duration-300 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.39-.444.872-.608 1.26a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.26.077.077 0 00-.079-.036A19.4 19.4 0 003.677 4.49a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 19.594 19.594 0 005.919 2.98.078.078 0 00.084-.028 13.96 13.96 0 001.226-1.994.076.076 0 00-.041-.106 12.932 12.932 0 01-1.84-.878.077.077 0 01-.008-.128 9.79 9.79 0 00.818-.617.074.074 0 01.077-.01c3.927 1.789 8.18 1.789 12.061 0a.074.074 0 01.078.01c.26.223.546.434.818.617a.077.077 0 01-.006.127 12.094 12.094 0 01-1.841.879.077.077 0 00-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.542 19.542 0 005.922-2.98.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 00-.031-.028zM8.02 15.278c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AceBoard. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-purple-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-purple-400 transition duration-300">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-purple-400 transition duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;