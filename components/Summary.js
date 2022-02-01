import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import GreenButton from "./GreenButton";

import WhiteButton from "./WhiteButton";

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
    paddingRight: "2%",
  },

  modalView: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    paddingHorizontal: "4%",
    paddingTop: 20,
    // marginTop :'30%',
    paddingBottom: "20%",
  },

  transactionSummary: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    marginLeft: "4%",
  },

  buttonWrapper: {
    marginTop: 10,
    alignItems: "center",
  },

  detailBox: {
    marginTop: 15,
    paddingHorizontal: "6%",
    paddingVertical: "7%",
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "space-between",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  
  },
  valueText: {
    fontSize: 13,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "right",
    color: "#17375e",
    flex:1
  },

  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dce7f4",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "stretch",
  },
});

export default function Summary({
  closModal,
  visible,
  onPressContinue,
  details,
  total,
  continueButtonText,
  header,
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
          <View style={{ flex: 1}} />
        </TouchableWithoutFeedback>

        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <View style={styles.closeBox}>
              <BorderedCancelButton onPress={closModal} />
            </View>

            <Text style={styles.transactionSummary}>
              {header ? header : "Summary"}
            </Text>

            <View style={styles.detailBox}>
              {details.map((item, index) => (
                <View style={styles.summaryRow} key={index}>
                  <Text style={styles.labelText}>{item.label}</Text>
                  <Text style={styles.valueText}>{item.value}</Text>
                </View>
              ))}

              {total && (
                <>
                  <View style={styles.line37}></View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.labelText}>Total</Text>
                    <Text style={styles.valueText}>{total}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.buttonWrapper}>
              <GreenButton
                text={continueButtonText ? continueButtonText : "Make Payment"}
                onPress={onPressContinue}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <WhiteButton bordered text="Cancel" onPress={closModal} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
