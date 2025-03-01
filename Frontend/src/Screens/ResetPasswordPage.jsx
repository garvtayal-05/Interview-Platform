import React, { useState } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To disable the button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button

    // Validate form data
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required.");
      setIsSubmitting(false); // Re-enable the button
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsSubmitting(false); // Re-enable the button
      return;
    }

    try {
      // Step 1: Get the reset token for the email
      const tokenResponse = await fetch("http://localhost:1564/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        toast.error(tokenData.error || "Failed to initiate password reset.");
        setIsSubmitting(false); // Re-enable the button
        return;
      }

      const resetToken = tokenData.resetToken;

      // Step 2: Use the reset token to update the password
      const resetResponse = await fetch("http://localhost:1564/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          resettoken: resetToken, // Pass the reset token in the headers
        },
        body: JSON.stringify({ newPassword: formData.newPassword }),
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        toast.error(resetData.Error || "Failed to reset password.");
        setIsSubmitting(false); // Re-enable the button
        return;
      }

      // Success
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to the login page after toast is shown
      }, 3000); // Wait for 3 seconds before navigating
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
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
        <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-start p-4 md:p-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            AceBoard
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 drop-shadow-lg max-w-[80%]">
            Reset your password to continue.
          </p>
          <NavLink
            to="/login"
            className="mt-4 md:mt-6 border border-white text-white py-1 md:py-2 px-4 md:px-6 rounded-lg hover:bg-white hover:text-purple-600 transition duration-300 font-bold"
          >
            Back to Login
          </NavLink>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="w-full md:w-3/5 p-4 md:p-8 relative">
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center drop-shadow-lg animate-fade-in">
            Reset Password
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
              />
            </div>

            {/* New Password */}
            <div className="animate-slide-in-right">
              <label className="block text-gray-200 mb-1 font-bold">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="animate-slide-in-left">
              <label className="block text-gray-200 mb-1 font-bold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-3 md:px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 animate-fade-in ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
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

export default ResetPasswordPage;