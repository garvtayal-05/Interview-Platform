import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobCard from "../Components/JobCard"; // Import the JobCard component

const AppliedJobs = () => {
  const [Jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:1564/user/applied-jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch applied jobs");
        }
        
        console.log(data.appliedJobs);
        setJobs(data.appliedJobs || []);
     
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error("Failed to fetch applied jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Applied Jobs
      </h1>
      {Jobs.length === 0 ? (
        <div className="text-center text-gray-300 text-xl">
          <p>No applied jobs found.</p>
          <p className="mt-2">Apply for a job to see it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Media Queries for Responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .grid-cols-1 {
              grid-template-columns: 1fr;
            }
            .p-8 {
              padding: 2rem;
            }
          }
          @media (max-width: 1024px) {
            .grid-cols-2 {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AppliedJobs;