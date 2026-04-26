import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import connectionService from "../services/connectionService";

const AlumniDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [opportunitiesPosted, setOpportunitiesPosted] = useState(0);
  const [acceptedConnections, setAcceptedConnections] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "alumni")) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      if (!user?._id) return;

      try {
        // Load opportunities
        const opportunities = await opportunityService.getOpportunitiesByPoster(user._id);
        setOpportunitiesPosted(opportunities.length);
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      }

      // Applications removed - focusing on connection requests instead

      try {
        // Load connections
        const connResponse = await connectionService.getAcceptedConnections();
        setAcceptedConnections(connResponse.count || 0);
      } catch (error) {
        console.error("Failed to load connections:", error);
      }

      try {
        // Load connection requests
        const requests = await connectionService.getReceivedRequests();
        const allRequests = requests.connections || [];
        setConnectionRequests(allRequests);
        setPendingRequests(allRequests.filter((r) => r.status === "pending").length);
      } catch (error) {
        console.error("Failed to load connection requests:", error);
      }

      setLoadingData(false);
    };

    loadDashboard();
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const statCards = [
    { label: "Opportunities Posted", value: opportunitiesPosted, icon: "📝", color: "bg-blue-100 text-blue-800" },
    { label: "Pending Requests", value: pendingRequests, icon: "📬", color: "bg-orange-100 text-orange-800" },
    { label: "Total Connections", value: acceptedConnections, icon: "🤝", color: "bg-green-100 text-green-800" },
  ];

  const handleAcceptRequest = async (connectionId) => {
    try {
      await connectionService.acceptConnectionRequest(connectionId);
      setConnectionRequests((prev) => prev.filter((req) => req._id !== connectionId));
      setPendingRequests((prev) => Math.max(prev - 1, 0));
      setAcceptedConnections((prev) => prev + 1);
      alert("Connection request accepted!");
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept request");
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      await connectionService.rejectConnectionRequest(connectionId);
      setConnectionRequests((prev) => prev.filter((req) => req._id !== connectionId));
      setPendingRequests((prev) => Math.max(prev - 1, 0));
      alert("Connection request rejected!");
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.firstName}! 🌟
            </h1>
            <p className="text-gray-600">Manage your alumni presence and opportunities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  if (stat.label.includes("Posted")) navigate("/post-opportunity");
                  else if (stat.label.includes("Connections")) navigate("/connections");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/post-opportunity")}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <span>✨</span> Post Opportunity
                  </button>

                  <button
                    onClick={() => navigate("/connections")}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <span>🤝</span> View Connections
                  </button>
                  <button
                    onClick={() => navigate("/messages")}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <span>💬</span> Messages
                  </button>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <span>👤</span> My Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Requests Received */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Requests Received</h2>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingRequests} Pending
                  </span>
                </div>

                {loadingData ? (
                  <div className="text-gray-600 text-center py-8">Loading requests...</div>
                ) : connectionRequests.length === 0 ? (
                  <div className="text-gray-600 text-center py-8">
                    <p>No connection requests yet</p>
                    <p className="text-sm mt-2">When students send you requests, they'll appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectionRequests.map((request) => (
                      <div key={request._id} className="pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-gray-900 font-semibold">
                              {request.student?.firstName} {request.student?.lastName}
                            </p>
                            <p className="text-gray-600 text-sm">{request.student?.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === "accepted" ? "bg-green-100 text-green-800" :
                            request.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.status === "pending" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlumniDashboard;