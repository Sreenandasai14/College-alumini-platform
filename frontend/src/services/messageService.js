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

const messageService = {
  // Send a message
  sendMessage: async (receiver, message) => {
    try {
      const response = await axiosInstance.post("/messages/send", {
        receiver,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get conversation between two users
  getConversation: async (otherId) => {
    try {
      const response = await axiosInstance.get(`/messages/conversation/${otherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all conversations and messages for the authenticated user
  getAllMessages: async () => {
    try {
      const response = await axiosInstance.get(`/messages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageService;
