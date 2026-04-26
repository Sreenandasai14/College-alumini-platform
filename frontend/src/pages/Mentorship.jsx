import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MentorshipRequest from "../components/MentorshipRequest";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mentorshipService from "../services/mentorshipService";

const Mentorship = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/alumni");
        setMentors(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        if (user?.role === "alumni") {
          const response = await mentorshipService.getAllMentorshipRequests();
          setRequests(response.requests || []);
        } else {
          const response = await mentorshipService.getMyMentorshipRequests();
          setRequests(response.requests || []);
        }
      } catch (error) {
        console.error("Failed to load mentorship requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchMentors();
    if (user?._id) {
      fetchRequests();
    }
  }, [user, loading, navigate]);

  const handleSendRequest = async (e, mentor) => {
    e.preventDefault();
    const message = e.target.message.value;

    try {
      await mentorshipService.sendMentorshipRequest(mentor._id, message);
      alert(`Mentorship request sent to ${mentor.firstName} ${mentor.lastName}`);
      setShowRequestForm(false);
      setSelectedMentor(null);
      // Refresh requests
      const response = await mentorshipService.getMyMentorshipRequests();
      setRequests(response.requests || []);
    } catch (error) {
      alert("Failed to send mentorship request: " + error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await mentorshipService.acceptMentorshipRequest(id);
      alert(`Mentorship request accepted`);
      // Refresh requests
      const response = await mentorshipService.getAllMentorshipRequests();
      setRequests(response.requests || []);
    } catch (error) {
      alert("Failed to accept request: " + error);
    }
  };

  const handleReject = async (id) => {
    try {
      await mentorshipService.rejectMentorshipRequest(id);
      alert(`Mentorship request rejected`);
      // Refresh requests
      const response = await mentorshipService.getAllMentorshipRequests();
      setRequests(response.requests || []);
    } catch (error) {
      alert("Failed to reject request: " + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
            <p className="text-gray-600">Connect with experienced professionals for guidance</p>
          </div>

          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            {["browse", "requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "browse" ? "Find a Mentor" : "My Requests"}
              </button>
            ))}
          </div>

          {activeTab === "browse" && (
            <div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search mentors by expertise..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {mentors.length > 0 ? mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {mentor.firstName?.charAt(0) || "A"}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {mentor.firstName} {mentor.lastName}
                          </h3>
                          <p className="text-sm text-blue-600">
                            {mentor.title || `${mentor.firstName} ${mentor.lastName}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">Expertise:</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        {mentor.expertise || mentor.industry || "Expertise not provided"}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold text-gray-900">Company:</span>{" "}
                      {mentor.company || "Not provided"}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setShowRequestForm(true);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Request Mentorship
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full bg-white p-6 rounded-lg shadow border border-gray-200 text-gray-700">
                    No mentors are available yet. Once alumni register, they will appear here.
                  </div>
                )}
              </div>

              {showRequestForm && selectedMentor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Request Mentorship from {selectedMentor.firstName}
                    </h2>

                    <form onSubmit={(e) => handleSendRequest(e, selectedMentor)}>
                      <textarea
                        name="message"
                        placeholder="Why do you want to be mentored by this person? Share your goals and interests."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        required
                      ></textarea>

                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          Send Request
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowRequestForm(false);
                            setSelectedMentor(null);
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              {user?.role === "alumni" ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mentorship Requests Received</h2>
                  {loadingRequests ? (
                    <div className="py-12 text-center text-gray-600">Loading requests...</div>
                  ) : requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-600">No mentorship requests have been received yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requests.map((request) => (
                        <MentorshipRequest
                          key={request._id}
                          request={{
                            id: request._id,
                            studentName: request.student ? `${request.student.firstName} ${request.student.lastName}` : null,
                            mentorName: request.mentor ? `${request.mentor.firstName} ${request.mentor.lastName}` : null,
                            message: request.message,
                            status: request.status,
                            role: request.student ? request.student.role : (request.mentor ? request.mentor.role : null),
                            createdAt: request.createdAt
                          }}
                          onAccept={handleAccept}
                          onReject={handleReject}
                          showActions={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">My Mentorship Requests</h2>
                  {loadingRequests ? (
                    <div className="py-12 text-center text-gray-600">Loading requests...</div>
                  ) : requests.length === 0 ? (
                    <div className="py-12 text-center text-gray-600">You have not sent any mentorship requests yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requests.map((request) => (
                        <MentorshipRequest
                          key={request._id}
                          request={{
                            id: request._id,
                            studentName: request.student ? `${request.student.firstName} ${request.student.lastName}` : null,
                            mentorName: request.mentor ? `${request.mentor.firstName} ${request.mentor.lastName}` : null,
                            message: request.message,
                            status: request.status,
                            role: request.student ? request.student.role : (request.mentor ? request.mentor.role : null),
                            createdAt: request.createdAt
                          }}
                          showActions={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Mentorship;