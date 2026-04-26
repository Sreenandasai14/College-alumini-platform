import React from "react";

const MentorshipRequest = ({ request, onAccept, onReject, showActions = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {request.studentName?.charAt(0) || request.mentorName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {request.studentName || request.mentorName}
            </h3>
            <p className="text-sm text-gray-600">
              {request.role === "student" ? "Student" : "Mentor"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            request.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : request.status === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm mb-2">
          <span className="font-semibold text-gray-900">Message:</span>
        </p>
        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
          {request.message}
        </p>
      </div>

      <div className="text-xs text-gray-500">
        Sent on {new Date(request.createdAt).toLocaleDateString()}
      </div>

      {showActions && request.status === "pending" && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onAccept(request.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorshipRequest;
