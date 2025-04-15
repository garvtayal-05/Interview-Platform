import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    age: "",
    role: "normal",
  });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.age) {
      toast.error("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    // Check password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      toast.error("Please fix password validation errors");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.Error || "Signup failed. Please try again.");
        setIsSubmitting(false);
      } else {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="bg-gray-800 shadow-2xl rounded-lg flex flex-col md:flex-row overflow-hidden max-w-5xl w-full relative h-auto md:min-h-[85vh]">
        
        {/* Triangle Shape Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#9333ea", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#4f46e5", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <polygon points="0,0 60,0 0,100" fill="url(#triangleGradient)"></polygon>
          </svg>
        </div>

        {/* Left Side - Branding Section */}
        <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-start p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            AceBoard
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 drop-shadow-lg">
            Join the future of professionals.
          </p>
          <NavLink
            to="/login"
            className="mt-4 md:mt-6 border border-white text-white py-2 px-6 rounded-lg hover:bg-white hover:text-purple-600 transition duration-300 font-bold"
          >
            Login
          </NavLink>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-3/5 p-6 md:p-8 relative overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center drop-shadow-lg mb-6">
            Create an Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-200 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-gray-200 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                    passwordErrors.length > 0 ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {passwordErrors.length > 0 && (
                  <div className="mt-1 text-red-400 text-sm">
                    <ul className="list-disc pl-4">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-200 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <label className="block text-gray-200 mb-2">Gender</label>
                <select
                  name="gender"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-200 mb-2">Role</label>
                <select
                  name="role"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="normal">Normal</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Password Requirements */}
            {/* <div className="bg-gray-700 p-3 rounded-lg text-sm text-gray-300">
              <h3 className="font-medium mb-1">Password Requirements:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li className={formData.password.length >= 8 ? "text-green-400" : ""}>At least 8 characters long</li>
                <li className={/[A-Z]/.test(formData.password) ? "text-green-400" : ""}>Contains at least one uppercase letter</li>
                <li className={/[a-z]/.test(formData.password) ? "text-green-400" : ""}>Contains at least one lowercase letter</li>
                <li className={/[0-9]/.test(formData.password) ? "text-green-400" : ""}>Contains at least one number</li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-green-400" : ""}>Contains at least one special character</li>
              </ul>
            </div> */}

            {/* Buttons Container */}
            <div className="space-y-3 pt-2">
              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center my-2">
                <div className="border-t border-gray-600 flex-grow"></div>
                <span className="px-3 text-gray-400 text-sm">OR</span>
                <div className="border-t border-gray-600 flex-grow"></div>
              </div>

              {/* Google Sign Up */}
              <button 
                type="button"
                className="w-full flex items-center justify-center border border-gray-500 py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                <FcGoogle className="text-xl mr-2" />
                Sign up with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;