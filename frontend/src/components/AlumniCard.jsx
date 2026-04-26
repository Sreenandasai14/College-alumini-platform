import React from "react";
import { Link } from "react-router-dom";

const AlumniCard = ({ alumni, onMentorClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {alumni.firstName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {alumni.firstName} {alumni.lastName}
            </h3>
            <p className="text-sm text-blue-600 font-medium">{alumni.title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">Company:</span> {alumni.company}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">Industry:</span> {alumni.industry}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">Expertise:</span> {alumni.expertise}
        </p>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{alumni.bio}</p>

      <div className="flex space-x-2">
        <Link
          to={`/profile/${alumni.id}`}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm font-medium"
        >
          View Profile
        </Link>
        {onMentorClick && (
          <button
            onClick={() => onMentorClick(alumni)}
            className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
          >
            Request Mentorship
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
