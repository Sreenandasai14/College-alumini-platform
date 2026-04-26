import React from "react";

const JobCard = ({ job, onApplyClick, showApplyButton = true, applyDisabled = false, applyLabel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            {job.type || "Full-time"}
          </span>
        </div>
        <p className="text-blue-600 font-medium">{job.company}</p>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-900">Location:</span> {job.location}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Experience:</span> {job.experience}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Salary:</span> {job.salary}
        </p>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      {showApplyButton && onApplyClick && (
        <button
          onClick={() => onApplyClick(job)}
          disabled={applyDisabled}
          className={`w-full px-4 py-2 rounded-lg transition font-medium ${
            applyDisabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {applyLabel || "Apply Now"}
        </button>
      )}
    </div>
  );
};

export default JobCard;
