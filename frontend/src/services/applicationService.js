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

const applicationService = {
  // Apply for an opportunity
  applyForOpportunity: async (opportunityId, studentId) => {
    try {
      const response = await axiosInstance.post("/applications/apply", {
        opportunityId,
        studentId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all applications received by alumni
  getReceivedApplications: async (alumniId) => {
    try {
      const response = await axiosInstance.get(`/applications/received/${alumniId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all applications for a student
  getStudentApplications: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/applications/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Accept an application
  acceptApplication: async (applicationId, alumniId) => {
    try {
      const response = await axiosInstance.put(`/applications/accept/${applicationId}`, {
        alumniId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject an application
  rejectApplication: async (applicationId, alumniId) => {
    try {
      const response = await axiosInstance.put(`/applications/reject/${applicationId}`, {
        alumniId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an application
  deleteApplication: async (applicationId) => {
    try {
      const response = await axiosInstance.delete(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default applicationService;
