import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";

const Jobs = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);

  const [formData, setFormData] = useState({
  title: "",
  company: user?.company || "",
  location: "",
  type: "Full-time",
  experience: "",
  salary: "",
  description: "",
  skills: "",
});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const data = await opportunityService.getAllOpportunities();
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadStudentApplications = async () => {
      if (!user || user.role !== "student") return;

      try {
        const response = await applicationService.getStudentApplications(user._id);
        const appliedIds = new Set(
          (response.applications || [])
            .map((app) => app.opportunity?._id)
            .filter(Boolean)
        );
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Failed to load applied jobs:", err);
      }
    };

    loadStudentApplications();
  }, [user]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = async (job) => {
    if (!user?._id) {
      alert("Please login first");
      return;
    }

    try {
      await applicationService.applyForOpportunity(job._id, user._id);
      setAppliedJobIds((prev) => new Set(prev).add(job._id));
      alert(`Applied to ${job.title} at ${job.company}`);
    } catch (err) {
      console.error("Failed to apply to job:", err);
      alert(err.message || "Failed to apply to this opportunity.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?._id) {
      setError("You must be logged in to post a job.");
      return;
    }

    const jobData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description,
      skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      postedBy: user._id,
    };

    try {
      setPosting(true);
      const response = await opportunityService.createOpportunity(jobData);
      const createdJob = response.opportunity || response;
      setJobs((prev) => [createdJob, ...prev]);
      setShowPostForm(false);
      setFormData({
        title: "",
        company: user?.company || "",
        location: "",
        type: "Full-time",
        experience: "",
        salary: "",
        description: "",
        skills: "",
      });
    } catch (err) {
      setError(err.message || "Failed to post job.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
                <p className="text-gray-600">Discover internships and job postings</p>
              </div>
              {user?.role === "alumni" && (
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  ✍️ Post a Job
                </button>
              )}
            </div>

            {showPostForm && (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Post a Job Opportunity</h2>
                {error && (
                  <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handlePostJob}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Job Title"
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Experience"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="Salary range"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={posting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {posting ? "Posting..." : "Post Job"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Internship</option>
                <option>Part-time</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Found <span className="font-semibold">{filteredJobs.length}</span> job opportunities
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const alreadyApplied = appliedJobIds.has(job._id);
              return (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onApplyClick={handleApply}
                  showApplyButton={user?.role === "student"}
                  applyDisabled={alreadyApplied}
                  applyLabel={alreadyApplied ? "Applied" : "Apply Now"}
                />
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No jobs found matching your search</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;