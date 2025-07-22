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

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    timeout: 10000,
    headers: { "Content-Type": "application/json" }
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.code === "ECONNABORTED") {
        error.message = "Request timeout - server not responding";
      } else if (error.code === "ERR_NETWORK") {
        error.message = "Network error - cannot connect to server";
      } else if (error.response?.status === 404) {
        error.message = "Endpoint not found - please check server configuration";
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const response = await api.get("/auth/verify");
          if (response.data.valid) {
            setAuthState({
              isLoggedIn: true,
              user: JSON.parse(userData),
              loading: false,
              error: null
            });
          } else {
            throw new Error("Invalid token");
          }
        } catch (err) {
          console.error("Session expired:", err);
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

  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.post("/api/login", credentials);
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
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "Login failed. Try again.";
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  const register = async (userData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.post("/api/signup", userData);
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
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.error || "Registration failed.";
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

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
      const errorMessage = error.response?.data?.error || "Update failed.";
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null
    });
  };

  const contextValue = {
    ...authState,
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