import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
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

  useEffect(() => {
    const check = async () => {
      if (user.userType !== "franchise") {
        await logout();
        router.replace("/");
      }
    };
    check()
  },[]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(center)/login");
  };
  return (
    <ProtectedRoute>
      <SafeAreaView style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
        <ScrollView>
          <View style={styles.tableRow}>
            <Text style={[styles.tableValue, { fontSize: 16 }]}>
              Hello, {user?.username}
            </Text>
          </View>
          <View style={[styles.form, { marginTop: 20 }]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Center Name : </Text>
              <Text style={styles.tableValue}>
                Sanjay gandhi computer saksharta mission
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Center Code : </Text>
              <Text style={styles.tableValue}>UP-101</Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/student/student")}>
                <AntDesign
                  name="team"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>MANAGE STUDENT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/payment/payment")}>
                <AntDesign
                  name="creditcard"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>PAYMENT RECORD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => router.replace("/certificate/certificate")}>
                <AntDesign
                  name="checkcircleo"
                  size={40}
                  color="#152d7cff"
                />
                <Text style={styles.cardText}>DOWNLOAD CERTIFICATE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => handleLogout()}>
                <AntDesign
                  name="poweroff"
                  size={40}
                  color="#152d7cff"
                />
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
});
