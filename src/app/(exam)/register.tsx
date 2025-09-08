import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fields = {
  studentName: "",
  enrollmentNo: "",
  course: "",
  userName: "",
  password: "",
};

export default function () {
  const [formData, setFormData] = useState(fields);
  const [error, setError] = useState({});

  const handleSubmit = useCallback(async () => {
    alert();
  }, [formData]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"height"}
        keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Online Exam Registration</Text>
            <Text style={styles.subtitle}>
              Please fill the form all fields are mandatory
            </Text>
          </View>

          <View style={styles.form}>
            <CustomTextInput
              label="STUDENT NAME"
              field="studentName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="ENTROLLMENT NO"
              field="enrollmentNo"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="COURSE"
              field="course"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="USER NAME"
              field="userName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="PASSWORD"
              field="password"
              formData={formData}
              secureInput={true}
              setFormData={setFormData}
              error={error}
            />

            <Button
              btnText={"Submit"}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#152d7cff",
  },
  subtitle: {
    fontWeight: "500",
    paddingVertical: 10,
    color: "red",
  },
  form: {
    marginBottom: 20,
  },
  container: {
    //flex: 1,
    backgroundColor: "#f7f9fc",
    borderColor: "#dadadaff",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
});
