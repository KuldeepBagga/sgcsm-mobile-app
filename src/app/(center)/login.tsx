import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CenterLoginScreen() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(center)/dashboard");
    }
  }, [user]);

  const handleSubmit = async () => {
    setError({});
    const success = await login(formData.username, formData.password);
    if (success) {
      router.replace("/(center)/dashboard");
    } else {
      setError({ username: "Invalid username or password" });
    }
  };

  if (loading || user) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Center Login</Text>
          <Text style={styles.subtitle}>
            Enter your login details to proceed further
          </Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="User Name"
            field="username"
            formData={formData}
            setFormData={setFormData}
            error={error}
          />
          <CustomTextInput
            label="Password"
            field="password"
            formData={formData}
            secureInput={true}
            setFormData={setFormData}
            error={error}
          />
        </View>

        <Button
          btnText="Login"
          onPress={handleSubmit}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginVertical: 20,
          }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#161717" }} />
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ color: "#161717", fontWeight: "500", fontSize: 14 }}>
              or
            </Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#161717" }} />
        </View>

        <View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              btnText="Apply for franchise"
              btnBgColor="#99031d"
              onPress={() => router.navigate("/franchiseform")}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    //justifyContent: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#152d7cff",
  },
  subtitle: {
    fontWeight: "500",
    paddingVertical: 10,
    color: "#010924ff",
  },
  form: {
    marginBottom: 20,
  },
});
