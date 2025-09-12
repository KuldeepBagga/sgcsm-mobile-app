import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"#152d7cff"}
      />
      {/* <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#152d7cff" : "#fff"}
      /> */}
      <Stack
        screenOptions={{
          //animation: "slide_from_right",
          headerTitle: "SGCSM",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#152d7cff",
          },
        }}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="centerverification"
          options={{
            headerShown: true,
            title: "Center Verification",
          }}
        />
        <Stack.Screen
          name="bankdetails"
          options={{
            headerShown: true,
            title: "Bank Details",
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            headerShown: true,
            title: "Online Result",
          }}
        />
        <Stack.Screen
          name="franchiseform"
          options={{
            headerShown: true,
            title: "Apply for franchise",
          }}
        />
        <Stack.Screen
          name="(center)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(student)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(exam)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
