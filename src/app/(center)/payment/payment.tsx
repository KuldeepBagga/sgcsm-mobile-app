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

const PaymentCard = React.memo(({ item, onEdit }) => {
  const statusColors = {
    0: "#FFA500", // Waiting for approval
    1: "#FF0000", // Payment Not Received
    2: "#FFD700", // Pending
    3: "#008000", // Approved
  };

  const statusLabels = {
    0: "Waiting for approval",
    1: "Payment Not Received",
    2: "Pending",
    3: "Approved",
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.label}>
          Transaction No. / UTR No.:{" "}
          <Text style={styles.value}>{item.transaction_no}</Text>
        </Text>
        <Text style={styles.label}>
          Transaction Amount: <Text style={styles.value}>{item.amount}</Text>
        </Text>
        <Text style={styles.label}>
          Transaction Date:{" "}
          <Text style={styles.value}>{item.transaction_date}</Text>
        </Text>
        <Text style={styles.label}>
          Date Added:{" "}
          <Text style={styles.value}>{item.created_on || "N/A"}</Text>
        </Text>
        <Text style={styles.label}>
          Status:{" "}
          <Text
            style={[
              styles.value,
              { color: statusColors[item.status] || "#808080" },
            ]}>
            {statusLabels[item.status] || "N/A"}
          </Text>
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(item.id)}
          style={styles.editBtn}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function payment() {
  const PAGE_SIZE = 50;
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPayments(); // Initial load
  }, []);

  const fetchPayments = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await axiosClient.get(
        `payment/index/?page=${page}&limit=${PAGE_SIZE}`
      );
      const paymentData = res.data.data;

      setPayments((prev) => [...prev, ...paymentData]);
      setHasMore(paymentData.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <PaymentCard
        item={item}
        onEdit={(id) => router.push(`/(center)/payment/${id}`)}
      />
    ),
    [router]
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (payments.length <= 0 && !loading) {
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
            data={payments}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={renderItem}
            onEndReached={fetchPayments}
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
}

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
    justifyContent: "flex-end",
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
