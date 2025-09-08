import { ExamAuthProvider } from "@/src/context/ExamAuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

const IconButton = ({ onPress, name, color = "#fff" }) => (
  <Pressable
    onPress={onPress}
    style={{ paddingHorizontal: 10 }}>
    <AntDesign
      name={name}
      size={24}
      color={color}
    />
  </Pressable>
);

const examLayout = () => {
  const router = useRouter();

  return (
    <ExamAuthProvider>
      <Stack screenOptions={{ animation: "slide_from_bottom" }}>
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
          name="examstart"
          options={{
            headerTitle: "Start Exam",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => <></>, // hides back button
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: "Exam Dashboard",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => <></>, // hides back button
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerTitle: "Online Exam Register",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => {
              return (
                <Pressable
                  onPress={() => router.back()}
                  style={{ paddingHorizontal: 10 }}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color="#fff"
                  />
                </Pressable>
              );
            },
          }}
        />
      </Stack>
    </ExamAuthProvider>
  );
};

export default examLayout;
