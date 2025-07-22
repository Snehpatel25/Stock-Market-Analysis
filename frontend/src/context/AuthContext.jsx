// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
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

  // Shared Axios instance with better configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true,
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  // Request interceptor for auth token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.code === "ECONNABORTED") {
        error.message = "Request timeout - server not responding";
      } else if (error.code === "ERR_NETWORK") {
        error.message = "Network error - cannot connect to server";
      } else if (error.response?.status === 401) {
        // Auto logout if 401 response returned from api
        logout();
        navigate('/login');
        error.message = "Session expired - please login again";
      } else if (error.response?.status === 403) {
        error.message = "Forbidden - you don't have permission";
      } else if (error.response?.status === 404) {
        error.message = "Endpoint not found";
      } else if (error.response?.status === 500) {
        error.message = "Server error - please try again later";
      }
      return Promise.reject(error);
    }
  );

  // Verify token on initial load
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const response = await api.get("/auth/verify");
          if (response.data.valid) {
            const user = JSON.parse(userData);
            setAuthState({
              isLoggedIn: true,
              user,
              loading: false,
              error: null
            });
            
            // Redirect admin users to admin dashboard
            if (user.isAdmin) {
              navigate('/admin');
            }
          } else {
            throw new Error("Invalid token");
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
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    verifySession();
  }, []);

  // Login method with enhanced error handling
  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const endpoint = credentials.userType === 'admin' 
        ? '/auth/admin/login' 
        : '/auth/login';
      
      const response = await api.post(endpoint, {
        username: credentials.username,
        password: credentials.password
      });

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

      // Redirect based on user role
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate(`/${user.username}`);
      }

      return user;

    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes("timeout")) {
        errorMessage = "Server is not responding. Please try again later.";
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
      const response = await api.post("/auth/register", userData);
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

      // Redirect after registration
      navigate(`/${user.username}`);

      return user;

    } catch (error) {
      console.error("Register error:", error);

      let errorMessage = "Registration failed.";
      if (error.response?.data?.errors) {
        // Handle validation errors from server
        errorMessage = Object.values(error.response.data.errors)
          .map(err => err.message)
          .join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Update user profile
  const updateUser = async (updatedData) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const response = await api.put("/auth/user", updatedData);
      const updatedUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false
      }));

      return updatedUser;

    } catch (error) {
      console.error("Update error:", error);
      
      let errorMessage = "Update failed. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  // Logout with cleanup
  const logout = () => {
    // Optional: Send logout request to server
    api.post('/auth/logout').catch(err => console.error('Logout error:', err));
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Reset auth state
    setAuthState({
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null
    });

    // Redirect to login page
    navigate('/login');
  };

  const contextValue = {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    isAdmin: authState.user?.isAdmin || false,
    username: authState.user?.username || null,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    updateUser,
    api
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);