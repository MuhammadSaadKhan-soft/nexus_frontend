import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check login on refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await authAPI.getMe();

        if (res?.data?.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log("Auth check failed");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // login
  const login = useCallback(async (credentials) => {
    try {
      const res = await authAPI.login(credentials);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  }, []);

  // register
  const register = useCallback(async (data) => {
    try {
      const res = await authAPI.register(data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Register failed";
    }
  }, []);

  // logout
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {}

    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // update user
  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};