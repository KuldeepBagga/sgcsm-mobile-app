import axiosClient from "@/axios";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [centerData, setCenterData] = useState({});

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "franchise") {
        await logout();
        router.replace("/");
      }
    };
    check();

    const getCenterDetails = async () => {
      try {
        const res = await axiosClient.get("center/details");
        if (res.status === 200) setCenterData(res.data.data);
      } catch (err) {
        setIsLoading(false);
        Alert.alert("something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) getCenterDetails();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    router.replace("/(center)/login");
  };

  if (isLoading)
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size={"small"} />
      </View>
    );

  return (
    <ProtectedRoute>
      <SafeAreaView style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
        <ScrollView>
          <View style={styles.tableRow2}>
            <Text
              style={[styles.tableValue2, { fontSize: 16, fontWeight: "bold" }]}
            >
              Hello, {user?.username}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.navigate("/profile/profile")}
            >
              <FontAwesome5
                name="pencil-alt"
                size={16}
                color="black"
                style={styles.icon}
              />
              <Text style={[styles.text, { fontWeight: 500 }]}>Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.form, { marginTop: 20, position: "relative" }]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Center Name : </Text>
              <Text style={styles.tableValue}>
                {centerData.center_name ?? ""}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Director's Name : </Text>
              <Text style={styles.tableValue}>
                {centerData.director_name ?? ""}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Center Code : </Text>
              <Text style={styles.tableValue}>
                {centerData.center_code ?? ""}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Address : </Text>
              <Text style={styles.tableValue}>
                {centerData.city ?? ""}, {centerData.state ?? ""}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>State : </Text>
              <Text style={styles.tableValue}>{centerData.state ?? ""}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Contact Details : </Text>
              <Text style={styles.tableValue}>
                {centerData.phone_no ?? ""} , {centerData.mobile_no ?? ""}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/student/student")}
              >
                <AntDesign name="team" size={40} color="#152d7cff" />
                <Text style={styles.cardText}>MANAGE STUDENT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/payment/payment")}
              >
                <AntDesign name="creditcard" size={40} color="#152d7cff" />
                <Text style={styles.cardText}>PAYMENT RECORD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/certificate/certificate")}
              >
                <AntDesign name="checkcircleo" size={40} color="#152d7cff" />
                <Text style={styles.cardText}>DOWNLOAD CERTIFICATE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => handleLogout()}
              >
                <AntDesign name="poweroff" size={40} color="#152d7cff" />
                <Text style={styles.cardText}>LOGOUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
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
