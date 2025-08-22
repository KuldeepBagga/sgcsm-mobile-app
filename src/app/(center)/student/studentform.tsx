import axiosClient from "@/axios";
import Button from "@/src/component/Button";
import CustomPicker from "@/src/component/CustomPicker";
import CustomTextInput from "@/src/component/CustomText";
import ProtectedRoute from "@/src/component/ProtectedRoute";
import { useAuth } from "@/src/context/AuthContext";
import data from "@/src/data/constant";
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

const studentform = () => {
  const router = useRouter();
  const { user } = useAuth();

  const formFields = {
    studentName: "",
    relation: "",
    fatherName: "",
    motherName: "",
    dateofBirth: "",
    dateofJoining: "",
    qualification: "",
    course: "",
    selectedState: "",
    phoneNo: "",
    adhaarNo: "",
    photo: {},
  };

  const [formData, setFormData] = useState(formFields);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [courseList, setCourseList] = useState();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

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

  const requiredFields = {
    studentName: "Student Name is required.",
    relation: "Relation is required",
    motherName: "Mother name is required",
    dateofBirth: "Date of birth is required",
    dateofJoining: "Date of joining is required",
    qualification: "Qualification is required",
    course: "Course is requried",
    selectedState: "State is required",
    phoneNo: "Phone no is required",
    //photo: "Photo is required",
  };

  if (formData.relation === "W/O") {
    requiredFields.husbandName = "Husband name is required";
  } else {
    requiredFields.fatherName = "Father name is required";
  }

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

    try {
      const res = await axiosClient.post("student/store", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setFormData(formFields); // Reset form fields
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.error || {});
      }
    } finally {
      setIsLoading(false);
      Alert.alert("Student Succesfully Added");
      router.push("/student/student");
    }
  }, [formData]);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await axiosClient.get("course");

        const courseItems = res.data.data.map((c) => ({
          label: c.course_name,
          value: c.course_name,
        }));

        setCourseList(courseItems);
      } catch (error) {
        Alert.alert("Something went wrong!");
      }
    };
    getCourse();
  }, []);
  return (
    <ProtectedRoute>
      <SafeAreaView
        style={styles.safeArea}
        edges={["left", "bottom", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <CustomTextInput
              label="Student Name"
              field="studentName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomPicker
              label="Relation"
              field="relation"
              formData={formData}
              setFormData={setFormData}
              error={error}
              pickerItems={data.RELATION}
            />
            {formData.relation === "W/O" ? (
              <CustomTextInput
                label="Husband Name"
                field="husbandName"
                formData={formData}
                setFormData={setFormData}
                error={error}
              />
            ) : (
              <CustomTextInput
                label="Father Name"
                field="fatherName"
                formData={formData}
                setFormData={setFormData}
                error={error}
              />
            )}

            <CustomTextInput
              label="Mother Name"
              field="motherName"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />
            <CustomTextInput
              label="Date of Birth"
              field="dateofBirth"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />
            <CustomTextInput
              label="Date of Joining"
              field="dateofJoining"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />

            <CustomPicker
              label="Qualification"
              field="qualification"
              formData={formData}
              setFormData={setFormData}
              error={error}
              pickerItems={data.QUALIFICATION}
            />

            <CustomPicker
              label="Course"
              field="course"
              formData={formData}
              setFormData={setFormData}
              error={error}
              pickerItems={courseList}
            />

            <CustomPicker
              label="State"
              field="selectedState"
              formData={formData}
              setFormData={setFormData}
              error={error}
              pickerItems={data.STATES}
            />
            <CustomTextInput
              label="Phone No"
              field="phoneNo"
              formData={formData}
              setFormData={setFormData}
              error={error}
            />
            <CustomTextInput
              label="Adhaar No"
              field="adhaarNo"
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
                    }}>
                    {error.photo}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {!isLoading ? (
            <Button
              btnText="Submit"
              onPress={handleSubmit}
            />
          ) : (
            <ActivityIndicator />
          )}
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default studentform;

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
