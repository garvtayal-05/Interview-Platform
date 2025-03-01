import React from "react";
import { NavLink } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden hover:shadow-purple-500/50 transition-shadow duration-300 transform hover:-translate-y-2">
      <div className="p-6">
        {/* Job Title */}
        <h2 className="text-2xl font-bold text-white mb-3">{job.jobTitle}</h2>

        {/* Requirements */}
        <p className="text-gray-300 mb-4">
          <span className="font-semibold text-purple-400">Requirements:</span>{" "}
          {job.requirements.join(", ")}
        </p>

        {/* View Details Button */}
        <NavLink
          to={`/jobs/${job._id}`}
          className="inline-block w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
        >
          View Details
        </NavLink>
      </div>
    </div>
  );
};

export default JobCard;