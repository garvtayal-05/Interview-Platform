import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [file, setFile] = useState(null);
  const [structuredData, setStructuredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Send file to backend for processing
      const response = await fetch("http://localhost:1564/user/create-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to process file");
      }

      // Set structured data from backend response
      setStructuredData(data.profileText || "No structured data found.");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message || "Failed to upload file");
      toast.error("Failed to upload file. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Parse structured data into sections
  const parseProfileData = (text) => {
    if (typeof text !== "string") {
      console.error("Expected a string but received:", text);
      return {
        name: "",
        summary: "",
        education: [],
        projects: [],
        skills: [],
        contact: "",
      };
    }

    const sections = {
      name: "",
      summary: "",
      education: [],
      projects: [],
      skills: [],
      contact: "",
    };

    // Extract Name
    const nameMatch = text.match(/Name:\s*(.*?)(?=\s*- Summary:|$)/i);
    if (nameMatch) {
      sections.name = nameMatch[1].trim();
    }

    // Extract Summary
    const summaryMatch = text.match(/Summary:\s*(.*?)(?=\s*- Education:|$)/i);
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Extract Education
    const educationMatch = text.match(/Education:\s*(.*?)(?=\s*- Projects:|$)/i);
    if (educationMatch) {
      sections.education = educationMatch[1]
        .split(";")
        .map((edu) => edu.trim())
        .filter((edu) => edu);
    }

    // Extract Projects
    const projectsMatch = text.match(/Projects:\s*(.*?)(?=\s*- Skills:|$)/i);
    if (projectsMatch) {
      sections.projects = projectsMatch[1]
        .split(";")
        .map((proj) => proj.trim())
        .filter((proj) => proj);
    }

    // Extract Skills
    const skillsMatch = text.match(/Skills:\s*(.*?)(?=\s*- Contact:|$)/i);
    if (skillsMatch) {
      sections.skills = skillsMatch[1]
        .split(";")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    // Extract Contact
    const contactMatch = text.match(/Contact:\s*(.*)/i);
    if (contactMatch) {
      sections.contact = contactMatch[1].trim();
    }

    return sections;
  };

  // Render profile UI
  const renderProfile = () => {
    if (!structuredData) return null;

    // Parse structured data into sections
    const profileSections = parseProfileData(structuredData);

    return (
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-gray-700 bg-opacity-50 p-8 rounded-2xl shadow-2xl mt-12 border border-purple-400 border-opacity-30 relative z-10">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-3/4 left-3/4 w-48 h-48 rounded-full bg-purple-400 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-16 bg-purple-400 rounded-full mr-3"></div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Your Profile
          </h2>
          <div className="h-1 w-16 bg-indigo-400 rounded-full ml-3"></div>
        </div>

        {/* Profile Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Name */}
            {profileSections.name && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Name
                </h3>
                <p className="text-gray-200 text-lg mt-2">{profileSections.name}</p>
              </div>
            )}

            {/* Education */}
            {profileSections.education.length > 0 && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg">
                <h3 className="text-2xl font-bold text-indigo-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                  </svg>
                  Education
                </h3>
                <ul className="mt-3 space-y-2">
                  {profileSections.education.map((edu, index) => (
                    <li key={index} className="text-gray-200 pl-4 border-l-2 border-indigo-300 border-opacity-40">
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {profileSections.skills.length > 0 && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Skills
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileSections.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-900 bg-opacity-50 text-purple-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Summary */}
            {profileSections.summary && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg">
                <h3 className="text-2xl font-bold text-indigo-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Summary
                </h3>
                <p className="text-gray-200 mt-2 leading-relaxed">{profileSections.summary}</p>
              </div>
            )}

            {/* Projects */}
            {profileSections.projects.length > 0 && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  Projects
                </h3>
                <ul className="mt-3 space-y-2">
                  {profileSections.projects.map((proj, index) => (
                    <li key={index} className="text-gray-200 pl-4 border-l-2 border-purple-300 border-opacity-40">
                      {proj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact */}
            {profileSections.contact && (
              <div className="transform hover:scale-105 transition-all duration-300 bg-gray-800 bg-opacity-60 p-6 rounded-xl border-l-4 border-indigo-500 shadow-lg">
                <h3 className="text-2xl font-bold text-indigo-400 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Contact
                </h3>
                <p className="text-gray-200 mt-2">{profileSections.contact}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8 relative overflow-hidden opacity-100 ">
      {/* Background Elements */}
      {/* <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div> */}
      
      {/* Loading Spinner with Blurred Background */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-300 border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 inline-block">
          Professional Profile
        </h1>
        <div className="w-32 h-1 mx-auto bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          Upload your resume or CV to generate a beautiful, structured profile
        </p>
      </div>

      {/* File Upload Card */}
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-gray-700 bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-purple-400 border-opacity-30 relative z-10 transition-all duration-500 hover:shadow-purple-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label htmlFor="file" className="block text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Upload Your Document
            </label>
            
            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.png,.jpg,.jpeg"
                required
                disabled={loading}
              />
              <label
                htmlFor="file"
                className="group flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-purple-400 border-opacity-40 rounded-xl cursor-pointer bg-gray-800 bg-opacity-50 transition-all duration-300 hover:bg-opacity-70 hover:border-opacity-60"
              >
                <div className="w-16 h-16 mb-4 text-purple-400 group-hover:text-indigo-400 transition-colors duration-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-300 group-hover:text-white transition-colors duration-300">
                  {file ? file.name : "Drag & drop your file or click to browse"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Supported file types: PDF, DOCX, PNG, JPG, JPEG
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Upload and Process
                </>
              )}
            </span>
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg mt-6 animate-pulse">
              <p className="text-red-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Display Profile */}
      {renderProfile()}

      {/* Add some custom style for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;