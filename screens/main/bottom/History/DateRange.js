import React, {useState} from "react";
import { Text, View, StyleSheet, Image, Modal , Platform, TouchableWithoutFeedback} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";


import WhiteButton from "../../../../components/WhiteButton";

import DatePicker from "../../../../components/DatePicker";
import BorderedCancelButton from "../../../../components/BorderedCancelButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  box: {
    // width: 335,
    // height: 392,
    flex: 0.7, 
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    paddingRight: "8%",
    paddingLeft: "9%",
  },

  closeBox: {
    top: 0,
    alignSelf: "flex-end",
    marginRight: 5,
    marginTop: 10,
    marginBottom:20
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#c7c7c7",
    borderRadius: 10,
  },
  dateIcon: {
    padding: 10,
  },

  input: {
    color: "#17375e",
    paddingTop: 10,
    paddingRight: 0,
    paddingBottom: 10,
    paddingLeft: 10,
    width: 220,
    height: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
    
  },
});

export default function DateRange({
  closModal,
  visible,
  dateFrom,
  dateTo,
  changeDateFrom,
  changeDateTo,
  showDateTo,
  setShowDateTo,
  showDateFrom,
  setShowDateFrom,
  onSearch
  

}) {
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <View style={styles.container}>
    
        <View style={styles.box}>
          <View style={styles.closeBox}>
            <BorderedCancelButton onPress={closModal} />
          </View>

          <View style={{marginBottom:10}}>
            <Text style={styles.title}>Enter Date by Date</Text>
          </View>

          <View style={styles.inputWrapper}>
            <DatePicker
              value={dateFrom}
              onDateChange={changeDateFrom}
              label="From"
              showDate={  Platform.OS ==="ios"? true : showDateFrom}      
              showDatePicker={setShowDateFrom}
              // width={200}
            />
          </View>

          <View style={styles.inputWrapper}>
          <DatePicker
              value={dateTo}
              onDateChange={changeDateTo}
              label="To"
              showDate={Platform.OS ==="ios"? true :showDateTo}
              showDatePicker={setShowDateTo}
              // width={200}
            />
          </View>

          <View style={{marginTop:10}}>
            <WhiteButton onPress={onSearch} bordered text="Search History" />
          </View>
          
        </View>
     
      </View>
    </Modal>
  
  );
}
