import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BorderedCancelButton from "./BorderedCancelButton";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  box: {
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
    paddingVertical: "10%",
  },

  status: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
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
    marginBottom: 15,
  },
  closeBox: {
    top: 0,
    alignSelf: "flex-end",
  },
});

export default function ClipBoardModal({
  closModal,
  visible,
  itemCopied,
  message,
  children,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <TouchableWithoutFeedback onPress={closModal}>
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.closeBox}>
              <BorderedCancelButton onPress={closModal} />
            </View>

            <View style={styles.IconWrapper}>
              <Icon name="copy" size={100} color="#01cf13"></Icon>
            </View>

            <View styles={styles.statusMessageWrapper}>
              <Text style={styles.status}>{itemCopied}</Text>
            </View>

            <View style={styles.userMessageWrapper}>
              <Text style={styles.message}>{message}</Text>
            </View>

            <View>{children}</View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
