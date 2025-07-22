import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  
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

    if (name === "password" && !isLoginMode) {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setPasswordErrors([]);
    setFormData(prev => ({
      name: "",
      email: prev.email,
      password: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (isLoginMode) {
      if (!formData.email || !formData.password) {
        toast.error("Email and password are required");
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("All fields are required");
        setIsSubmitting(false);
        return;
      }

      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        toast.error("Please fix password validation errors");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const endpoint = isLoginMode ? '/user/login' : '/user/signup';
      const body = isLoginMode 
        ? { email: formData.email.trim().toLowerCase(), password: formData.password }
        : { 
            name: formData.name.trim(), 
            email: formData.email.trim().toLowerCase(), 
            password: formData.password 
          };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.Error || `${isLoginMode ? 'Login' : 'Signup'} failed`);
        setIsSubmitting(false);
      } else {
        if (isLoginMode) {
          toast.success("Login successful");
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          setFormData({ name: "", email: "", password: "" });
          setTimeout(() => {
            navigate("/jobs");
          }, 1500);
        } else {
          toast.success("Account created successfully");
          setTimeout(() => {
            setIsLoginMode(true);
            setFormData(prev => ({ ...prev, name: "", password: "" }));
          }, 1500);
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, sub: googleId } = decoded;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          googleId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.Error || "Google login failed");
        return;
      }

      toast.success("Login successful");
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);

    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Google login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetSubmitting(true);

    if (!forgotEmail) {
      toast.error("Please enter your email address");
      setIsResetSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      toast.error("Please enter a valid email address");
      setIsResetSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset link sent to your email");
        setShowForgotPassword(false);
        setForgotEmail("");
      } else {
        toast.error(data.Error || data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      toast.error("Failed to send reset link. Please try again");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden max-w-6xl w-full relative">
            
            {/* Triangle Shape Background - PRESERVED */}
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

            {/* Left Side - Branding */}
            <div className="relative z-10 w-full lg:w-5/12 flex flex-col justify-center p-8 lg:p-12 min-h-[400px] lg:min-h-[600px]">
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                    Ace<span className="text-purple-400">Board</span>
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
                
                <p className="text-lg lg:text-xl text-gray-200 font-light leading-relaxed max-w-sm">
                  {isLoginMode 
                    ? "Step into your professional world. Your career awaits." 
                    : "Begin your journey to success. Create your professional identity."
                  }
                </p>

                <div className="pt-4">
                  <button
                    onClick={toggleMode}
                    className="group relative px-8 py-3 bg-transparent border-2 border-white/30 rounded-full text-white font-medium hover:border-white transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">
                      {isLoginMode ? 'New here? Sign up' : 'Already a member?'}
                    </span>
                    <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-7/12 p-6 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    {isLoginMode ? 'Welcome Back' : 'Get Started'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {isLoginMode ? 'Sign in to your account' : 'Create your new account'}
                  </p>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900/40 text-gray-400 font-medium">or</span>
                  </div>
                </div>

                {/* Form */}
                <div className="max-h-96 overflow-y-auto pr-2" style={{scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent'}}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Name Field */}
                    {!isLoginMode && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 placeholder-gray-500"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 placeholder-gray-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder={isLoginMode ? "Enter password" : "Create password"}
                          className={`w-full px-4 py-3 pr-12 bg-gray-800/50 backdrop-blur-sm text-white border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 placeholder-gray-500 ${
                            !isLoginMode && passwordErrors.length > 0 
                              ? 'border-red-500' 
                              : 'border-gray-600'
                          }`}
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {!isLoginMode && formData.password && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Strength</span>
                            <span className={`font-medium ${
                              passwordStrength < 60 ? 'text-red-400' : 
                              passwordStrength < 80 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {passwordStrength < 60 ? 'Weak' : 
                               passwordStrength < 80 ? 'Good' : 'Strong'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                passwordStrength < 60 ? 'bg-red-500' :
                                passwordStrength < 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Password Errors */}
                      {!isLoginMode && passwordErrors.length > 0 && (
                        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                          <ul className="text-red-300 text-xs space-y-1">
                            {passwordErrors.map((error, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        isSubmitting
                          ? "bg-gray-600 cursor-not-allowed text-gray-300"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]"
                      }`}
                    >
                      {isSubmitting 
                        ? (isLoginMode ? 'Signing in...' : 'Creating account...') 
                        : (isLoginMode ? 'Sign In' : 'Create Account')
                      }
                    </button>

                    {/* Forgot Password */}
                    {isLoginMode && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <button
                onClick={closeForgotPasswordModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-6">
              We'll send you a reset link to your email address.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="flex-1 py-3 px-4 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isResetSubmitting
                      ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  }`}
                >
                  {isResetSubmitting ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Scrollbar */}
      <style jsx>{`
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </>
  );
};

export default AuthPage;
