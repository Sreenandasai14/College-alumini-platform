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

const mentorshipService = {
  getAllMentorshipRequests: async () => {
    try {
      const response = await axiosInstance.get("/mentorship");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendMentorshipRequest: async (mentorId, message) => {
    try {
      const response = await axiosInstance.post("/mentorship", {
        mentorId,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  acceptMentorshipRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(`/mentorship/${requestId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  rejectMentorshipRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(`/mentorship/${requestId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyMentorshipRequests: async () => {
    try {
      const response = await axiosInstance.get("/mentorship/my-requests");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mentorshipService;
