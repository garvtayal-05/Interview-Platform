import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  NavLink, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    age: "",
    role: "normal",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.age) {
      toast.error("All fields are required.");
      return;
    }

    try {
      // Send a POST request to the backend
      const response = await fetch("http://localhost:1564/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend
        toast.error(data.Error || "Signup failed. Please try again.");
      } else {
        // Handle successful signup
        toast.success("Signup successful! You can now log in.");
        // Reset the form
        setFormData({
          name: "",
          email: "",
          password: "",
          gender: "male",
          age: "",
          role: "normal",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="bg-gray-800 shadow-2xl rounded-lg flex flex-col md:flex-row overflow-hidden max-w-5xl w-full relative h-auto md:h-[85vh]">
        
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
        <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-start p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            AceBoard
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 drop-shadow-lg">
            Join the future of professionals.
          </p>
          <button className="mt-4 md:mt-6 border border-white text-white py-1 md:py-2 px-4 md:px-6 rounded-lg hover:bg-white hover:text-purple-600 transition duration-300 font-bold">
             <NavLink to = '/login'> Login</NavLink>
          </button>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-3/5 p-4 md:p-8 relative">
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center drop-shadow-lg">
            Create an Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-200 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Password */}
              <div>
                <label className="block text-gray-200 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-200 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Gender */}
              <div>
                <label className="block text-gray-200 mb-1">Gender</label>
                <select
                  name="gender"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-200 mb-1">Role</label>
                <select
                  name="role"
                  className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300"
            >
              Sign Up
            </button>

            {/* Google Sign Up */}
            <button className="w-full flex items-center justify-center border border-gray-500 py-2 px-4 rounded-lg mt-3 hover:bg-gray-700 transition duration-300">
              <FcGoogle className="text-2xl mr-2" />
              Sign up with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;