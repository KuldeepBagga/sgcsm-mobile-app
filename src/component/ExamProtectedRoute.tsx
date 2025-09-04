// src/components/ProtectedRoute.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useExamAuth } from "../context/ExamAuthContext";

export default function ExamProtectedRoute({children,}: {children: React.ReactNode;}) {
  const { user, loading, logout } = useExamAuth();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "exam") {
        await logout();
        router.replace("/(exam)/login");
      }
    };

    if(!user)
    {
      router.replace("/(exam)/login");
    }

    if (!loading && !user) {
      router.replace("/(exam)/login");
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
}
