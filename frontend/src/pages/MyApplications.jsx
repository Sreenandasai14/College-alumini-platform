import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import applicationService from "../services/applicationService";

const MyApplications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      navigate("/");
      return;
    }

    const loadApplications = async () => {
      if (!user?._id) return;

      try {
        const response = await applicationService.getStudentApplications(user._id);
        setApplications(response.applications || []);
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoadingApplications(false);
      }
    };

    if (user?._id) {
      loadApplications();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter]);

  const handleDelete = async (applicationId) => {
    try {
      await applicationService.deleteApplication(applicationId);
      setApplications(applications.filter((app) => app._id !== applicationId));
      alert("Application deleted successfully");
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert(error.message || "Failed to delete application");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track your job and internship applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{applications.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium">Accepted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {applications.filter((a) => a.status === "accepted").length}
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          {loadingApplications ? (
            <div className="text-gray-600 text-center py-8">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center">
              <p className="text-gray-600 text-lg">No applications found</p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Opportunities
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-600">Opportunity</p>
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.opportunity?.title}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company/Alumni</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {application.opportunity?.postedBy?.firstName}{" "}
                        {application.opportunity?.postedBy?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {application.opportunity?.type}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                          application.status
                        )}`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-3">
                      Email: {application.opportunity?.postedBy?.email}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {application.status === "accepted" && (
                        <button
                          onClick={() => navigate(`/connections`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                        >
                          💬 Message Alumni
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(application._id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm"
                      >
                        🗑 Cancel Application
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyApplications;
