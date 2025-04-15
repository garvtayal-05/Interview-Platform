import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobDetail from "../Components/JobDetail";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetailPage = () => {
  const { _id } = useParams(); // Get the job ID from the route
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false); // Track generating questions state
  const [isApplyingJob, setIsApplyingJob] = useState(false); // Track applying job state

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/jobprofile/fetch/${_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.Error || "Failed to fetch job details");
        }

        setJob(data.Job_Profile);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [_id]);

  // Handle generating questions
  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true); // Start loading state

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/jobprofile/fetch/${job._id}/generate-questions`, // Use job._id instead of job.jobTitle
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Error || "Failed to generate questions");
      }

      // Update the job state with the new questions
      setJob((prevJob) => ({
        ...prevJob,
        questions: data.Questions.map((question, index) => ({
          questionText: question,
          difficulty: index === 0 ? "easy" : index <= 2 ? "medium" : "hard",
        })),
      }));

      toast.success("New questions generated successfully!");
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false); // End loading state
    }
  };

  // Handle applying for a job
  const handleApplyJob = async (interviewDate) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to apply for this job.");
        return;
      }
  
      setIsApplyingJob(true); // Start loading state
  
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/apply-job/${_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interviewDate }), // Send interview date to backend
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to apply for the job.");
      }
  
      toast.success("Job applied successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to apply for the job. Please try again.");
    } finally {
      setIsApplyingJob(false); // End loading state
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <p className="text-2xl font-bold text-red-500 animate-fade-in">
          Job not found.
        </p>
      </div>
    );
  }

  // Render JobDetail component
  return (
    <JobDetail
      job={job}
      onGenerateQuestions={handleGenerateQuestions}
      onApplyJob={handleApplyJob}
      isGenerating={isGeneratingQuestions} // Pass generating state
      isApplying={isApplyingJob} // Pass applying state
    />
  );
};

export default JobDetailPage;
