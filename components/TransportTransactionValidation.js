import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import GreenButton from "./GreenButton";
import { IconButton } from "react-native-paper";
import BorderedBackButton from "./BorderedBackButton";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: 40,
    // alignItems:'center'
  },

  titleWrapper: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 40,
  },

  backWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    // padding: 5,
  },

  title: {
    width: 211,
    //   height: 60,
    //   fontFamily: "Gilroy",
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: 40,
  },

  submitButtonWrapper: {
    marginTop: 20,
    alignSelf: "center",
  },

  rectangle3116: {
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    padding: 20,
    paddingBottom: 60,
    paddingTop: 40,
  },

  transactionValidation: {
    // width: 170,
    // height: 19,
    // fontFamily: "Gilroy",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
  transactionValidationWrapper: {},
  summaryWrapper: {
    marginTop: 20,
  },
  summaryText: {
    // height: 19,
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#acacac",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    flexWrap: "wrap",
  },
});

const TransportTransactionValidation = ({
  title,
  backPress,
  buttonPress,
  buttonDisabled = false,
  list,
  routes,
  continueButtonText,
}) => {
  var routesArr = [];
  for (const route_ of routes) {
    routesArr.push(route_.split(" "));
  }
  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text style={{ color: "#fff" }}>Processing </Text>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton onPress={backPress} />
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "#17375e", fontWeight: "bold" }}>
              {routesArr[0]}
            </Text>
            {/* <Text style={{ fontSize: 12, color: "#acacac" }}>
              {routesArr[0]}
            </Text> */}
          </View>
          <View style={{ flex: 1 }}>
            <IconButton
              icon="bus"
              color="#01cf13"
              size={30}
              style={{
                opacity: 0.3,
                backgroundColor: "#c4f4c8",
                borderRadius: 5,
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "#17375e", fontWeight: "bold" }}>
              {routesArr[1]}
            </Text>
            {/* <Text style={{ fontSize: 12, color: "#acacac" }}>
              {routesArr[1]}
            </Text> */}
          </View>
        </View>

        <View style={styles.rectangle3116}>
          <View style={styles.transactionValidationWrapper}>
            <Text style={styles.transactionValidation}>
              Transaction Validation
            </Text>
          </View>

          <View style={styles.summaryWrapper}>
            {list.map((item, index) => (
              <View style={styles.summaryRow} key={index}>
                <Text style={styles.summaryText}>{item.label}</Text>
                <Text style={styles.summaryText}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.submitButtonWrapper}>
          <GreenButton
            text={continueButtonText ? continueButtonText : "Proceed"}
            disabled={buttonDisabled}
            processing={buttonDisabled}
            onPress={buttonPress}
            
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TransportTransactionValidation;
