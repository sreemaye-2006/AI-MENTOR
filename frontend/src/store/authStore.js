import { create } from "zustand";
import { login as loginUser, register as registerUser, getProfile } from "../services/authServices";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await loginUser(credentials);
      if (data.success) {
        localStorage.setItem("token", data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
        return { success: true };
      } else {
        set({ error: data.message || "Login failed", loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login error occurred";
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await registerUser(userData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
        return { success: true };
      } else {
        set({ error: data.message || "Registration failed", loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration error occurred";
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    try {
      const { data } = await getProfile();
      if (data.success) {
        set({ user: data.user, isAuthenticated: true });
      } else {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      }
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
