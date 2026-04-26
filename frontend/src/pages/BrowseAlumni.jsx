import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import connectionService from "../services/connectionService";

const BrowseAlumni = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [loadingSendRequest, setLoadingSendRequest] = useState({});

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/alumni");
        setAlumni(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlumni();
  }, []);

  const handleSendConnectionRequest = async (alumniId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoadingSendRequest((prev) => ({ ...prev, [alumniId]: true }));
    try {
      await connectionService.sendConnectionRequest(alumniId);
      setSentRequests((prev) => new Set([...prev, alumniId]));
      alert("Connection request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error);
      alert(error.message || "Failed to send connection request");
    } finally {
      setLoadingSendRequest((prev) => ({ ...prev, [alumniId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        <h1 className="text-3xl font-bold mb-6">Browse Alumni Network</h1>

        <div className="grid grid-cols-3 gap-6">
          {alumni.map((alumnus) => (
            <div key={alumnus._id} className="bg-white shadow p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {alumnus.firstName?.charAt(0) || "A"}
                </div>
              </div>

              <h2 className="text-xl font-bold text-center">
                {alumnus.firstName} {alumnus.lastName}
              </h2>

              <p className="text-gray-500 text-center text-sm mt-1">
                {alumnus.email}
              </p>

              <p className="text-blue-600 text-center mt-2 font-semibold">Alumni</p>

              <div className="mt-4 flex flex-col gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  View Profile
                </button>
                <button
                  onClick={() => handleSendConnectionRequest(alumnus._id)}
                  disabled={sentRequests.has(alumnus._id) || loadingSendRequest[alumnus._id]}
                  className={`px-4 py-2 rounded transition font-medium ${
                    sentRequests.has(alumnus._id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : loadingSendRequest[alumnus._id]
                      ? "bg-green-500 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {sentRequests.has(alumnus._id)
                    ? "✓ Request Sent"
                    : loadingSendRequest[alumnus._id]
                    ? "Sending..."
                    : "🤝 Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseAlumni;

