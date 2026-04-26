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

const opportunityService = {
  // Get all opportunities
  getAllOpportunities: async () => {
    try {
      const response = await axiosInstance.get("/opportunities");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get opportunity by ID
  getOpportunityById: async (opportunityId) => {
    try {
      const response = await axiosInstance.get(`/opportunities/${opportunityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get opportunities posted by a specific alumni
  getOpportunitiesByPoster: async (userId) => {
    try {
      const response = await axiosInstance.get(`/opportunities/posted/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new opportunity
  createOpportunity: async (opportunityData) => {
    try {
      const response = await axiosInstance.post("/opportunities/create", opportunityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an opportunity
  deleteOpportunity: async (opportunityId, alumniId) => {
    try {
      const response = await axiosInstance.delete(`/opportunities/${opportunityId}`, {
        data: { alumniId },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default opportunityService;
