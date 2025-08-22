import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function CustomTextInput({
  label,
  field,
  formData,
  setFormData,
  error,
  secureInput = false,
  keyboard = "default",
  canEdit = true,
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={formData[field]}
        keyboardType={keyboard}
        editable={canEdit}
        secureTextEntry={secureInput}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        style={styles.input}
      />
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#152d7cff",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    //fontSize: 12,
    marginTop: 4,
  },
});
