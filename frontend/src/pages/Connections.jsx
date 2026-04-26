import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import connectionService from "../services/connectionService";

const Connections = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    const loadConnections = async () => {
      try {
        const response = await connectionService.getAcceptedConnections();
        setConnections(response.connections || []);
      } catch (error) {
        console.error("Failed to load connections:", error);
      } finally {
        setLoadingConnections(false);
      }
    };

    if (user?._id) {
      loadConnections();
    }
  }, [user, loading, navigate]);

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Connections 🤝</h1>
            <p className="text-gray-600">
              {user?.role === "alumni"
                ? "View all students connected with you"
                : "View all alumni connected with you"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="mb-6">
              <p className="text-gray-700 font-semibold text-lg">
                Total Connections: <span className="text-blue-600">{connections.length}</span>
              </p>
            </div>

            {loadingConnections ? (
              <div className="text-gray-600 text-center py-8">Loading connections...</div>
            ) : connections.length === 0 ? (
              <div className="text-gray-600 text-center py-8">
                <p className="text-lg">No connections yet</p>
                <p className="text-sm mt-2">Accept student connection requests to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map((connection) => (
                  <div
                    key={connection._id}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200 hover:shadow-lg transition"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {connection.otherUser?.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {connection.otherUser?.firstName} {connection.otherUser?.lastName}
                        </h3>
                        <p className="text-gray-600 text-sm truncate">{connection.otherUser?.email}</p>
                        <p className="text-blue-600 text-sm mt-2 font-medium">
                          Connected: {new Date(connection.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/messages?userId=${connection.otherUser?._id}`)}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                      💬 Send Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Connections;
