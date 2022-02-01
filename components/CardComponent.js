import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, Text, View , Dimensions} from "react-native";
import GreenButton from "./GreenButton";
import InputBox from "./InputBox";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  column: {
    flexDirection: "column",
    marginTop: 15,
  },

  info: {
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },

  platform: {
    alignSelf: "center",
    marginTop: 40,
    flexDirection: "row",
    alignItems:'center'
  },
  poweredBy: {
    // width: 67,
    // height: 14,
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#acacac",
  },
  platformProvider: {
    // width: 52,
    // height: 14,
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  buttonWrapper: {
    marginVertical: 20,
  },
});

export default function CardComponent({
  platformProvider,
  logo,
  info,
  cardNo,
  onChangeCardNo,
  cvc,
  onChangeCvc,
  expiry,
  onChangeExpiry,
  amount,
  onChangeAmount,
  buttonDisabled,
  onPressContinue,
  editableFields= true
}) {
  return (
    <View>
        <View style={styles.column}>
          <InputBox
            keyboardType="numeric"
            placeholder="Enter card Number"
            inputLabel="Card Number"
            inputValue={cardNo}
            onChangeText={onChangeCardNo}
            editable={editableFields}
          />
        </View>
        <View style={styles.row}>
          <InputBox
            keyboardType="default"
            placeholder="MM/YY"
            inputLabel="Expiry date"
            inputValue={expiry}
            inputStyle={{width:screenWidth*0.35}}
            onChangeText={onChangeExpiry}
            editable={editableFields}
            maxLength ={5} 
          />

          <InputBox
            keyboardType="numeric"
            placeholder="CVV"
            inputLabel="CVV"
            inputValue={cvc}
            inputStyle={{width:screenWidth*0.3}}
            onChangeText={onChangeCvc}
            editable={editableFields}
            maxLength ={3} 
          />
        </View>

        <View style={styles.column}>
          <InputBox
            keyboardType= "numeric"
            placeholder="Enter amount"
            inputLabel="Amount"
            inputValue={amount}
            onChangeText={onChangeAmount}
            // editable={editableFields}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.info}>{info}</Text>
        </View>

        <View style={styles.platform}>
          <Text style={styles.poweredBy}>Powered By {"  "} </Text>

          <Image resizeMode="contain" source={logo} style={{ width: 35, height: 40 }} />

          <Text style={styles.platformProvider}> {"  "} {platformProvider}</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <GreenButton
            text="Continue"
            onPress={onPressContinue}
            disabled={buttonDisabled}
            processing={buttonDisabled}
          />
        </View>
    </View>
  );
}
