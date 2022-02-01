import React from "react";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "column",
    //   marginTop:30,
    //   marginBottom:30
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
    paddingTop:0,
    borderStyle: "solid",
    borderBottomWidth: 1,
    // borderWidth:1,
    
    borderColor: "#ffffff",
    color: "#ffffff",
  },
});

export default function InputLinePassword({
  inputWidth,
  inputStyle = {},
  inputWrapperStyle = {},
  inputLabelStyle = {},
  inputLabel,
  onChangeText,
  placeholder,
  inputValue,
  keyboardType = "default",
  secureTextEntry=true,
  passwordViewToggle

}) {

  applyWidth =    {width:inputWidth ?? "100%"};
    
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"} >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.inputWrapper, inputWrapperStyle]}>
        <Text style={[styles.inputLabel, inputLabelStyle]}>{inputLabel}</Text>
        <Icon
          name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
          size={15}
          color="white"
          style={{ alignSelf: "flex-end" }}
          onPress={ passwordViewToggle }
        />
        <TextInput
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={inputValue}
          style={[styles.line155, inputStyle, applyWidth]}
        ></TextInput>
      </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


