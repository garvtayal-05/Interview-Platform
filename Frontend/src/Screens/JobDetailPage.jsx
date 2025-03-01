import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobDetail from "../Components/JobDetail";
import { toast } from "react-toastify";

const JobDetailPage = () => {
  const { _id } = useParams(); // Get the job ID from the route
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // Track generating state

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:1564/jobprofile/fetch/${_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleGenerateQuestions = async () => {
    setIsGenerating(true); // Disable button and show "Generating..."

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1564/jobprofile/fetch/${job.jobTitle}/generate-questions`,
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
      setIsGenerating(false); // Re-enable button
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <p className="text-2xl font-bold text-red-500 animate-fade-in">
          Job not found.
        </p>
      </div>
    );
  }

  return (
    <JobDetail
      job={job}
      onGenerateQuestions={handleGenerateQuestions}
      isGenerating={isGenerating} // Pass isGenerating state to JobDetail
    />
  );
};

export default JobDetailPage;