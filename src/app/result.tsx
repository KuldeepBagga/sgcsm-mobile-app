import Button from "@/src/component/Button";
import CustomTextInput from "@/src/component/CustomText";
import axios from "axios";
import { useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function result() {
  const navigation = useNavigation();
  const [showHtml, setShowHtml] = useState(null);
  const [formData, setFormData] = useState({
    registation_no: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({});

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("registation_no", formData.registation_no);
      
      const res = await axios.post(
        "https://sgcsmindia.org/certificate/marksheet?show=false",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowHtml(res.data);
    } catch (err) {
      Alert.alert("Result Not found");
    }finally{
      setIsLoading(false);
    }
  }, [formData]);

  if(isLoading)
  {
    return(
      <View style={{paddingVertical:16}}>
          <ActivityIndicator size={"small"}/>
      </View>
    )
  }

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Online Result</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Enrollment No"
            field="registation_no"
            formData={formData}
            setFormData={setFormData}
            error={error}
          />
        </View>

        <Button
          btnText="Submit"
          onPress={handleSubmit}
        />

        {showHtml && (
          <View style={{ height: 500, marginTop:20 }}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: showHtml }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
