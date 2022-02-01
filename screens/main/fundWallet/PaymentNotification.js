import axios from "axios";
import React, { Component } from "react";
import { Alert, Text, View, ScrollView, StyleSheet } from "react-native";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import InputBox from "../../../components/InputBox";
import ModalSelectBox from "../../../components/ModalSelectBox";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 20,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },
});

export default class PaymentNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      bank: "",
      processing: false,
      banks: [],
      showModalSelect: false,
    };
  }

  bankList = () => {
    let list = [];

    this.state.banks.forEach((item, index) => {
      list.push({ label: item, value: item, key: item.item });
    });

    return list;
  };

  getBanks = async () => {
    try {
      let url = Config.base_url + "/payment-notification";

      let response = await axios.post(url).then((response) => response.data);

      console.log(response);

      if (response) {
        this.setState({ banks: response });
      } else
        return Alert.alert("Error", "An error occurred while fetching banks");
    } catch (error) {
      return Alert.alert("Error", error.toString());
    }
  };

  handleSubmit = async () => {
    try {
      let { amount, bank } = this.state;

      if (amount && bank) {
        let body = {
          serviceCode: "FRI",
          amount: amount,
          bank: bank,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Error", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          return Alert.alert("Payment Notification", message.toString(), [
            {
              text: "OK",
              onPress: () => this.props.navigation.goBack(),
            },
          ]);
        } else {
          Alert.alert("Payment Notification", message.toString());
        }
      } else {
        this.setState({ processing: false });
        Alert.alert("Payment Notification", "Please enter bank and amount");
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  handleSelectChange = (bank) => {
    this.setState({ bank, showModalSelect: false });
  };

  componentDidMount() {
    this.getBanks();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Payment Notification"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <ModalSelectBox
              inputLabel="Banks"
              selectTitle="Select Bank"
              items={this.bankList()}
              visible={this.state.showModalSelect}
              selected={this.state.bank}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={this.handleSelectChange}
              placeholder="Select Bank"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(amount) => this.setState({ amount })}
              inputValue={this.state.amount}
              inputLabel="Amount"
              placeholder="Amount"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Send Notification"
              disabled={this.state.bank == null}
              processing={this.state.processing}
              onPress={() => this.handleSubmit()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
