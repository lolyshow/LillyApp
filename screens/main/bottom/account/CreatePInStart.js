import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import ShieldLogo from "../../../../assets/shield.png";
import Header from "../../../../components/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    paddingHorizontal: 40,

    justifyContent:'space-around',
   
  },

  titleWrapper: {
    flexDirection: "row",

    // justifyContent: "space-between",

    marginBottom: 40,
  },

  title: {
    fontSize: 24,

    fontWeight: "500",

    fontStyle: "normal",

    // lineHeight: 32,

    letterSpacing: 0,

    textAlign: "left",

    color: "#17375e",

    marginLeft: 40,
  },

  inputWrapper: {
    flexDirection: "column",

    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  formRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },
});

export default class CreatePInStart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
       <Header
            text="Transaction PIN"
            backAction={() => this.props.navigation.goBack()}
          />
        

        <View style={{alignSelf:'center', alignItems:'center'}}>
          <Image source={ShieldLogo} />
          <Text  style={styles.greyText}>
            You do not have a Transaction PIN. Try activating your Transaction
            PIN to secure your transactions.
          </Text>
        </View>

        <View style={styles.submitButtonWrapper}>
          <GreenButton
            text="Setup Transaction PIN"
            bordered
            // disabled={}
            // processing={}
            onPress={() => this.props.navigation.navigate("Account.ActivatePin")}
          />
        </View>
      </View>
    );
  }
}
