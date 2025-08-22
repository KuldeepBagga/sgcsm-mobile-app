import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function certificateverification() {
  const router = useRouter();

  const [formData, setFormData] = useState({ certificateNo: "" });
  const [error, setError] = useState({});
  const [certificateDetails, setCertificateDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!formData.certificateNo.trim()) {
      setError({ certificateNo: "Certificate no is required." });
      return;
    }

    setIsLoading(true);

    setError({});

    const form = new FormData();
    form.append("certificateNo", formData.certificateNo.trim());

    try {
      const response = await axiosClient.post("/certificate/verify", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCertificateDetails(response.data.data);
      if (!isLoading) setFormData({ certificateNo: "" });
      setIsLoading(false);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors || {});
      } else if (err.response?.status === 404) {
        setError({ certificateNo: err.response.data.errors } || {});
      } else {
        console.error("Unexpected error:", err);
      }
      setIsLoading(false);
    }
  }, [formData.certificateNo]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Certificate Verification</Text>
          <Text style={styles.subtitle}>
            Enter the certificate no to proceed
          </Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Certificate No"
            field="certificateNo"
            formData={formData}
            keyboard={"numeric"}
            setFormData={setFormData}
            error={error}
          />
        </View>

        <Button
          btnText="Verifiy"
          onPress={handleSubmit}
        />

        {certificateDetails && (
          <View style={{ flex: 1, padding: 16 }}>
            <View style={styles.card}>
              <View style={[styles.tableRow,{flex:1,alignItems:"center",justifyContent:"center"}]}>
                <Image
                  source={{
                    uri: `https://sgcsmindia.org/uploads/user/studentpic/${certificateDetails[0].photo}`,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: "cover",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#000",
                  }}
                />
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Certificate No.</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].certificate_no ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Candidate Name</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].student_name ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Date of Birth</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].dob ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>S/O</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].father_name ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Course</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].course ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>From</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].course_duration ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Grade</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].grade ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Certificate Issue Date</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].issue_date ?? ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Issuing Branch</Text>
                <Text style={styles.tableValue}>
                  {certificateDetails[0].cname ?? ""}
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
    fontSize: 31,
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
