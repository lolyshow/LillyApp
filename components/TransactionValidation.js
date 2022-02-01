import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import GreenButton from "./GreenButton";

import BorderedBackButton from "./BorderedBackButton";

import PrintComponents from "./PrintComponents";

import { IconButton } from "react-native-paper";

import ProvidersLogo from "../Helpers/ProvidersLogo";

import Helper from "../Helpers/Helper";

import dateFormat from "dateformat";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: "7%",
  },

  titleWrapper: {
    flexDirection: "row",
    // justifyContent:'center',
    alignItems:'center',
    marginBottom: 40,
  },

  backWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
  },

  title: {
    width: 185,
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: "center",
    marginLeft:40,
    color: "#2a9afb",
    // marginLeft: "8%",
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  rectangle3116: {
    alignSelf: "stretch",
    // borderRadius: 20,
    backgroundColor: "#f7f7f7",
    padding: 20,
    paddingBottom: 60,
    paddingTop: 40,
  },

  transactionValidation: {
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
    fontSize: 17,
    fontWeight: "500",
    fontStyle: "normal",
    fontWeight:'bold',
    lineHeight: 24,
    letterSpacing: 0,
    // color: "#333333",
    textAlign: "left",
    paddingRight: 10,
  },

  summaryText_: {
    fontSize: 15,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: "#333333",
    textAlign: "right",
    flex: 1,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
  },
});

const setPrintLogo = (product) => {
  try {
    const productName = product
      .toString()
      .toUpperCase()
      .replace("_POSTPAID", "")
      .replace("_PREPAID", "")
      .replace("_VTU", "")
      .replace("_BUNDLE", "");

    let baseUrl = "https://www.lillypayment.com/storage/";

    const logo = ProvidersLogo.find(
      (e) =>
        productName == e.value.toUpperCase() ||
        (e.category != "discos" && productName.includes(e.value.toUpperCase()))
    );

    let fullPath = Helper.getPropValue(logo, "image")
      ? baseUrl + logo.imagePath
      : null;

    return fullPath;
  } catch (error) {
    return null;
  }
};

const TransactionValidation = ({
  title,
  backPress,
  buttonPress,
  buttonDisabled = false,
  list = [],
  continueButtonText,
  header,
  showPrint = false,
  loading = false,
  routes = [],
  receiptLogo = null,
}) => {
  const routesArr = [];
  for (const route_ of routes) {
    routesArr.push(route_.split(" "));
  }

  const logo = receiptLogo ? setPrintLogo(receiptLogo) : null;
  
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

       <View style={styles.titleWrapper}>
         
         <BorderedBackButton onPress={backPress} />
         <View>
           <Text style={styles.title}>{title} </Text>
         </View>
       </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        

        {routes.length > 1 && (
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
            </View>
          </View>
        )}

        <View style={styles.rectangle3116}>
          <View style={styles.transactionValidationWrapper}>
            <Text style={styles.transactionValidation}>
              {header ? header : "Transaction Validation"}
            </Text>
          </View>

          <View style={styles.summaryWrapper}>
            {list.map((item, index) => (
              <View style={styles.summaryRow} key={index}>
                <Text style={styles.summaryText}>{item.label}:</Text>
                <Text style={[styles.summaryText_]}>{item.value}</Text>
              </View>
            ))}
            {!list.find((el) => el.label.toString().toLocaleLowerCase() == "date") && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Date</Text>
                <Text style={[styles.summaryText_]}>
                  {dateFormat(new Date(), "dd/mm/yyyy hh:MM:ss tt")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {showPrint && (
          <View style={styles.submitButtonWrapper}>
            <PrintComponents
              showHomeReturn={true}
              showPrintReceipt={true}
              showDownloadPdf={true}
              showExternalPrintReceipt={true}
              printObjectsArray={list}
              image={logo}
            />
          </View>
        )}

        {!showPrint && (
          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text={continueButtonText ? continueButtonText : "Continue"}
              disabled={buttonDisabled}
              processing={buttonDisabled}
              onPress={buttonPress}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionValidation;
