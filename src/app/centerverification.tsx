import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function centerverification() {
  const router = useRouter();

  const [formData, setFormData] = useState({ centerCode: "" });
  const [error, setError] = useState({});
  const [centerDetails, setCenterDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!formData.centerCode.trim()) {
      setError({ centerCode: "Center code is required." });
      return;
    }

    setIsLoading(true);

    setError({});

    const form = new FormData();
    form.append("centerCode", formData.centerCode.trim());

    try {
      const response = await axiosClient.post("/center/verification", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCenterDetails(response.data.data);
      if (!isLoading) setFormData({ centerCode: "" });
      setIsLoading(false);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors || {});
      } else if (err.response?.status === 404) {
        setError({ centerCode: err.response.data.errors } || {});
      } else {
        console.error("Unexpected error:", err);
      }
      setIsLoading(false);
    }
  }, [formData.centerCode]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Center Verification</Text>
          <Text style={styles.subtitle}>Enter the center code to proceed</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Center Code"
            field="centerCode"
            formData={formData}
            setFormData={setFormData}
            error={error}
          />
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              btnText="Verifiy"
              onPress={handleSubmit}
            />
          )}
        </View>

        {centerDetails && (
          <View style={{ flex: 1, padding: 16 }}>
            <View style={styles.card}>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Director Name</Text>
                <Text style={styles.tableValue}>
                  {centerDetails[0].director_name ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Center Name</Text>
                <Text style={styles.tableValue}>
                  {centerDetails[0].center_name ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Center Code</Text>
                <Text style={styles.tableValue}>
                  {centerDetails[0].center_code ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>District & State</Text>
                <Text style={styles.tableValue}>
                  {centerDetails[0].district ?? ""}{" "}
                  {centerDetails[0].state ?? ""}
                </Text>
              </View>
            </View>
          </View>
        )}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingBottom: 4,
  },
  tableLabel: {
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  tableValue: {
    color: "#555",
    flex: 1,
    textAlign: "right",
  },
});
