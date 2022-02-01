import React, { Component, useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
import Config from "../../../../Helpers/Config";
import POS from "../../../../native_modules/POS";
import axios from "axios";
import Network from "../../../../Helpers/Network";

function StartScreen() {
  const [processing, setProcessing] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {}, []);

  const submitForm = async () => {
    if (amount) {
      let url = Config.base_url + "/pos/check/status";

      try {
        setProcessing(true);
        let response = await axios.get(url).then((res) => res.data);
        setProcessing(false);

        let { status, message } = response;

        if (status == "200") {
          chargeCard();
        } else {
          Alert.alert("Error", message.toString());
        }
      } catch (error) {
        setProcessing(false);
        Alert.alert("Error", error.toString());
      }
    } else {
      return Alert.alert("Error", "Please enter an amount to continue");
    }
  };

  const chargeCard = () => {
    console.log("started");
    let type = "Purchase";
    if (amount) {
      POS.pay(parseFloat(amount), type, (responseCode, data) => {
        if ("00" == responseCode) {
          fundWalletValidate(data);
        } else if ("02" == responseCode) {
          Alert.alert("Error", "Transaction Failed");
        } else if ("03" == responseCode) {
          Alert.alert("Error", "Transaction Cancelled");
        } else if ("04" == responseCode) {
          Alert.alert("Error", "Invalid Format");
        } else if ("05" == responseCode) {
          Alert.alert("Error", "Wrong Parameter");
        } else if ("06" == responseCode) {
          Alert.alert("Error", "Transaction Timeout");
        } else if ("09" == responseCode) {
          Alert.alert("Error", "Activity Cancelled");
        } else {
          Alert.alert("Error", "Intent failed to pass result");
        }
      });
    } else {
      Alert.alert("Validation", "Amount is empty!");
    }
  };

  const fundWalletValidate = async (data) => {
    try {
      setProcessing(true);

      let body = {
        serviceCode: "POS",
        response: data,
        amount: data.amount,
        type: "Global Accelerex",
        id: global.user.id,
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      setProcessing(false);

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        Alert.alert("Message", message.toString());
      } else {
        Alert.alert("Error", message.toString());
      }
    } catch (error) {
      setProcessing(false);
      Alert.alert("Error ", "An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      {processing ? (
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
          <Text style={{ color: "#fff", fontSize: 15 }}>Please wait...</Text>

          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <View style={styles.headerWrapper}>
        <Text style={styles.header}>
          {" "}
          <Icon name="cart" size={30} color={styles.title.color} /> POS Purchase
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <InputBox
          inputLabel="Amount"
          placeholder="Enter Amount"
          inputValue={amount}
          keyboardType="numeric"
          onChangeText={(amount) => setAmount(amount)}
        />
      </View>

      <View style={styles.inputWrapper}>
        <GreenButton
          text="Submit"
          disabled={processing}
          processing={processing}
          onPress={submitForm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: "7%",
  },

  title: {
    fontSize: 14,
    color: "#17375e",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingTop: 20,
    paddingBottom: 10,
    flexWrap: "wrap",
  },

  inputWrapper: {
    flexDirection: "column",

    marginTop: 30,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  headerWrapper: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  headerStyle: {
    paddingTop: "7%",
  },
});

export default StartScreen;
