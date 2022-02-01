import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  genderBorder: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // width: 150,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
  },

  genderBorderActive: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // width: 150,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#01cf13",
  },

  genderText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },

  genderBorderWrapper: {
    flex: 0.46,
    
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  labelWrapper: {
    marginBottom: 5,
  },
  genderSelectWrapper: {
    flexDirection: "row",
    justifyContent:'space-between'
  },
});
export default function GenderSelect({ value, onGenderChange }) {
    
  const [gender, setGender] = useState(value);

  const onValueChange = (gender) => {
    setGender(gender);
    onGenderChange(gender);
  };


  const  list =  [
      {label:"Male", value:"male", icon:"man"},
      {label:"Female", value:"female", icon:"woman"}
  ]

  return (
    <View style={styles.container}>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Gender</Text>
      </View>

      <View style={styles.genderSelectWrapper}>

          {
              list.map((gender, index)=>(

                <TouchableWithoutFeedback onPress={() => onValueChange(gender.value)} key={index}>
          <View style={styles.genderBorderWrapper}>
            <View style={value === gender.value ? styles.genderBorderActive : styles.genderBorder}>
              <Icon
                name={gender.icon}
                size={35}
                color={value === gender.value ? "#01cf13" : "#717171"}
              />
              <Text style={[ styles.genderText, (value === gender.value && { color: "#01cf13" }) ]}>{" "+gender.label}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

              ))
          }
            </View> 
    </View>
  );
}
