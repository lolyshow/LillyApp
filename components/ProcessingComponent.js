import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform
 
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});

export default function ProcessingComponent({ visible , message, closModal}) {
  return (
    <Modal
    //   animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <View style={[styles.container]}>
          <Text style={{color:'#ffffff', fontSize:16}} >{message ??  "Loading"} </Text>
          <ActivityIndicator size="large" color={Platform.select({
              ios:'#ffffff',
              android: "#ffffff" 
          })}/>
      </View>
    </Modal>
  );
}
