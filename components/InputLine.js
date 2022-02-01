import React from "react";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "column",
  },

  inputLabel: {
    opacity: 0.5,
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  line155: {
    opacity: 0.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    // borderWidth:1,
    borderColor: "#ffffff",
    color: "#ffffff",
  },
});

export default function InputLine({
  inputWidth,
  inputStyle = {},
  inputWrapperStyle = {},
  inputLabelStyle = {},
  inputLabel,
  onChangeText,
  placeholder,
  inputValue,
  editable = true,
  keyboardType = "default",
  secureTextEntry = false,
}) {
  applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // behavior="position"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.inputWrapper, inputWrapperStyle]}>
          <Text style={[styles.inputLabel, inputLabelStyle]}>{inputLabel}</Text>
          <TextInput
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            // placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            editable={editable}
            value={inputValue}
            placeholderTextColor="#ffffff"
            style={[styles.line155, inputStyle, applyWidth]}
          ></TextInput>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
