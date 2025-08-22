import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useNavigation, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { AuthProvider } from "../../context/AuthContext";

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

export default function CenterLayout() {
  const router = useRouter();
  const navigation = useNavigation();

  const dashboardHeaderOptions = {
    headerShadowVisible: false,
    headerTintColor: "#fff",
    headerStyle: { backgroundColor: "#152d7cff" },
    headerLeft: () => (
      <IconButton
        onPress={() => router.navigate("/(center)/dashboard")}
        name="home"
      />
    ),
  };

  return (
    <AuthProvider>
      <Stack screenOptions={{ animation: "slide_from_left" }}>
        <Stack.Screen
          name="login"
          options={{
            headerShadowVisible: false,
            headerTitle: "",
            presentation: "modal",
            headerStyle: { backgroundColor: "#f4f4f4" },
            headerLeft: () => (
              <IconButton
                onPress={() => navigation.goBack()}
                name="close"
                color="#000"
              />
            ),
          }}
        />

        <Stack.Screen
          name="dashboard"
          options={{
            ...dashboardHeaderOptions,
            headerTitle: "Dashboard",
          }}
        />

        <Stack.Screen
          name="student/student"
          options={{
            headerTitle: "Manage Student",
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/dashboard")}
                name="arrowleft"
              />
            ),
            headerRight: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/student/studentform")}
                name="plus"
              />
            ),
          }}
        />

        <Stack.Screen
          name="student/[id]"
          options={{
            headerTitle: "Edit Student",
            headerShadowVisible: false,
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/student/student")}
                name="arrowleft"
              />
            ),
          }}
        />

        <Stack.Screen
          name="student/studentform"
          options={{
            headerTitle: "Add Student",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/student/student")}
                name="arrowleft"
                color="#fff"
              />
            ),
          }}
        />

        <Stack.Screen
          name="payment/payment"
          options={{
            headerTitle: "Payments",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/dashboard")}
                name="arrowleft"
                color="#fff"
              />
            ),
            headerRight: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/payment/paymentform")}
                name="plus"
              />
            ),
          }}
        />

        <Stack.Screen
          name="payment/paymentform"
          options={{
            headerTitle: "Add Payment",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/payment/payment")}
                name="arrowleft"
                color="#fff"
              />
            ),
          }}
        />

        <Stack.Screen
          name="payment/[id]"
          options={{
            headerTitle: "Edit Payment",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/payment/payment")}
                name="arrowleft"
                color="#fff"
              />
            ),
          }}
        />

        <Stack.Screen
          name="certificate/certificate"
          options={{
            headerTitle: "Certificates",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#152d7cff" },
            headerLeft: () => (
              <IconButton
                onPress={() => router.navigate("/(center)/dashboard")}
                name="arrowleft"
                color="#fff"
              />
            ),
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
