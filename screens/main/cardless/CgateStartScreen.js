import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Result from "../../../components/Result";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginTop: 30,
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  withdrawal: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  howMuchToFund: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      validationList: [],
      amount: "",
      total: "",
      fee: 50,
      pin: "",
      processing: false,
      showSummary: false,
      showResult: false,
      showTransactionPin: false,
      transactionStatus: "200",
      userMessage: "Your Reference Code",
      referenceCode: "",
      showProcessing: false,
      tokenLength: Config.tokenLength,
    };
  }

  showPinModal = () => {
    let checkIfPinEnabled = Helper.checkPinActive();

    if (checkIfPinEnabled) {
      this.setState({ showSummary: false, showTransactionPin: true });
    } else {
      this.setState({ showSummary: false });
      this.processTransaction();
    }
  };

  confirmToken = () => {
    let inputted_pin = this.state.pin;

    if (inputted_pin.length == this.state.tokenLength) {
      return this.processTransaction();
    }
  };

  processTransaction = async () => {
    try {
      let { amount, fee, total } = this.state;

      if (amount) {
        let body = {
          serviceCode: "CGL",
          amount: amount,
          transactionPin: this.state.pin,
        };

        let url = Config.app_url;

        this.setState({ showTransactionPin: false, showProcessing: true });

        let { response, error, errorMessage } = await new Network().post(
          url,
          body
        );

        if (error) {
          return Alert.alert("Cardless", errorMessage, [
            {
              text: "OK",
              onPress: () =>
                this.setState({
                  showProcessing: false,
                  pin: "",
                }),
            },
          ]);
        }

        let { status, message } = response;

        if (status == "200") {
          this.setState({ showProcessing: false, pin: "" });

          this.props.navigation.navigate("CgateGeneratedReference", {
            fee,
            total,
            amount,
            referenceCode: response.reference,
            info: response.info,
            details: response.details,
            validationResponse: response,
          });
        } else {
          return Alert.alert("Cardless", message.toString(), [
            {
              text: "OK",
              onPress: () =>
                this.setState({
                  showProcessing: false,
                  pin: "",
                }),
            },
          ]);
        }
      } else {
        return Alert.alert("Cardless", "Fill in the blank fields", [
          {
            text: "OK",
            onPress: () =>
              this.setState({
                showProcessing: false,
                pin: "",
              }),
          },
        ]);
      }
    } catch (error) {
      return Alert.alert("Cardless", error.toString(), [
        {
          text: "OK",
          onPress: () =>
            this.setState({
              showProcessing: false,
              pin: "",
            }),
        },
      ]);
    }
  };

  setAmount = (amount) => {
    let total = amount - this.state.fee;

    let validationList = [
      { label: "Amount", value:  Helper.formattedAmountWithNaira(amount)},
      { label: "Convenience Fee", value: Helper.formattedAmountWithNaira(this.state.fee) },
    ];

    this.setState({ amount, total, validationList });
  };

  showSummaryModal = () => {
    let { amount } = this.state;

    if (amount) {
      this.setState({ showSummary: true });
    } else {
      Alert.alert("Cardless", "Please enter amount");
    }
  };
  render() {
    const {
      processing,
      showSummary,
      showTransactionPin,
      pin,
      validationList,
      total,
      showProcessing,
      tokenLength,
    } = this.state;

    return (
      <View style={styles.container}>
        {showProcessing ? (
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
            <ActivityIndicator size={50} color="#fff" />
          </View>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="CGate Cardless Withdrawal"
            backAction={() => this.props.navigation.goBack()}
          />

          <View>
            <Text style={styles.withdrawal}>Withdrawal</Text>
          </View>

          <View>
            <Text style={styles.howMuchToFund}>
              How much do you want to withdraw?
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={this.setAmount}
              inputValue={this.state.amount}
              inputLabel="Amount"
              placeholder="Amount"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Withdraw"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.showSummaryModal()}
            />
          </View>

          <Summary
            closModal={() => this.setState({ showSummary: false })}
            visible={showSummary}
            continueButtonText="Get Reference Code"
            onPressContinue={() => this.showPinModal()}
            details={validationList}
            // total={total}
          />
          <TransactionPin
            tokenLength={tokenLength}
            closModal={() =>
              this.setState({ showTransactionPin: false, pin: "" })
            }
            value={pin}
            setValue={(pin) => this.setState({ pin })}
            onPressContinue={() => this.confirmToken()}
            visible={showTransactionPin}
          />
        </ScrollView>
      </View>
    );
  }
}
