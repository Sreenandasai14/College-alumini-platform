import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import applicationService from "../services/applicationService";

const Applications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "alumni")) {
      navigate("/");
      return;
    }

    const loadApplications = async () => {
      if (!user?._id) return;

      try {
        const response = await applicationService.getReceivedApplications(user._id);
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

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.student?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.student?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.opportunity?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchQuery]);

  const handleAccept = async (applicationId) => {
    try {
      await applicationService.acceptApplication(applicationId, user._id);
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: "accepted" } : app
        )
      );
      alert("Application accepted!");
    } catch (error) {
      console.error("Failed to accept application:", error);
      alert("Failed to accept application");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await applicationService.rejectApplication(applicationId, user._id);
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: "rejected" } : app
        )
      );
      alert("Application rejected!");
    } catch (error) {
      console.error("Failed to reject application:", error);
      alert("Failed to reject application");
    }
  };

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
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
            <p className="text-gray-600">Manage student applications for your opportunities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-600 text-xs font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-600 text-xs font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-gray-600 text-xs font-medium">Accepted</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {applications.filter((a) => a.status === "accepted").length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, or opportunity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loadingApplications ? (
            <div className="text-gray-600 text-center py-8">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center">
              <p className="text-gray-600 text-lg">No applications found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {application.student?.firstName} {application.student?.lastName}
                      </h3>
                      <p className="text-gray-600 text-xs truncate">{application.student?.email}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Opportunity</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {application.opportunity?.title}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {application.opportunity?.type}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between sm:flex-col sm:items-end gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadgeColor(
                          application.status
                        )}`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(application._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium whitespace-nowrap"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleReject(application._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition font-medium whitespace-nowrap"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition font-medium whitespace-nowrap"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-3">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Applications;
