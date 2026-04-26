import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import connectionService from "../services/connectionService";

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeConnections: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?._id) return;

      try {
        // Load connections
        const connectionsResponse = await connectionService.getAcceptedConnections();
        const connections = connectionsResponse.connections || [];

        setStats({
          activeConnections: connections.length,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user?._id) {
      loadStats();
    }
  }, [user]);

  if (loading || loadingStats) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Explore alumni connections and opportunities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/connections")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Connections</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeConnections}</p>
                </div>
                <div className="text-4xl">🤝</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/messages")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Messages</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">Chat</p>
                </div>
                <div className="text-4xl">💬</div>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Browse Alumni",
                icon: "👥",
                description: "See alumni mentors and connections",
                action: () => navigate("/browse-alumni"),
                color: "bg-blue-600 hover:bg-blue-700",
              },
              {
                label: "Job Opportunities",
                icon: "💼",
                description: "View current jobs and internships",
                action: () => navigate("/jobs"),
                color: "bg-purple-600 hover:bg-purple-700",
              },
              {
                label: "Find Mentors",
                icon: "🎓",
                description: "Connect with alumni mentors",
                action: () => navigate("/mentorship"),
                color: "bg-green-600 hover:bg-green-700",
              },
              {
                label: "My Profile",
                icon: "👤",
                description: "Update your profile details",
                action: () => navigate("/profile"),
                color: "bg-indigo-600 hover:bg-indigo-700",
              },
            ].map((card, idx) => (
              <button
                key={idx}
                onClick={card.action}
                className={`bg-white rounded-lg shadow p-6 border border-gray-200 text-left text-left transition transform hover:-translate-y-1 ${card.color} text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{card.icon}</span>
                </div>
                <p className="text-xl font-bold">{card.label}</p>
                <p className="mt-3 text-sm text-white/80">{card.description}</p>
              </button>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;