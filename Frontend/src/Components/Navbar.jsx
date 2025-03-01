import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [userRole, setUserRole] = useState(null); // State for user role
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const dropdownRef = useRef(null); // Ref for dropdown
  const location = useLocation(); // Get current location

  // Check token validity and role on component mount or URL change
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging: Log decoded token

        // Ensure the role is extracted correctly
        const role = decodedToken.role || decodedToken.user?.role; // Adjust based on token structure
        setUserRole(role); // Set user role
        setIsLoggedIn(true); // Set login status to true

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token"); // Remove expired token
          setIsLoggedIn(false); // Set login status to false
          setUserRole(null); // Clear user role
          toast.error("Your session has expired. Please log in again.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Remove invalid token
        setIsLoggedIn(false); // Set login status to false
        setUserRole(null); // Clear user role
        toast.error("Invalid token. Please log in again.");
      }
    } else {
      setIsLoggedIn(false); // Set login status to false
      setUserRole(null); // Clear user role
    }
  }, [location]); // Re-run useEffect when location changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Set login status to false
    setUserRole(null); // Clear user role
    window.location.reload(); // Refresh the page
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-purple-400">
          AceBoard
        </NavLink>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <NavLink
            to="/"
            className="hover:text-purple-400 transition duration-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className="hover:text-purple-400 transition duration-300"
          >
            Jobs
          </NavLink>
          <NavLink
            to="/explore"
            className="hover:text-purple-400 transition duration-300"
          >
            Explore
          </NavLink>
          {userRole === "admin" && (
            <NavLink
              to="/jobs/create"
              className="hover:text-purple-400 transition duration-300"
            >
              Create Job
            </NavLink>
          )}
          <NavLink
            to="/profile"
            className="hover:text-purple-400 transition duration-300"
          >
            Profile
          </NavLink>

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-purple-400 transition duration-300 focus:outline-none"
            >
              More ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute top-10 left-0 bg-gray-800 rounded-lg shadow-2xl w-48 z-50">
                <NavLink
                  to="/about-us"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/contact-us"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                >
                  Contact Us
                </NavLink>
                <NavLink
                  to="/faq"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                >
                  FAQ
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Login/Logout and Register Buttons */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            // Show Logout button if logged in
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            // Show Login and Register buttons if not logged in
            <>
              <NavLink
                to="/login"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;