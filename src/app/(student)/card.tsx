import axiosClient from "@/axios";
import StudentProtectedRoute from "@/src/component/StudentProtectedRoute";
import { useStudentAuth } from "@/src/context/StudentAuthContext";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
const card = () => {
  const { user, loading, logout } = useStudentAuth();
  const [showHtml, setShowHtml] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({});

  useEffect(() => {
    const icard = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClient.get(`user/student/card`);
        console.log(res.data);
        setShowHtml(res.data.data);
      } catch (err) {
        Alert.alert("Result Not found");
      } finally {
        setIsLoading(false);
      }
    };

    icard();
  }, []);

  if (isLoading || loading) {
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size={"small"} />
      </View>
    );
  }
  return (
    <StudentProtectedRoute>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={styles.safeArea}>
        {showHtml && (
          <View style={{ flex: 1, marginTop: 20 }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: showHtml }}
              style={{ flex: 1 }}
              scalesPageToFit={true} // makes content auto-fit screen
            />
          </View>
        )}
      </SafeAreaView>
    </StudentProtectedRoute>
  );
};

export default card;

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
});
