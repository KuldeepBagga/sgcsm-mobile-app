import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomPicker from "@/src/component/CustomPicker";
import CustomTextInput from "@/src/component/CustomText";
import data from "@/src/data/constant";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const franchiseform = () => {
  const fields = {
    centerName: "",
    directorName: "",
    selectedState: "",
    district: "",
    block: "",
    city: "",
    pincode: "",
    email: "",
    phone: "",
  };
  const [formData, setFormData] = useState(fields);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSubmit = useCallback(async () => {
    const requiredFields = {
      centerName: "Center name is required.",
      directorName: "Director name is required.",
      selectedState: "State is required.",
      district: "District is required.",
      block: "Block is required.",
      city: "City is required.",
      pincode: "Pincode is required.",
      email: "Email is required.",
      phone: "Phone is required.",
    };

    const newErrors = {};

    for (const [key, message] of Object.entries(requiredFields)) {
      if (!formData[key]?.trim()) {
        newErrors[key] = message;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);
    setError({});

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const req = await axiosClient.post("franchise/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (req.status === 201) {
        setRegisterSuccess(true);
        setFormData(fields); // Reset form
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors || {});
      } else if (err.response?.status === 404) {
        setError(err.response.data.errors || {});
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!isLoading && registerSuccess ? (
          <>
            <View style={styles.container}>
              {/* Optional success icon */}
              <Ionicons
                name="checkmark-circle"
                size={80}
                color="#4BB543"
                style={styles.icon}
              />

              <Text style={[styles.heading, { fontWeight: "bold" }]}>
                Thank You!
              </Text>
              <Text style={[styles.subText, { fontWeight: "bold" }]}>
                Your registration has been submitted successfully.
              </Text>
              <Text style={styles.subText}>We’ll get back to you shortly.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                btnText="Go Back"
                onPress={() => router.back()}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Apply for franchise</Text>
              <Text style={styles.subtitle}>
                Please fill the form all fields are mandatory
              </Text>
            </View>
            <View style={styles.form}>
              <CustomTextInput
                label="NAME OF THE STUDY CENTER"
                field="centerName"
                formData={formData}
                canEdit={isLoading ? false : true}
                setFormData={setFormData}
                error={error}
              />
              <CustomTextInput
                label="CENTER HEAD / DIRECTOR'S NAME"
                field="directorName"
                canEdit={isLoading ? false : true}
                formData={formData}
                setFormData={setFormData}
                error={error}
              />
              <CustomPicker
                label="State"
                field="selectedState"
                formData={formData}
                canEdit={isLoading ? false : true}
                setFormData={setFormData}
                error={error}
                pickerItems={data.STATES}
              />
              <CustomTextInput
                label="DISTRICT"
                field="district"
                formData={formData}
                canEdit={isLoading ? false : true}
                setFormData={setFormData}
                error={error}
              />

              <CustomTextInput
                label="BLOCK"
                field="block"
                formData={formData}
                setFormData={setFormData}
                canEdit={isLoading ? false : true}
                error={error}
              />

              <CustomTextInput
                label="CITY"
                field="city"
                formData={formData}
                setFormData={setFormData}
                canEdit={isLoading ? false : true}
                error={error}
              />

              <CustomTextInput
                label="PINCODE"
                field="pincode"
                keyboard="numeric"
                formData={formData}
                setFormData={setFormData}
                canEdit={isLoading ? false : true}
                error={error}
              />

              <CustomTextInput
                label="EMAIL"
                field="email"
                formData={formData}
                setFormData={setFormData}
                canEdit={isLoading ? false : true}
                error={error}
              />

              <CustomTextInput
                label="PHONE / MOBILE"
                field="phone"
                keyboard="numeric"
                formData={formData}
                setFormData={setFormData}
                canEdit={isLoading ? false : true}
                error={error}
              />

              {isLoading ? (
                <ActivityIndicator size={22} />
              ) : (
                <Button
                  btnText="Submit"
                  onPress={handleSubmit}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default franchiseform;

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
    fontSize: 35,
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
