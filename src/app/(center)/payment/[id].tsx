import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Editstudent() {
  const formFields = {
    transactionNo: "",
    amount: "",
    transactionDate: "",
    message: "",
  };

  const requriedFields = {
    transactionNo: "Transaction no is required.",
    amount: "Amount is required.",
    transactionDate: "Transaction date is required",
  };

  const router = useRouter();
  const [error, setError] = useState({});
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState(formFields);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    const newErrors = {};
    for (const [key, message] of Object.entries(requriedFields)) {
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
    form.append("_method", "PUT");
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await axiosClient.post(`payment/update/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setFormData(formFields); // Reset form fields
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.error || {});
      }
    } finally {
      setIsLoading(false);
      Alert.alert("Payment record successfully updated.");
      router.push("/payment/payment");
    }
  }, [formData]);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axiosClient.get(`payment/edit/${id}`);
        if (res.status === 200 && res.data.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      } catch (err) {
        Alert.alert("Something went wrong!");
      }
    };

    if (id) fetchPayment();
  }, [id]);

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={styles.safeArea}
        edges={["left", "bottom", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <CustomTextInput
              label="Transaction No. / UTR No."
              field="transactionNo"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Amount"
              field="amount"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Transaction Date"
              field="transactionDate"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />
            <CustomTextInput
              label="Message"
              field="message"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />
          </View>

          <Button
            btnText="Submit"
            onPress={handleSubmit}
          />
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
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
    fontSize: 25,
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
