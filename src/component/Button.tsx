import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Button = ({ btnText, onPress, btnBgColor = "#152d7cff",btnTxtColor="#f4f4f4"}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: btnBgColor,
          padding: 15,
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: btnTxtColor,
            fontWeight: "bold",
            textAlign: "center",
          }}>
          {btnText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
