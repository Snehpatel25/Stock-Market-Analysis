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

  // Shared Axios instance with better defaults
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true,
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  // Enhanced request interceptor
  api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Enhanced response interceptor
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.code === "ECONNABORTED") {
        error.message = "Request timeout - server not responding";
      } else if (error.code === "ERR_NETWORK") {
        error.message = "Network error - cannot connect to server";
        // Redirect to maintenance page if multiple network errors occur
        if (localStorage.getItem('networkErrorCount') > 2) {
          navigate('/maintenance');
        }
      } else if (error.response?.status === 401) {
        // Auto-logout on 401 Unauthorized
        logout();
        error.message = "Session expired - please login again";
        navigate('/login', { state: { from: 'session-expired' } });
      } else if (error.response?.status === 404) {
        error.message = "Endpoint not found - please check server configuration";
      } else if (error.response?.status === 500) {
        error.message = "Server error - please try again later";
      }
      
      // Track network errors
      if (error.code === "ERR_NETWORK") {
        const errorCount = parseInt(localStorage.getItem('networkErrorCount') || '0') + 1;
        localStorage.setItem('networkErrorCount', errorCount.toString());
      }
      
      return Promise.reject(error);
    }
  );

  // Persistent session verification
  const verifySession = useCallback(async () => {
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
      console.error("Session verification failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthState({
        isLoggedIn: false,
        user: null,
        loading: false,
        error: "Session expired, please login again"
      });
    }
  }, [api]);

  // Verify session on mount and periodically
  useEffect(() => {
    verifySession();
    
    // Set up periodic session verification (every 5 minutes)
    const interval = setInterval(verifySession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifySession]);

  // Login method with enhanced error handling
  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    localStorage.removeItem('networkErrorCount');

    try {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

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
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Server error (${error.response.status})`;
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Register method with validation
  const register = async (userData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Client-side validation
      if (!userData.username || !userData.password || !userData.email) {
        throw new Error("Missing required fields");
      }

      const response = await api.post("/signup", userData);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Registration failed - invalid server response");
      }

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
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.error || 
                       error.response.data?.message || 
                       `Server error (${error.response.status})`;
      } else if (error.message === "Missing required fields") {
        errorMessage = "Please fill all required fields";
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Update user with optimistic UI updates
  const updateUser = async (updatedData) => {
    const previousUser = authState.user;
    
    try {
      // Optimistic update
      const tempUser = { ...previousUser, ...updatedData };
      setAuthState(prev => ({
        ...prev,
        user: tempUser
      }));
      localStorage.setItem("user", JSON.stringify(tempUser));

      const response = await api.put("/auth/user", updatedData);
      const updatedUser = response.data.user;

      // Final update after server confirmation
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Update error:", error);
      
      // Revert to previous state on error
      setAuthState(prev => ({
        ...prev,
        user: previousUser
      }));
      localStorage.setItem("user", JSON.stringify(previousUser));

      const errorMessage = error.response?.data?.error || 
                         "Update failed. Please try again.";
      
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      throw new Error(errorMessage);
    }
  };

  // Logout with cleanup
  const logout = useCallback(() => {
    // Async cleanup (like API call for server-side logout) can be added here
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null
    });
    navigate('/login');
  }, [navigate]);

  // Clear errors manually
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const contextValue = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    clearError,
    api,
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