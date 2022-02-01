import React from "react";
import { StyleSheet, ScrollView, Platform, TouchableWithoutFeedback, Keyboard , Text, View, KeyboardAvoidingView} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SelectLine({
  items,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  inputAndroid,
  inputIOS,
  iconName = "chevron-down-outline",
  iconColor = "gray",
  iconSize=20, 
  inputWidth,
  inputLabel,
  inputLabelStyle,
  inputWrapperStyle
}) {

  applyWidth =  inputWidth ?  {width:inputWidth} : {alignSelf:'stretch'};
 
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"} >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={[styles.inputWrapper, inputWrapperStyle]}>
    <Text style={[styles.inputLabel, inputLabelStyle ]}>{inputLabel}</Text> 
    <ScrollView>
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={onValueChange}
        disabled={disabled}
        style={{
          inputAndroid: [styles.inputAndroid, inputAndroid, applyWidth],
          inputIOS: [styles.inputIOS, inputIOS, applyWidth],
          iconContainer:
            Platform.OS == "android"
              ? styles.iconContainerAndroid
              : styles.iconContainerIOS,
        }}
        value={value}
        useNativeAndroidPickerStyle={false}
        // textInputProps={{ underlineColorAndroid: 'black'}}
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
    opacity: 0.5,
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },


  inputIOS: {

    opacity: 0.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
    // fontSize: 16,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
    // color: 'black',
    // paddingRight: 30,
  },
  inputAndroid: {
    opacity: 0.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
    // fontSize: 16,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
    // color: 'black',
    // paddingRight: 30,
  },
  iconContainerAndroid: {
    bottom: 1,
    right: 15,
  },
  iconContainerIOS: {
    bottom: 1,
    right: 15,
  },
});
