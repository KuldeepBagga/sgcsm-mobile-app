// src/components/ProtectedRoute.tsx
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedRoute({children,}: {children: React.ReactNode;}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "franchise") {
        await logout();
        router.replace("/");
      }
    };

    if(!user)
    {
      router.replace("/(center)/login");
    }

    if (!loading && !user) {
      router.replace("/(center)/login");
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
