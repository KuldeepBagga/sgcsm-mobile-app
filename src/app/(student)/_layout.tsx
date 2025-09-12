import {
  StudentAuthProvider,
  useStudentAuth,
} from "@/src/context/StudentAuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

const StudentLayout = () => {
  const router = useRouter();

  return (
    <StudentAuthProvider>
      <Stack screenOptions={{ animation: "none" }}>
        <Stack.Screen
          name="login"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#f4f4f4",
            },
            presentation: "modal",
            headerLeft: () => {
              return (
                <Pressable
                  onPress={() => router.back()}
                  style={{ paddingHorizontal: 10 }}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="#000"
                  />
                </Pressable>
              );
            },
          }}
        />

        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: "Dashboard",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerTintColor: "#fff",
            headerLeft: () => {
              return (
                <Pressable
                  onPress={() => router.navigate("/(student)/dashboard")}
                  style={{ paddingHorizontal: 10 }}>
                  <AntDesign
                    name="home"
                    size={24}
                    color="#fff"
                  />
                </Pressable>
              );
            },
            headerRight: () => {
              const { logout, user } = useStudentAuth();
              return (
                <Pressable
                  onPress={async () => await logout()}
                  style={{ paddingHorizontal: 10 }}>
                  <AntDesign
                    name="poweroff"
                    size={24}
                    color="#fff"
                  />
                </Pressable>
              );
            },
          }}
        />

        <Stack.Screen
          name="card"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            presentation: "modal",
            headerStyle: { backgroundColor: "#f4f4f4" },
            headerLeft: () => {
              return (
                <Pressable
                  onPress={() => router.push("/(student)/dashboard")}
                  style={{ paddingHorizontal: 10 }}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="#000000ff"
                  />
                </Pressable>
              );
            },
          }}
        />
      </Stack>
    </StudentAuthProvider>
  );
};

export default StudentLayout;
