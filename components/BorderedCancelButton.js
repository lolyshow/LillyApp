import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Border = {
  width: 40,
  height: 40,
  borderRadius: 10,
  backgroundColor: "#eff6ff",
  padding: 5,
  justifyContent: "center",
  alignItems: "center",
};

export default function BorderedCancelButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={Border}>
        <Icon size={22} name="close-outline" color="#17375e"></Icon>
      </View>
    </TouchableOpacity>
  );
}
