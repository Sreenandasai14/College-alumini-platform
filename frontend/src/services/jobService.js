import axios from "axios";
import authService from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const jobService = {
  getAllJobs: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/jobs", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getJobById: async (jobId) => {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post("/jobs", jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  applyForJob: async (jobId) => {
    try {
      const response = await axiosInstance.post(`/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyJobs: async () => {
    try {
      const response = await axiosInstance.get("/jobs/my-jobs");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default jobService;
