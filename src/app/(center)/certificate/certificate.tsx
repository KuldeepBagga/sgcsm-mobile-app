import axiosClient from "@/axios";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

global.Buffer = global.Buffer || Buffer;

const CertificateCard = React.memo(
  ({ certificate, onViewMarksheet, downloadDocument }) => (
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
          onPress={() =>
            onViewMarksheet(
              certificate.enrollment_no,
              certificate.certificate_no
            )
          }
          style={styles.editBtn}
        >
          <Text style={styles.btnText}>View Marksheet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            downloadDocument(
              certificate.enrollment_no,
              certificate.certificate_no,
              certificate.certificate_type
            )
          }
          style={styles.deleteBtn}
        >
          <Text style={[styles.btnText]}>
            Download{" "}
            {certificate.certificate_type.charAt(0).toUpperCase() +
              certificate.certificate_type.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

const certificate = () => {
  const PAGE_SIZE = 100;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getCertificateData = async () => {
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
    ({ item, isloading }) => (
      <CertificateCard
        certificate={item}
        downloadMarksheet={() =>
          handleDownloadMarksheet(item.certificate_no, item.enrollment_no)
        }
        downloadDocument={() =>
          handleDocumentDownload(
            item.certificate_no,
            item.enrollment_no,
            item.certificate_type
          )
        }
      />
    ),
    []
  );

  const handleDownloadMarksheet = useCallback(
    async (certificate_no, enrollment_no) => {},
    []
  );

  const handleDocumentDownload = useCallback(
    async (certificate_no, enrollment_no, type) => {
      setIsDownloading(true);

      let URLPATH = "";

      if (type === "diploma") {
        URLPATH = "diploma/download";
      } else if (type === "certificate") {
        URLPATH = "certificate/download";
      }

      if (URLPATH === "") return Alert.alert("something went wrong!");

      try {
        const res = await axiosClient.post(
          URLPATH,
          {
            certificateNo: certificate_no,
            enrollmentNo: enrollment_no,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Content-Disposition": "attachment;filename=download.jpg",
            },
            responseType: "arraybuffer",
          }
        );

        // 3. Convert binary to base64
        const base64 = Buffer.from(res.data, "binary").toString("base64");

        // 4. Save base64 image temporarily
        const fileUri = FileSystem.cacheDirectory + "diploma.jpg";
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 5. Save the file to the device's Gallery
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Diplomas", asset, false);
        Alert.alert("Success", "Image saved to gallery!");
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          await logout();
          router.push("/");
        }
        // if (err.response.status === 422) {
        //   Alert.alert(err.response.message);
        // }
        Alert.alert(err.response.data.message);
      } finally {
        setIsDownloading(false);
      }
    },
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
      <View style={{ paddingVertical: 16 }}>
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          No record found!
        </Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      >
        {isDownloading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loaderText}>Please Wait...</Text>
            </View>
          </View>
        )}

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

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loaderBox: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});
