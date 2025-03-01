import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const CreateJobProfilePage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  // Check authorization on component mount
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Showing toast..."); // Debugging
        toast.error("You are not authorized to access this page. Redirecting to login...", {
          autoClose: 1000,
          onClose: () => navigate("/login"),
        });
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole !== "admin") {
          console.log("User is not an admin. Showing toast..."); // Debugging
          toast.error("You are not authorized to access this page. Redirecting to login...", {
            autoClose: 1000,
            onClose: () => navigate("/login"),
          });
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Invalid token. Redirecting to login...", {
          autoClose: 1000,
          onClose: () => navigate("/login"),
        });
      }
    };

    checkAuthorization();
  }, [navigate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", difficulty: "easy" }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form fields
    if (!jobTitle || !requirements || questions.length === 0) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:1564/jobprofile/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobTitle,
          requirements: requirements.split("\n").map((req) => req.trim()),
          questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Error || "Failed to create job profile");
      }

      // Redirect to the job profiles list or detail page
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating job profile:", error);
      setError(error.message || "Failed to create job profile");
    } finally {
      setLoading(false);
    }
  };

  // Render the page only if authorized
  if (!isAuthorized) {
    return null; // Return null or a loading spinner while waiting for the toast to close
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Create Job Profile
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Job Title */}
        <div className="mb-6">
          <label htmlFor="jobTitle" className="block text-lg font-semibold mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            placeholder="Enter job title"
            required
          />
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <label htmlFor="requirements" className="block text-lg font-semibold mb-2">
            Requirements (one per line)
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            rows={5}
            placeholder="Enter requirements"
            required
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Interview Questions</label>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 mb-2"
                placeholder="Enter question"
                required
              />
              <select
                value={question.difficulty}
                onChange={(e) =>
                  handleQuestionChange(index, "difficulty", e.target.value)
                }
                className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Add Question
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mb-4 animate-fade-in">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:hover:scale-100"
        >
          {loading ? "Creating..." : "Create Job Profile"}
        </button>
      </form>

      {/* Media Queries for Responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .p-8 {
              padding: 1.5rem;
            }
            .text-4xl {
              font-size: 2rem;
            }
            .text-lg {
              font-size: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CreateJobProfilePage;