import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomPicker({
  label,
  field,
  formData,
  setFormData,
  error,
  pickerItems = [],
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData[field]}
          onValueChange={(value) =>
            setFormData({ ...formData, [field]: value })
          }
          style={styles.picker}>
          <Picker.Item
            label="Select an option..."
            value=""
          />
          {pickerItems.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {error[field] && <Text style={styles.error}>{error[field]}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#152d7cff",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 53,
    width: "100%",
    color: "#000", // Ensures text is visible (especially on Android)
    backgroundColor: "#fff", // Ensures background isn’t transparent
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
