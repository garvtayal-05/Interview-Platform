import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Briefcase,
  Home,
  Compass,
  FileText,
  Settings,
  MessageSquare,
} from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // Check token validity and role on component mount or URL change
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const role = decodedToken.role || decodedToken.user?.role;
        setUserRole(role);
        setIsLoggedIn(true);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserRole(null);
          toast.error("Your session has expired. Please log in again.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserRole(null);
        toast.error("Invalid token. Please log in again.");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location]);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-2 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6V2H8"></path>
                <path d="M7 10H3L6 17H9"></path>
                <path d="M15 10H21L18 17H15"></path>
                <path d="M12 12V22"></path>
                <path d="M10 16L12 14L14 16"></path>
              </svg>
            </div>
            AceBoard
          </NavLink>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-purple-400" />
              ) : (
                <Menu className="h-6 w-6 text-purple-400" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-purple-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                } transition duration-300 flex items-center`
              }
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-purple-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                } transition duration-300 flex items-center`
              }
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Jobs
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-purple-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                } transition duration-300 flex items-center`
              }
            >
              <Compass className="h-4 w-4 mr-1" />
              Explore
            </NavLink>
            {/* New Community Forum Button */}
            <NavLink
              to="/community-form"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-purple-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                } transition duration-300 flex items-center`
              }
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Community Forum
            </NavLink>
            {userRole === "admin" && (
              <NavLink
                to="/jobs/create"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <FileText className="h-4 w-4 mr-1" />
                Create Job
              </NavLink>
            )}
            {userRole === "admin" && (
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <FileText className="h-4 w-4 mr-1" />
                Job Applications
              </NavLink>
            )}
            {userRole === "normal" && (
              <NavLink
                to="/applied-jobs"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Briefcase className="h-4 w-4 mr-1" />
                Applied Jobs
              </NavLink>
            )}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-purple-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                } transition duration-300 flex items-center`
              }
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </NavLink>
            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition duration-300 flex items-center"
              >
                More
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {userRole === "admin" && (
                    <NavLink
                      to="/interview-list"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                    >
                      Received Interviews
                    </NavLink>
                  )}
                  {userRole === "normal" && (
                    <NavLink
                      to="/my-interviews"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                    >
                      My Interviews
                    </NavLink>
                  )}
                  <NavLink
                    to="/about-us"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to="/contact-us"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                  >
                    Contact Us
                  </NavLink>
                  <NavLink
                    to="/faq"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition duration-300"
                  >
                    FAQ
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-300 shadow-md hover:shadow-purple-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300 shadow-md"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md transition duration-300 shadow-md"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden mt-3 pb-3 border-t border-gray-700"
          >
            <div className="pt-2 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Jobs
              </NavLink>

              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Compass className="h-5 w-5 mr-2" />
                Explore
              </NavLink>

              {/* New Community Forum Button - Mobile */}
              <NavLink
                to="/community-form"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Community Forum
              </NavLink>

              {userRole === "admin" && (
                <NavLink
                  to="/jobs/create"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-gray-800 text-purple-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    } transition duration-300 flex items-center`
                  }
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Create Job
                </NavLink>
              )}

              {userRole === "admin" && (
                <NavLink
                  to="/applications"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-gray-800 text-purple-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    } transition duration-300 flex items-center`
                  }
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Job Applications
                </NavLink>
              )}

              {userRole === "normal" && (
                <NavLink
                  to="/applied-jobs"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-gray-800 text-purple-400"
                        : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    } transition duration-300 flex items-center`
                  }
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Applied Jobs
                </NavLink>
              )}

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </NavLink>

              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Settings className="h-5 w-5 mr-2" />
                About Us
              </NavLink>

              <NavLink
                to="/contact-us"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Settings className="h-5 w-5 mr-2" />
                Contact Us
              </NavLink>

              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-gray-800 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                  } transition duration-300 flex items-center`
                }
              >
                <Settings className="h-5 w-5 mr-2" />
                FAQ
              </NavLink>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300 text-center"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md transition duration-300 text-center"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
