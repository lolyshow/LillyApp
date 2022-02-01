import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 5,
  },
  box: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    padding: 10,
    justifyContent: "center",
  },
  dateIcon: {
    height: 50,
    lineHeight: 21,
    flex: 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    // marginTop: 15
  },

  boxWrapper: {
    flex: 0.8,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
});

export default function TimePicker({
  label,
  value,
  onDateChange,
  showDate,
  showDatePicker,
}) {


  return (
    <View style={styles.container}>
      <View style={styles.boxWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TouchableWithoutFeedback onPress={showDatePicker}>
          <View style={styles.box}>
            {Platform.select({
              ios: (
                showDate ?  
                <DateTimePicker
                  testID="datePicker"
                  value={(value instanceof Date)  ? value  : new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  textColor="#17375e"
                />
                :
                <Text>{ (value instanceof Date)  ? value.toLocaleDateString() : value }</Text>
               
              ),
              android: (
                <>
                  {showDate && (
                    <DateTimePicker
                      testID="datePicker"
                      value={(value instanceof Date)  ? value  : new Date()}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onDateChange}
                      maximumDate={new Date()}
                      textColor="#17375e"
                    />
                  )}

                  <Text>{ (value instanceof Date)  ? value.toLocaleDateString() : value }</Text>
                </>
              ),
            })}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.dateIcon}>
        {Platform.select({
          ios: (
            
              <Icon name="time-outline" size={30} color="#17375e" />
           
          ),
          android: (
            <TouchableWithoutFeedback onPress={showDatePicker}>
              <Icon name="time-outline" size={30} color="#17375e" />
            </TouchableWithoutFeedback>
          ),
        })}
      </View>
    </View>
  );
}
