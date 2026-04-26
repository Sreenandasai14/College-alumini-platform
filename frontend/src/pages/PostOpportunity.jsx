import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import opportunityService from "../services/opportunityService";

const PostOpportunity = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [postedOpportunities, setPostedOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Job",
    experience: "",
    salary: "",
    description: "",
    skills: "",
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "alumni")) {
      navigate("/");
      return;
    }

    const loadOpportunities = async () => {
      if (!user?._id) return;

      try {
        const data = await opportunityService.getOpportunitiesByPoster(user._id);
        setPostedOpportunities(data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoadingOpportunities(false);
      }
    };

    if (user?._id) {
      loadOpportunities();
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.type) {
      setError("Title and type are required fields");
      return;
    }

    const opportunityData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      postedBy: user._id,
    };

    try {
      setPosting(true);
      const response = await opportunityService.createOpportunity(opportunityData);
      const newOpportunity = response.opportunity || response;
      setPostedOpportunities((prev) => [newOpportunity, ...prev]);

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Job",
        experience: "",
        salary: "",
        description: "",
        skills: "",
      });
      setShowForm(false);
      alert("Opportunity posted successfully!");
    } catch (err) {
      setError(err.message || "Failed to post opportunity");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (opportunityId) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await opportunityService.deleteOpportunity(opportunityId, user._id);
      setPostedOpportunities((prev) => prev.filter((opp) => opp._id !== opportunityId));
      alert("Opportunity deleted successfully!");
    } catch (err) {
      alert("Failed to delete opportunity: " + err.message);
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
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Post Opportunity</h1>
              <p className="text-gray-600">Create job and internship opportunities for students</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-lg transition font-medium text-white ${
                showForm ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {showForm ? "Cancel" : "✨ Create Opportunity"}
            </button>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-8 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Opportunity</h2>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opportunity Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer, Business Analyst"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Job">Job</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="e.g., $50,000 - $70,000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Separate skills with commas (e.g., React, Node.js, MongoDB)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={posting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
                  >
                    {posting ? "Posting..." : "Post Opportunity"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posted Opportunities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Posted Opportunities ({postedOpportunities.length})
            </h2>

            {loadingOpportunities ? (
              <div className="text-gray-600 text-center py-8">Loading opportunities...</div>
            ) : postedOpportunities.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center">
                <p className="text-gray-600 text-lg">No opportunities posted yet</p>
                <p className="text-gray-500 mt-2">Create your first opportunity to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postedOpportunities.map((opportunity) => (
                  <div
                    key={opportunity._id}
                    className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{opportunity.title}</h3>
                        <p className="text-gray-600 text-sm">{opportunity.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {opportunity.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">📍 {opportunity.location}</p>
                    {opportunity.salary && (
                      <p className="text-gray-600 text-sm mb-2">💰 {opportunity.salary}</p>
                    )}
                    {opportunity.experience && (
                      <p className="text-gray-600 text-sm mb-4">📊 {opportunity.experience}</p>
                    )}

                    {opportunity.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {opportunity.description}
                      </p>
                    )}

                    {opportunity.skills && opportunity.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-3">
                        Posted: {new Date(opportunity.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleDelete(opportunity._id)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
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

export default PostOpportunity;
