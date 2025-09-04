import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import ExamProtectedRoute from "@/src/component/ExamProtectedRoute";
import { useExamAuth } from "@/src/context/ExamAuthContext";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const { user, logout, loading } = useExamAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "exam") {
        await logout();
        router.replace("/(exam)/login");
      }
    };
    check();

    const getUserDetails = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClient.get("exam/user");
        if (res.status === 200) {
          setData(res.data.data);
        }
      } catch (err) {
        if (err.response.status === 401) {
          await logout();
          router.replace("/(exam)/login");
        } else {
          Alert.alert("something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) getUserDetails();
  }, [user]);

  function convertMinutes(minutes) {
    if (!minutes || minutes === 0) return "00:00:00"; // handle null/undefined

    let totalSeconds = Math.floor(minutes * 60);

    let hours = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(mins).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  }

  const handleStartExam = useCallback(async () => {
    console.log(
      data?.A_EXAM_ID,
      data?.A_STATUS,
      data?.R_COMPLETED,
      data?.R_ENROLLMENT_NO,
      data?.R_ID,
      data?.R_IS_ASSIGNED,
      data?.R_STATUS,
      data?.A_EXAM_TIME
    );
  }, [data]);

  if (loading || isLoading) {
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ExamProtectedRoute>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ paddingVertical: 20, paddingHorizontal: 20 }}
      >
        <ScrollView>
          <View style={styles.tableRow2}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              WELCOME, {user?.name}
            </Text>
          </View>

          <View style={[styles.form, { marginTop: 20, position: "relative" }]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Student Name : </Text>
              <Text style={styles.tableValue}>{user?.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Enrollment No : </Text>
              <Text style={styles.tableValue}>{data?.R_ENROLLMENT_NO}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Course : </Text>
              <Text style={styles.tableValue}>{data?.R_COURSE}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Exam Time : </Text>
              <Text style={styles.tableValue}>
                {convertMinutes(data?.A_EXAM_TIME)}
              </Text>
            </View>
          </View>
          <View style={{ paddingVertical: 16 }}>
            <Button btnText={"START EXAM"} onPress={handleStartExam} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ExamProtectedRoute>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#d1d7f854",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    borderColor: "#8791c954",
    borderWidth: 1,
    borderStyle: "solid",
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  form: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  tableLabel: {
    fontWeight: "bold",
    fontSize: 14,
    width: 120,
  },
  tableValue: {
    fontSize: 14,
    flex: 1,
    fontWeight: "bold",
  },

  tableRow2: {
    flexDirection: "row", // Row layout
    justifyContent: "space-between", // Optional: space out text and button
    alignItems: "center", // Vertical alignment
  },
  button: {
    flexDirection: "row", // Align icon and text side by side
    alignItems: "center",
    backgroundColor: "#d1d7f854",
    borderColor: "#8791c954",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 5,
    borderRadius: 6,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    color: "black",
  },
});
