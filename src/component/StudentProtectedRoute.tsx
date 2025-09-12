import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useStudentAuth } from "../context/StudentAuthContext";

const StudentProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useStudentAuth();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "student") {
        await logout();
        Alert.alert("Authrization Error", "Your are not authorized");
        router.replace("/(student)/login");
      }
    };

    if (!user) {
      router.replace("/(student)/login");
    }

    if (!loading && !user) {
      router.replace("/(student)/login");
    }

    check();
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default StudentProtectedRoute;
