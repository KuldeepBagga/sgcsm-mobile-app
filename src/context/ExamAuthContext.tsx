import axiosClient from "@/axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const ExamAuthContext = createContext();

export const ExamAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user details
  const [loading, setLoading] = useState(true); // loading state
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("token");
      setLoading(true);
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

  //userlogin
  const login = async (username, password) => {
    try {
      const res = await axiosClient.post(
        "exam/login",
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

  //logout

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
    <ExamAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </ExamAuthContext.Provider>
  );
};

export const useExamAuth = () => useContext(ExamAuthContext)