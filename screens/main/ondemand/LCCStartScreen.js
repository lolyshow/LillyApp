import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ModalSelectBox from "../../../components/ModalSelectBox";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import axios from "axios";
import Network from "../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,

      customerId: null,
      amount: null,
      type: "LCC",
      showModalSelect: false,
    };
  }

  continue = async () => {
    try {
      let { amount, customerId, type } = this.state;

      if (customerId && amount) {
        let body = {
          customerId: customerId,
          serviceCode: "LEV",
          type: type,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("LCC", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          this.setState({ processing: false });

          let item = this.props.route.params;

          this.props.navigation.navigate("LCC.Validation", {
            amount: amount,
            customerId: customerId,
            type: type,
            name: response.name,
            wallet: response.wallet,
            validationResponse: response,
            logo: type,
          });
        } else {
          return Alert.alert("LCC", message.toString());
        }
      } else {
        this.setState({ processing: false });
        return Alert.alert("LCC", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("LCC", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="LCC Toll Ticketing"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(customerId) => this.setState({ customerId })}
              inputValue={this.state.customerId}
              inputLabel="Customer ID Number"
              placeholder="Enter Customer ID Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(amount) => this.setState({ amount })}
              inputValue={this.state.amount}
              inputLabel="Amount"
              placeholder="Enter Amount"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Continue"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.continue()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
