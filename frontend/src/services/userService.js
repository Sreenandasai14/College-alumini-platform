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

const userService = {
  getAllAlumni: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/users/alumni", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchAlumni: async (query) => {
    try {
      const response = await axiosInstance.get("/users/alumni/search", { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
