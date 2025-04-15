import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/applications`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch applications");
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(error.message || "Failed to fetch applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Job Applications Received</h1>
      
      {applications.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg">
          <p>No applications received yet for your posted jobs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{application.jobTitle}</h2>
              <div className="mt-3">
                <p className="text-gray-300">
                  <span className="font-medium">Candidate:</span> {application.candidateName}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Email:</span> {application.candidateEmail}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-gray-300">
                  <span className="font-medium">Applied on:</span> {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                {application.interviewDate && (
                  <p className="text-gray-300">
                    <span className="font-medium">Interview Date:</span> {new Date(application.interviewDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;