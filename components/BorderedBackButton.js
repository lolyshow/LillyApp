import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Border = {
  width: 40,
  height: 60,
  // borderRadius: 10,
  // backgroundColor: "#eff6ff",
  // padding: 5,
  justifyContent: "center",
  alignItems: "center",
};

export default function BorderedBackButton({ onPress,col="#2a9afb" }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={Border}>
        <Icon size={50} name="chevron-back-outline" color={col}></Icon>
      </View>
    </TouchableOpacity>
  );
}
