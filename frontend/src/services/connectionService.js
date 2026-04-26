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

const connectionService = {
  // Send connection request from student to alumni
  sendConnectionRequest: async (alumniId) => {
    try {
      const response = await axiosInstance.post("/connections/send", {
        alumniId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all pending connection requests for an alumni
  getReceivedRequests: async () => {
    try {
      const response = await axiosInstance.get("/connections/received");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Accept a connection request
  acceptConnectionRequest: async (connectionId) => {
    try {
      const response = await axiosInstance.put(`/connections/accept/${connectionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject a connection request
  rejectConnectionRequest: async (connectionId) => {
    try {
      const response = await axiosInstance.put(`/connections/reject/${connectionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all accepted connections
  getAcceptedConnections: async () => {
    try {
      const response = await axiosInstance.get("/connections/accepted");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default connectionService;
