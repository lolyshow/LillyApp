import React from "react";
import { StyleSheet, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Text, View, KeyboardAvoidingView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function SelectBox({
  items,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  inputAndroid,
  inputIOS,
  iconName = "chevron-down-outline",
  iconColor = "gray",
  iconSize = 20,
  inputWidth,
  inputLabel,
  inputLabelColor = { color: "#707070" },
  inputWrapperStyle = styles.inputWrapper,
  inputBackGround = { backgroundColor: "#f7f7f7" }
}) {

  applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: 'stretch' };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={inputWrapperStyle}>
          <Text style={[inputLabelColor, styles.inputLabel]}>{inputLabel}</Text>
          <ScrollView>
            <RNPickerSelect
              placeholder={placeholder}
              items={items}
              onValueChange={onValueChange}
              disabled={disabled}
              style={{
                inputAndroid: [styles.inputAndroid, inputAndroid, applyWidth, inputBackGround],
                inputIOS: [styles.inputIOS, inputIOS, applyWidth, inputBackGround],
                iconContainer:
                  Platform.OS == "android"
                    ? styles.iconContainerAndroid
                    : styles.iconContainerIOS,
              }}
              value={value}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
              }}
            />
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  inputWrapper: {
    flexDirection: "column",
  },


  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    marginBottom: 5,
  },


  inputIOS: {

    height: 50,
    borderRadius: 10,
    padding: 10,
    color: "#17375e",
    // fontSize: 16,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
    // color: 'black',
    // paddingRight: 30,
  },
  inputAndroid: {
    height: 50,
    borderRadius: 10,
    padding: 10,
    color: "#17375e",
    // fontSize: 16,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
    // color: 'black',
    // paddingRight: 30,
  },
  iconContainerAndroid: {
    right: 10,
    bottom: 10,
  },
  iconContainerIOS: {
    bottom: 10,
    right: 10,
  },
});
