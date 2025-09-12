import axiosClient from "@/axios";
import StudentProtectedRoute from "@/src/component/StudentProtectedRoute";
import { useStudentAuth } from "@/src/context/StudentAuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dashboard = () => {
  const { user, logout, loading } = useStudentAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const res = await axiosClient.get("user/student/details");

        if (res.status === 200 && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          await logout();
          Alert.alert("Unauthorized", "You are not authorized");
        }
      }
      setIsLoading(false);
    };

    getStudentDetails();
  }, []);

  if (loading || isLoading) {
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <StudentProtectedRoute>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <ScrollView>
          <View style={styles.tableRow2}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              WELCOME, {user?.name}
            </Text>
          </View>
          <View style={{ paddingVertical: 16 }}>
            <View
              style={[styles.form, { marginTop: 20, position: "relative" }]}>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Student Name : </Text>
                <Text style={styles.tableValue}>{user?.name}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>User Name : </Text>
                <Text style={styles.tableValue}>{user?.username}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Mobile / Phone : </Text>
                <Text style={styles.tableValue}>
                  {data?.phno} , {data?.mbn}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Exam Time : </Text>
                <Text style={styles.tableValue}>{data?.state}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Adhar Number : </Text>
                <Text style={styles.tableValue}>{data?.aadhar_no}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Center Name : </Text>
                <Text style={styles.tableValue}>{data?.cname}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Course : </Text>
                <Text style={styles.tableValue}>{data?.cources}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/result")}>
                <AntDesign
                  name="filetext1"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>ONLINE RESULT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/(student)/card")}>
                <AntDesign
                  name="printer"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>ICARD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/(exam)/login")}>
                <AntDesign
                  name="login"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>EXAM LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/certificateverification")}>
                <AntDesign
                  name="checkcircleo"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>CERTIFICATE VERIFICATION</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </StudentProtectedRoute>
  );
};

export default dashboard;

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
