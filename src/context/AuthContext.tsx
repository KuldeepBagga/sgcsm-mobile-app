// src/context/AuthContext.js
import axiosClient from "@/axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user details
  const [loading, setLoading] = useState(true); // loading state
  const router = useRouter();

  // Load token & fetch user details on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          const res = await axiosClient.get("user/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.data);
        } catch (err) {
          if (err.response.status === 401) {
            await SecureStore.deleteItemAsync("token");
            router.push("/");
          }
          //console.log("Auth error:", err.message);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // login function
  const login = async (username, password) => {
    try {
      const res = await axiosClient.post(
        "user/login",
        { username, password },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { token } = res.data;
      await SecureStore.setItemAsync("token", token);
      if (token) {
        try {
          const res = await axiosClient.get("user/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.data);
        } catch (err) {
          if (err.response.status === 401) {
            await SecureStore.deleteItemAsync("token");
            router.push("/");
          }
          //console.log("Auth error:", err.message);
        }
      }
      return true;
    } catch (error) {
      console.log("Login error:", error.message);
      return false;
    }
  };

  // logout function
  const logout = async () => {
    try {
      // Get token from SecureStore
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        await axiosClient.post(
          "user/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Remove token from SecureStore
      await SecureStore.deleteItemAsync("token");

      // Clear user state
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => useContext(AuthContext);
