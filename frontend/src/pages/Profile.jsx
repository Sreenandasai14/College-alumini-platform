import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() =>
    user ? {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      title: user.title || "",
      company: user.company || "",
      industry: user.industry || "",
      expertise: user.expertise || "",
      bio: user.bio || "",
      location: user.location || "",
    } : {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      company: "",
      industry: "",
      expertise: "",
      bio: "",
      location: "",
    }
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  editMode
                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., Senior Engineer"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    placeholder="e.g., Full-stack Development"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

                <div className="px-8 pb-8">
                  <div className="flex items-end space-x-4 -mt-16 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
                      {user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-gray-600">{user?.role === "alumni" ? "Alumni" : "Student"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Email</p>
                      <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-1">Role</p>
                      <p className="text-gray-900 font-medium">{user?.role === "alumni" ? "Alumni" : "Student"}</p>
                    </div>

                    {user?.title && (
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Title</p>
                        <p className="text-gray-900 font-medium">{user?.title}</p>
                      </div>
                    )}

                    {user?.company && (
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Company</p>
                        <p className="text-gray-900 font-medium">{user?.company}</p>
                      </div>
                    )}

                    {user?.industry && (
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Industry</p>
                        <p className="text-gray-900 font-medium">{user?.industry}</p>
                      </div>
                    )}

                    {user?.location && (
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Location</p>
                        <p className="text-gray-900 font-medium">{user?.location}</p>
                      </div>
                    )}

                    {user?.expertise && (
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Expertise</p>
                        <p className="text-gray-900 font-medium">{user?.expertise}</p>
                      </div>
                    )}
                  </div>

                  {user?.bio && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-600 text-sm mb-2">Bio</p>
                      <p className="text-gray-900">{user?.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;