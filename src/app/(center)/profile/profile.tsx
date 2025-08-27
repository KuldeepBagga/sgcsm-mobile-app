import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function profile() {
  const fields = {
    centerName: "",
    centerCode: "",
    directorName: "",
    state: "",
    city: "",
    district: "",
    pinCode: "",
    mobileNumber: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    _method: "PUT",
    photo: {},
  };

  const requiredFields = {
    centerName: "Center name is required",
    centerCode: "Center code is required",
    directorName: "Director name is required",
    state: "State is required",
    city: "City is required",
    district: "District is required",
    pinCode: "PinCode is required",
    mobileNumber: "Mobile Number is required",
    phoneNumber: "Phone Number is required",
    emailAddress: "Email Address is required",
    address: "Address is required",
    //photo: "Photo is required"
  };

  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState(fields);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        photo: {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || "upload.jpg",
          type: result.assets[0].mimeType || "image/jpeg",
        },
      }));
    }
  };

  const handleSubmit = useCallback(async () => {
    const newErrors = {};
    for (const [key, message] of Object.entries(requiredFields)) {
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

    try {
      setIsLoading(true);
      const form = new FormData();
      for (const key in formData) {
        if (key === "photo" && formData[key]) {
          form.append("photo", {
            uri: formData.photo.uri, // now works
            name: formData.photo.fileName || "upload.jpg",
            type: formData.photo.mimeType || "image/jpeg",
          });
        } else {
          form.append(key, formData[key]);
        }
      }

      const res = await axiosClient.post("center/profile/update", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        Alert.alert("Profile updated successfully.");
        router.push("/(center)/dashboard");
      }
    } catch (err) {
      if (err.response.status === 422) {
        setError(err.response.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const check = async () => {
    if (user.userType !== "franchise") {
      await logout();
      router.replace("/");
    }
  };

  const loadUser = async () => {
    try {
      const res = await axiosClient.get("center/details");
      setFormData((prev) => ({
        ...prev,
        centerName: res.data.data.center_name,
        centerCode: res.data.data.center_code,
        directorName: res.data.data.director_name,
        state: res.data.data.state,
        city: res.data.data.city,
        district: res.data.data.district,
        pinCode: res.data.data.pin,
        mobileNumber: res.data.data.mobile_no,
        phoneNumber: res.data.data.phone_no,
        emailAddress: res.data.data.email_id,
        password: res.data.data.password,
        address: res.data.data.address,
        photo: {
          uri: `https://sgcsmindia.org/uploads/institute/${res.data.data.photo}`,
        },
      }));
    } catch (err) {
      Alert.alert("something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    check();
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea} edges={["left", "bottom", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <CustomTextInput
              label="Center Name"
              field="centerName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Center Code"
              field="centerCode"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Director Name"
              field="directorName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="State"
              field="state"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="City"
              field="city"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="District"
              field="district"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Pin Code"
              field="pinCode"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Mobile Number"
              field="mobileNumber"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Phone Number"
              field="phoneNumber"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Email Address"
              field="emailAddress"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomTextInput
              label="Address"
              field="address"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            {formData.photo.uri ? (
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={{ uri: formData.photo.uri }}
                  style={[styles.image, { height: 200, width: 200 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={require("@/assets/images/placeholder.jpg")}
                  style={[styles.image, { height: 200, width: 200 }]}
                  resizeMode="contain"
                />
                {error.photo && (
                  <Text
                    style={{
                      color: "red",
                      marginTop: 4,
                      //fontSize: 12
                    }}
                  >
                    {error.photo}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Button btnText="Submit" onPress={handleSubmit} />
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
  image: {
    flex: 1,
    borderWidth: 1, // thickness of the border
    borderColor: "#212222ff", // border color (blue in this case)
    borderRadius: 10, // optional, makes corners rounded
  },
});
