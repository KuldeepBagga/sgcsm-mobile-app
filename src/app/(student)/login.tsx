import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function StudentLoginScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({});
  const handleSubmit = () => {
    alert();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Student Login</Text>
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
