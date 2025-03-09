import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/authentication"; // Django backend URL

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("access") || null,
  refreshToken: localStorage.getItem("refresh") || null,

  login: async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login/`, { email, password });
      set({ user: res.data.user, accessToken: res.data.access, refreshToken: res.data.refresh });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || "Login failed" };
    }
  },

  register: async (email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/register/`, { email, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
