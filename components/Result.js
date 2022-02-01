import React from "react";
import { Text, View, StyleSheet, Image, Modal,TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BorderedCancelButton from "./BorderedCancelButton";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal:"5%"

  },
  box: {
    // width: 335,
    // height: 392,
    // flex: 0.5,
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
    paddingRight: "5%",
    paddingLeft: "9%",
    paddingTop:"10%",
    paddingBottom:'35%'
  },

  transactionStatus: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  message: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },

  IconWrapper: {
    marginBottom: 15,
  },
  userMessageWrapper: {
    marginBottom: 5,
    marginTop: 10,
  },

  statusMessageWrapper: {
    width: 254,
    marginBottom: 15,
  },
  closeBox: {
    top: 0,
    alignSelf: "flex-end",
    marginTop:"-5%"
    
  },
});

export default function Result({
  status = "",
  userMessage,
  closModal,
  visible,
  children,
  header
}) {
  let iconName;
  let statusMessage;
  let color;
  let IconRender;

  switch (Number(status)) {
    case 200:
      iconName = "checkmark-circle";
      statusMessage = "Transaction Successful";
      color = "#01cf13";


      break;

    case 300:
      iconName = "close-circle";
      statusMessage = "Transaction Unsuccessful";
      color = "#f36952";
      

      break;

    default:
      iconName = "time-outline";
      statusMessage = "Transaction Processing";
      color = "rgba(0, 0, 0, 0.4)";
     
      break;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <View style={styles.container}>

      <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        <View style={styles.box}>
          <View style={styles.closeBox}>
            <BorderedCancelButton onPress={closModal} />
          </View>

          <View style={styles.IconWrapper}>
            <Icon name={iconName} size={95} color={color} />
           
          </View>

          <View styles={styles.statusMessageWrapper}>
            <Text style={styles.transactionStatus}>{header ?? statusMessage}</Text>
          </View>

          <View style={styles.userMessageWrapper}>
            <Text style={styles.message}>{userMessage}</Text>
          </View>

          <View>
            {children}
          </View>


        </View>
      
        <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
