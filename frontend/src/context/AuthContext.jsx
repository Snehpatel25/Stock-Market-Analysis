// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  // Enhanced Axios instance with retry logic
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true,
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  // Request interceptor with token refresh logic
  api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if token is about to expire (within 5 minutes)
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (exp * 1000 - Date.now() < 300000) {
        try {
          const newToken = await refreshToken();
          config.headers.Authorization = `Bearer ${newToken}`;
          return config;
        } catch (err) {
          logout();
          throw err;
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  // Response interceptor with enhanced error handling
  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      // Handle token expiration (401) with refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          logout();
          return Promise.reject(err);
        }
      }

      // Enhanced error mapping
      const errorMap = {
        ECONNABORTED: "Request timeout - server not responding",
        ERR_NETWORK: "Network error - cannot connect to server",
        404: "Endpoint not found",
        500: "Server error - please try again later"
      };

      error.message = errorMap[error.code] || 
                     errorMap[error.response?.status] || 
                     error.response?.data?.message || 
                     "An unexpected error occurred";

      // Network error tracking
      if (error.code === "ERR_NETWORK") {
        const errorCount = parseInt(localStorage.getItem('networkErrorCount') || '0');
        localStorage.setItem('networkErrorCount', errorCount + 1);
        if (errorCount > 2) navigate('/maintenance');
      }

      return Promise.reject(error);
    }
  );

  // Token refresh function
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      return token;
    } catch (err) {
      throw new Error("Session expired - please login again");
    }
  };

  // Session verification with exponential backoff
  const verifySession = useCallback(async (retryCount = 0) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const response = await api.get("/protected");
      if (response.data?.user) {
        setAuthState({
          isLoggedIn: true,
          user: response.data.user,
          loading: false,
          error: null
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        throw new Error("Invalid session data");
      }
    } catch (err) {
      if (retryCount < 3) {
        const delay = Math.min(1000 * 2 ** retryCount, 30000);
        setTimeout(() => verifySession(retryCount + 1), delay);
        return;
      }
      console.error("Session verification failed:", err);
      logout();
    }
  }, [api]);

  // Login with session persistence
  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    localStorage.removeItem('networkErrorCount');

    try {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;

      if (!token || !user) throw new Error("Invalid server response");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        isLoggedIn: true,
        user,
        loading: false,
        error: null
      });

      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Login failed. Please try again.";

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw error;
    }
  };

  // Register with password strength check
  const register = async (userData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    // Client-side validation
    const { username, password, email } = userData;
    if (!username || !password || !email) {
      throw new Error("Please fill all required fields");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    try {
      const response = await api.post("/signup", userData);
      const { token, user } = response.data;

      if (!token || !user) throw new Error("Registration failed");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        isLoggedIn: true,
        user,
        loading: false,
        error: null
      });

      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Registration failed. Please try again.";

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw error;
    }
  };

  // Logout with server-side cleanup
  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthState({
        isLoggedIn: false,
        user: null,
        loading: false,
        error: null
      });
      navigate('/login');
    }
  }, [api, navigate]);

  // Initialize auth state
  useEffect(() => {
    verifySession();
    const interval = setInterval(verifySession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifySession]);

  // Context value
  const contextValue = {
    ...authState,
    login,
    register,
    logout,
    updateUser: async (data) => {
      try {
        const response = await api.put("/auth/user", data);
        const user = response.data.user;
        setAuthState(prev => ({ ...prev, user }));
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } catch (error) {
        const errorMessage = error.response?.data?.error || 
                           "Update failed. Please try again.";
        setAuthState(prev => ({ ...prev, error: errorMessage }));
        throw error;
      }
    },
    clearError: () => setAuthState(prev => ({ ...prev, error: null })),
    refreshToken,
    verifySession
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};