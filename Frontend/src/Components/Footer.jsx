import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">About AceBoard</h3>
            <p className="text-gray-400">
              AceBoard is your ultimate interview preparation platform, designed to help you ace your interviews with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Quick Links</h3>
            <ul className="text-gray-400">
              <li className="mb-2">
                <Link to="/" className="hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/features" className="hover:text-purple-400">
                  Features
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about-us" className="hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact-us" className="hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="/facebook" className="text-gray-400 hover:text-purple-400">
                Facebook
              </Link>
              <Link to="/twitter" className="text-gray-400 hover:text-purple-400">
                Twitter
              </Link>
              <Link to="/linkedin" className="text-gray-400 hover:text-purple-400">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
        <p className="text-gray-400 mt-8 text-center">
          &copy; {new Date().getFullYear()} AceBoard. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;