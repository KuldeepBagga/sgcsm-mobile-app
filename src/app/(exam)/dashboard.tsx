import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import ExamProtectedRoute from "@/src/component/ExamProtectedRoute";
import { useExamAuth } from "@/src/context/ExamAuthContext";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
  const [result, setResult] = useState(null);
  useEffect(() => {
    const check = async () => {
      if (user.userType !== "exam") {
        await logout();
        return null;
        //router.replace("/(exam)/login");
      }

      if (!user) {
        await logout();
        return null;
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
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) getUserDetails();
  }, [user]);

  useEffect(() => {
    const getExamResult = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClient.get("exam/result/show");
        if (res.status === 200) {
          setResult(res.data.data);
        }
      } catch (err) {
        if (err.response.status === 401) {
          Alert.alert("You are not authorized");
          await logout();
          //router.replace("/(exam)/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (data?.A_STATUS !== "Completed" && data?.R_STATUS !== "Completed") {
      getExamResult();
    }
  }, []);

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
    //const timeLeft = await SecureStore.getItemAsync("timeLeft");
    // if (!timeLeft) {
    await SecureStore.setItemAsync("timeLeft", String(data?.A_EXAM_TIME));
    // }
    if (data?.R_IS_ASSIGNED !== 1) {
      Alert.alert("Exam is not set");
      return null;
    }
    if (data?.A_STATUS === "Completed" && data?.R_STATUS === "Completed") {
      Alert.alert("Exam is already completed");
      return null;
    }

    router.replace("/(exam)/examstart");
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
        style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <ScrollView>
          <View style={styles.tableRow2}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              WELCOME, {user?.name}
            </Text>
          </View>
          {data?.A_STATUS !== "Completed" && data?.R_STATUS !== "Completed" ? (
            <View style={{ paddingVertical: 16 }}>
              <View
                style={[styles.form, { marginTop: 20, position: "relative" }]}>
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
              <View style={{ paddingVertical: 20 }}>
                <Button
                  btnText={"START EXAM"}
                  onPress={handleStartExam}
                />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.form,
                {
                  marginTop: 20,
                },
              ]}>
              {/* Score */}
              <Text style={styles.score}>{result?.OR_CORRECT_ANSWER}</Text>
              {/* Qualification Message */}
              <Text style={styles.qualified}>
                YOU ARE <Text style={styles.highlight}>QUALIFIED</Text> WITH{" "}
                <Text style={styles.highlight}>FIRST DIVISION</Text>
              </Text>
              {/* Details Table */}
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.label}>INSTITUTE/CENTER</Text>
                  <Text style={styles.value}>{result?.S_CENTER_NAME}</Text>
                </View>
                <View style={styles.rowAlt}>
                  <Text style={styles.label}>STUDENT NAME</Text>
                  <Text style={styles.value}>{result?.S_STUDENT_NAME}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>FATHER NAME</Text>
                  <Text style={styles.value}>{result?.S_FATHER_NAME}</Text>
                </View>
                <View style={styles.rowAlt}>
                  <Text style={styles.label}>COURSE</Text>
                  <Text style={styles.value}>{result?.S_COURSE}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>OBTAINED MARKS</Text>
                  <Text style={styles.value}>
                    {result?.OR_CORRECT_ANSWER}/{result?.OR_TOTAL_QUESTIONS}
                  </Text>
                </View>
                <View style={styles.rowAlt}>
                  <Text style={styles.label}>PERCENTAGE</Text>
                  <Text style={styles.value}>
                    {result?.OR_TOTAL_QUESTIONS > 0
                      ? `${(
                          (Number(result?.OR_CORRECT_ANSWER) /
                            Number(result?.OR_TOTAL_QUESTIONS)) *
                          100
                        ).toFixed(2)} %`
                      : "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ paddingVertical: 20 }}>
            <Button
              btnText={"Logout"}
              onPress={async () => await logout()}
            />
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

  //new table

  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  qualified: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: {
    color: "red",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontWeight: "bold",
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: "right",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
