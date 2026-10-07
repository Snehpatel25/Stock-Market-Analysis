// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      user = null;
    }
    return {
      isLoggedIn: !!token && !!user,
      user,
      loading: false,
      error: null
    };
  });

  const api = axios.create({
    baseURL:
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.PROD
        ? "https://stock-market-analysis-silk.vercel.app"
        : "http://localhost:5000"),
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
          const response = await api.get("/api/auth/verify");
          if (response.data?.valid && response.data?.user) {
            setAuthState(prev => ({
              ...prev,
              isLoggedIn: true,
              user: response.data.user,
              loading: false,
              error: null
            }));
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.warn("Session expired or invalid:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuthState({
              isLoggedIn: false,
              user: null,
              loading: false,
              error: "Session expired, please login again"
            });
          } else {
            console.warn("Session check fallback to cached session:", err.message);
            setAuthState(prev => ({ ...prev, loading: false }));
          }
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