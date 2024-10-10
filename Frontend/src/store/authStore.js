import { create } from 'zustand'
import axios from 'axios'

const severURL = import.meta.env.VITE_SERVER_URL;
const API_URL = `${severURL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Signup
  signup: async (formData) => {
    set({ isLoading: true, error: null});
    try {
      const res = await axios.post(`${API_URL}/signup`, formData);
      set({ user: res.data.user, isAuthenticated: true,  isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // Login
  login: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message || "Invalid Email or Password",
        isLoading: false,
       });
       throw error;
    }

  },

  // Verify Email
  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { token });
      set({
        message: res.data.message || "Email Verified Successfully",
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response.data.message || "Error Verifying Email",
        isLoading: false
       })
    }
    
  },

  // Check Auth
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message || "Error logging out",
        isLoading: false
       });
    }
  },

  // forget password
  forgetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/forget-password`, { email });
      set({
        message: res.data.message || "Reset link sent to email",
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response.data.message || "Error sending reset link",
        isLoading: false
       });
       throw error;
    } 
  },

  // Reset Password
  resetPassword: async (password, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, {password: password});
      set({
        message: res.data.message || "Password reset successfully",
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response.data.message || "Error resetting password",
        isLoading: false
       });
       throw error;
    }
  },

  // Google Login
  googleLogin: async () => {
    window.location.href = `${API_URL}/google`;
  },

  // Reset State
  resetError: () => {
    set({ error: null });
  }

}));