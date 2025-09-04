import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import { useExamAuth } from "@/src/context/ExamAuthContext";

import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CenterLoginScreen() {
  const { login, user, logout, loading } = useExamAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const handleSubmit = useCallback(async () => {
    setError({});
    setIsLoading(true);
    const success = await login(formData.username, formData.password);
    
    if (success) {
      router.replace("/(exam)/dashboard");
    } else {
      setError({ username: "Invalid username or password" });
      setIsLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    setIsLoading(false);
    if (!loading && user) {
      router.replace("/(exam)/dashboard");
    }
  }, [user]);

  if (isLoading) return <ActivityIndicator />;

  if (loading || user) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Exam Login</Text>
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
          <Button
            btnText="Register for exam"
            btnBgColor="#99031d"
            onPress={() => router.push("/")}
          />
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
