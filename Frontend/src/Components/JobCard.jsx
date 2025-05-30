import React from "react";
import { NavLink, useLocation} from "react-router-dom";
import { Briefcase, Building } from "lucide-react";

const JobCard = ({ job }) => {
  const location = useLocation();
  const isAppliedJobsPage = location.pathname.includes('applied-jobs');

  console.log({ job });
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
      {/* Status badge */}
      <div className="relative">
        <div className="absolute top-4 right-4">
          <span className="bg-purple-600 text-xs font-bold text-white px-3 py-1 rounded-full">
            {job.status || "Active"}
          </span>
        </div>

        {/* Header with gradient overlay */}
        <div className="h-6 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
      </div>

      <div className="p-6 space-y-4">
        {/* Job Title with icon */}
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <Briefcase className="text-purple-400" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">{job.jobTitle}</h2>
        </div>

        {/* Company name */}
        <div className="flex items-center text-gray-300">
          <Building className="text-purple-400 mr-2" size={16} />
          <span className="font-medium">{job.company || "Company Name"}</span>
        </div>

        {/* Requirements */}
        <div className="mt-4">
          <h3 className="font-semibold text-purple-400 mb-2">Requirements:</h3>
          <div className="flex flex-wrap gap-2">
            {job?.requirements?.length > 0 ? (
              job.requirements.map((req, index) => (
                <span 
                  key={index} 
                  className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full"
                >
                  {req}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No requirements listed</span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <NavLink
          to={isAppliedJobsPage ? `/applied-jobs/${job._id}` : `/jobs/${job._id}`}
          className="inline-block mt-4 w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md"
        >
          View Details
        </NavLink>
      </div>
    </div>
  );
};

export default JobCard;