import axiosClient from "@/axios";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CertificateCard = React.memo(
  ({ certificate, onViewMarksheet, onViewDiploma }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.label}>
          Certificate Type:{" "}
          <Text style={styles.value}>{certificate.certificate_type}</Text>
        </Text>
        <Text style={styles.label}>
          Enrollment No.:{" "}
          <Text style={styles.value}>{certificate.enrollment_no}</Text>
        </Text>
        <Text style={styles.label}>
          Student Name:{" "}
          <Text style={styles.value}>{certificate.student_name}</Text>
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onViewMarksheet(certificate)}
          style={styles.editBtn}>
          <Text style={styles.btnText}>View Marksheet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onViewDiploma(certificate)}
          style={styles.deleteBtn}>
          <Text style={styles.btnText}>View Diploma</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

const certificate = () => {
  const PAGE_SIZE = 100;
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getCertificateData = async () => {
    setIsLoading(true);

    try {
      const res = await axiosClient.get(
        `certificate/index?page=${page}&limit=${PAGE_SIZE}`
      );
      const newCertificate = res.data.data;
      if (res.status === 200 && res.data.data)
        setCertificates((prev) => [...prev, ...newCertificate]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCertificateData();
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <CertificateCard
        certificate={item}
        onViewMarksheet={() => alert("hello")}
        onViewDiploma={() => alert(item.id)}
      />
    ),
    []
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (certificates.length <= 0 && !isLoading) {
    return (
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          fontWeight: "bold",
        }}>
        No record found!
      </Text>
    );
  }

  return (
    <ProtectedRoute>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={certificates}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={renderItem}
            onEndReached={getCertificateData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default certificate;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  form: { marginBottom: 16 },
  button: {
    backgroundColor: "#152d7cff",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  studentName: { fontSize: 14 },

  title: {
    fontSize: 25,
    fontWeight: 500,
    padding: 10,
    color: "#152d7cff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  info: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontWeight: "600",
    color: "#111",
  },
  status: {
    fontWeight: "bold",
  },
  approved: {
    color: "#2ecc71", // green
  },
  pending: {
    color: "#e67e22", // orange
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  editBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
