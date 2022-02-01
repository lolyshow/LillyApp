import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import GreenButton from "./GreenButton";

import TokenMaskedBox from "./TokenMaskedBox";

import BorderedCancelButton from "./BorderedCancelButton";

// const screenWidth = Math.round(Dimensions.get("window").width);

// const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  closeBox: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 20,
  },

  modalView: {
    height: "65%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    // alignItems: "center",
  },

  transactionPin: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: "10%",
  },

  pleaseInputYourTransactionPin: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginLeft: "10%",
  },

  buttonWrapper: {
    marginTop: 20,
    alignSelf: "stretch",
    paddingHorizontal: "7%",
    alignItems: "center",
  },
});

export default function Summary({
  closModal,
  visible,
  onPressContinue,
  value,
  setValue,
  tokenLength,
  buttonDisabled,
  continueButtonText,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
     
      <View style={[styles.container]}>
      <TouchableWithoutFeedback onPress={closModal}>
        <View style={{flex:1}} />
      </TouchableWithoutFeedback>

        <View style={styles.modalView}>
          <View style={styles.closeBox}>
            <BorderedCancelButton onPress={closModal} />
          </View>

          <Text style={styles.transactionPin}>Transaction PIN</Text>

          <Text style={styles.pleaseInputYourTransactionPin}>
            Please input your transaction pin
          </Text>

          <View style={{ alignSelf: "center", marginVertical: 10 }}>
            <TokenMaskedBox
              length={tokenLength}
              value={value}
              setValue={setValue}
              autoFocus={true}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <GreenButton
              text={continueButtonText ? continueButtonText : "Continue"}
              onPress={onPressContinue}
              disabled={buttonDisabled}
              // buttonWidth={300}
              processing={buttonDisabled}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
