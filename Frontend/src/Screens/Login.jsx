import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom"; // For navigation
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
// import apiRequest from "../Utils/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate form data
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Send a POST request to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      // const data = await apiRequest('/user/login', 'POST', formData);
      // console.log(data.token)

      if (!response.ok) {
        // Handle errors from the backend
        throw new Error(data.Error || "Login failed. Please try again.");
      }

      // Handle successful login
      toast.success("Login successful! Redirecting...");
      localStorage.setItem("token", data.token); // Store the token
      setTimeout(() => {
        navigate("/jobs"); // Redirect to the jobs page after toast is shown
      }, 2000); // Wait for 2 seconds before navigating
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
  const decoded = jwtDecode(credentialResponse.credential); // contains name, email, sub
  console.log("Google User:", decoded);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.Error || "Google login failed");

    toast.success("Login successful!");
    localStorage.setItem("token", data.token);
    navigate("/jobs");
  } catch (err) {
    toast.error(err.message || "Login error");
  }
};
const handleGoogleError = () => {
  toast.error("Google login failed");
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="bg-gray-800 shadow-2xl rounded-lg flex flex-col md:flex-row overflow-hidden max-w-5xl w-full relative h-auto md:h-[85vh]" >
        {/* Triangle Shape Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#9333ea", stopOpacity: 1 }} /> {/* purple-600 */}
                <stop offset="100%" style={{ stopColor: "#4f46e5", stopOpacity: 1 }} /> {/* indigo-600 */}
              </linearGradient>
            </defs>
            <polygon points="0,0 60,0 0,100" fill="url(#triangleGradient)"></polygon>
          </svg>
        </div>

        {/* Left Side - Branding Section */}
        <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-start p-4 md:p-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            AceBoard
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 drop-shadow-lg max-w-[80%]">
            Welcome back! Log in to continue.
          </p>
          <NavLink
            to="/signup"
            className="mt-4 md:mt-6 border border-white text-white py-1 md:py-2 px-4 md:px-6 rounded-lg hover:bg-white hover:text-purple-600 transition duration-300 font-bold"
          >
            Sign Up Instead
          </NavLink>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-3/5 p-4 md:p-8 relative">
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center drop-shadow-lg animate-fade-in">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            {/* Email */}
            <div className="animate-slide-in-left">
              <label className="block text-gray-200 mb-1 font-bold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="animate-slide-in-right">
              <label className="block text-gray-200 mb-1 font-bold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg transition duration-300 animate-fade-in ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Google Login
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-500 py-2 px-4 rounded-lg mt-3 hover:bg-gray-700 transition duration-300 animate-fade-in"
            >
              <FcGoogle className="text-2xl mr-2" />
              Log in with Google
            </button> */}

            <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap // optional, for one-tap popup login
      />

            {/* Forgot Password */}
            <p className="text-center text-gray-300 mt-3 animate-fade-in">
              Forgot password?{" "}
              <NavLink to="/forgot-password" className="text-purple-400 hover:underline">
                Reset it
              </NavLink>
            </p>
          </form>
        </div>
      </div>

      {/* Media Queries for Responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .bg-gray-800 {
              height: auto;
            }
            .flex-col {
              flex-direction: column;
            }
            .w-full {
              width: 100%;
            }
            .p-4 {
              padding: 1rem;
            }
            .space-y-3 {
              margin-top: 0.75rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;