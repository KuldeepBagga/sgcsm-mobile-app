import axiosClient from "@/axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axiosClient.get("user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data?.data ?? null);
      } catch (err) {
        if (err?.response?.status === 401) {
          await SecureStore.deleteItemAsync("token");
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const login = async (username, password) => {
    try {
      const res = await axiosClient.post(
        "user/student/login",
        { username, password },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const token = res.data?.token;
      if (!token) return false;

      await SecureStore.setItemAsync("token", token);

      // fetch user after login
      const userRes = await axiosClient.get("user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data?.data ?? null);

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        try {
          await axiosClient.post(
            "user/logout",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          // ignore backend logout failure
        }
      }

      await SecureStore.deleteItemAsync("token");
      setUser(null);
    } catch (err) {
      // fallback: still clear everything
      await SecureStore.deleteItemAsync("token");
      setUser(null);
    }
  };

  return (
    <StudentAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
