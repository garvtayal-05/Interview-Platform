import React, { useState } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
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

    if (name === "newPassword") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    // Check password validation
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      toast.error("Please fix password validation errors");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Get the reset token for the email
      const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        toast.error(tokenData.error || "Failed to initiate password reset.");
        setIsSubmitting(false);
        return;
      }

      const resetToken = tokenData.resetToken;

      // Step 2: Use the reset token to update the password
      const resetResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          resettoken: resetToken,
        },
        body: JSON.stringify({ newPassword: formData.newPassword }),
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        toast.error(resetData.Error || "Failed to reset password.");
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
        <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-start p-8 md:p-10 animate-fade-in">
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
        <div className="w-full md:w-3/5 p-6 md:p-8 relative overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center drop-shadow-lg animate-fade-in">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Email */}
            <div className="animate-slide-in-left">
              <label className="block text-gray-200 mb-2 font-bold">Email</label>
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

            {/* New Password */}
            <div className="animate-slide-in-right">
              <label className="block text-gray-200 mb-2 font-bold">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                  passwordErrors.length > 0 ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300`}
                value={formData.newPassword}
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

            {/* Confirm Password */}
            <div className="animate-slide-in-left">
              <label className="block text-gray-200 mb-2 font-bold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Requirements */}
            {/* <div className="bg-gray-700 p-3 rounded-lg text-sm text-gray-300">
              <h3 className="font-medium mb-1">Password Requirements:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li className={formData.newPassword.length >= 8 ? "text-green-400" : ""}>
                  At least 8 characters long
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-400" : ""}>
                  Contains at least one uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? "text-green-400" : ""}>
                  Contains at least one lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? "text-green-400" : ""}>
                  Contains at least one number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? "text-green-400" : ""}>
                  Contains at least one special character
                </li>
              </ul>
            </div> */}

            {/* Reset Password Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;