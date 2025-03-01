import React, { useEffect, useState } from "react";
import JobCard from "../Components/JobCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if no token is found
    if (!token) {
      toast.error("Please log in or register first.");
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:1564/jobprofile/fetch", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.Error || "Failed to fetch jobs");
        }

        setJobs(data.Job_Profiles);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Job Profiles
      </h1>
      {jobs.length === 0 ? (
        <div className="text-center text-gray-300 text-xl">
          <p>No jobs available at the moment.</p>
          <p className="mt-2">Check back later or create a new job profile!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
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

export default JobListPage;