import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CardComponent from "../../../components/CardComponent";
import Result from "../../../components/Result";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Header from "../../../components/Header";
import RNPaystack from "react-native-paystack";
import axios from "axios";
import ProcessingComponent from "../../../components/ProcessingComponent";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Storage from "../../../Helpers/Storage";
import Helper from "../../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 40,
  },

  titleWrapper: {
    flexDirection: "row",
    marginBottom: 40,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: 40,
  },
});

export default class CardInitiate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      cardType: "",
      amount: "",
      cvc: "",
      expiryDate: "",
      cardNo: "",
      provider: "",
      logo: "",
      info: "",
      newCard: true,
      pin: "",
      showSummary: false,
      showResult: false,
      saveCard: false,
      showTransactionPin: false,
      transactionStatus: "",
      userMessage: "",
      total: "",
      tokenLength: Config.tokenLength,
      showProcessing: false,
      reference: "",
      accessCode: "",
      secretKey: "sk_live_8fe34f8edade77c497c65b5eb08a939ab0d6cc56",
      publicKey: "pk_live_d2a55f21537d6cd246501153d123e3904ec8ce2b",
    };
  }

  setProcessing(status) {
    this.setState({ showProcessing: status });
  }

  chargeCard = async () => {
    try {
      const {
        expiryDate,
        cardNo,
        cvc,
        amount,
        reference,
        accessCode,
        publicKey,
      } = this.state;

      RNPaystack.init({ publicKey: publicKey });

      const { user } = global;

      let dateParts = expiryDate.split("/");

      if (dateParts.length < 2) {
        this.setState({ processing: false });

        return;
      }

      let response = await RNPaystack.chargeCard({
        cardNumber: cardNo,
        expiryMonth: dateParts[0],
        expiryYear: dateParts[1],
        cvc: cvc,
        email: user.email,
        amountInKobo: parseInt(amount) * 100,
        // cardNumber: cardNo,
        // expiryMonth: dateParts[0],
        // expiryYear: dateParts[1],
        // cvc: cvc,
        // accessCode: accessCode,
      }).then((response) => response);

      console.log(response); // do stuff with the token

      if (!response.reference) {
        this.setState({ processing: false });

        Alert.alert("Fund Wallet", "Transaction failed");
      } else {
        this.fundWalletTransfer(response.reference);
      }
    } catch (error) {
      console.log(error);

      this.setState({ processing: false });

      Alert.alert("Error", error.message);
    }
  };

  verifyCharge = async (reference) => {
    try {
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.secretKey}`,
      };

      let response = await axios
        .get("https://api.paystack.co/transaction/verify/" + reference, {
          headers,
        })
        .then((response) => response.data);

      console.log(response);

      if (
        response.status &&
        response.data &&
        response.data.authorization &&
        response.data.authorization.authorization_code
      ) {
        this.setState({ cardType: response.data.authorization.brand });

        this.fundWalletTransfer(this.state.reference);
      } else {
        this.setState({ processing: false });

        Alert.alert("Fund Wallet", response.message);
      }
    } catch (error) {
      this.setState({ processing: false });

      Alert.alert("Fund Wallet", "An error occurred");
    }
  };

  fundWalletTransfer = async (ref) => {
    try {
      let formBody = {
        reference: this.state.reference,
        payStackReference: ref,
      };

      let url = Config.base_url + "/fund_wallet/transfer";

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        if (this.state.saveCard) {
          this.savingCardDetails();
        }

        Alert.alert("Card", message);
      } else {
        Alert.alert("Card", message);
      }
    } catch (error) {
      Alert.alert("Error", error.toString());
    }
  };

  submitRequest = () => {
    this.setState({ showSummary: true });
  };

  showResult = () => {
    this.setState({ showResult: true });
  };

  handleExpiryChange = (text) => {
    let textTemp = text;

    if (textTemp[0] !== "1" && textTemp[0] !== "0") {
      textTemp = "";
    }
    if (textTemp.length === 2) {
      if (
        parseInt(textTemp.substring(0, 2)) > 12 ||
        parseInt(textTemp.substring(0, 2)) == 0
      ) {
        textTemp = textTemp[0];
      } else if (this.state.expiryDate.length === 1) {
        textTemp += "/";
      } else {
        textTemp = textTemp[0];
      }
    }

    this.setState({ expiryDate: textTemp });
  };

  componentDidMount() {
    const { params } = this.props.route;

    this.setState({
      amount: Helper.getPropValue(params, "amount") ?? "",
      cvc: Helper.getPropValue(params, "cardInfo.cvc") ?? "",
      expiryDate: Helper.getPropValue(params, "cardInfo.expiry") ?? "",
      cardNo: Helper.getPropValue(params, "cardInfo.cardNo") ?? "",
      provider: Helper.getPropValue(params, "provider.name") ?? "",
      logo: Helper.getPropValue(params, "provider.logo") ?? "",
      info: Helper.getPropValue(params, "provider.info") ?? "",
      newCard: Helper.getPropValue(params, "newCard") ?? true,
    });
  }

  savingCardDetails = async () => {
    let card = {
      cvc: this.state.cvc,
      cardNo: this.state.cardNo,
      expiry: this.state.expiryDate,
      cardType: this.state.cardType.toString().toLowerCase(),
    };

    let { error, errorMessage, data } = await Storage.getObjectData(
      "creditCards"
    );

    if (!error) {
      if (data != null) {
        let cardExist = data.find((item) => item.cardNo == this.state.cardNo);

        if (!cardExist) {
          data.push(card);

          Storage.storeObjectData("creditCards", data);
        }
      } else {
        Storage.storeObjectData("creditCards", [card]);
      }
    } else {
      console.log(errorMessage);
    }
  };

  confirmToken = () => {
    let inputted_pin = this.state.pin;

    if (inputted_pin.length == this.state.tokenLength) {
      this.setState({ showTransactionPin: false });

      return this.sendFundRequest();
    }
  };

  showPinModal = () => {
    let checkIfPinEnabled = Helper.checkPinActive();

    if (checkIfPinEnabled) {
      this.setState({ showSummary: false, pin: "", showTransactionPin: true });
    } else {
      this.setState({ showSummary: false });

      this.sendFundRequest();
    }
  };

  sendFundRequest = async () => {
    this.setState({ showSummary: false, processing: true });

    try {
      let formBody = {
        amount: this.state.amount,
        type: "PAYSTACK",
        id: global.user.id,
        newMethod: true,
      };

      let url = Config.base_url + "/fund_wallet/validate";

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody
      );

      console.log(response);

      if (error) {
        this.setState({ processing: false });

        return Alert.alert("Error", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({
          reference: response.reference,
          // accessCode: response.access_code,
          // showTransactionPin: true,
        });

        return this.chargeCard();
      } else {
        this.setState({ processing: false });
        Alert.alert("Error", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  continue = () => {
    let { cvc, expiryDate, amount, cardNo } = this.state;

    if (cvc && expiryDate && amount && cardNo) {
      this.setState({ showSummary: true });
    } else {
      Alert.alert("Error", "Please fill the empty fields");
    }
  };

  render() {
    const {
      processing,
      showSummary,
      showResult,
      showTransactionPin,
      pin,
      transactionStatus,
      userMessage,
      validationList,
      total,
      showProcessing,
      tokenLength,
      amount,
      saveCard,
      newCard,
    } = this.state;

    return (
      <View style={styles.container}>
        {this.state.processing ? (
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
            text={this.state.newCard ? "New  Card" : "Card"}
            backAction={() => this.props.navigation.goBack()}
          />

          <View>
            {newCard && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Save Card Details </Text>
                <Switch
                  trackColor={{ false: "#f4f3f4", true: "#f4f3f4" }}
                  thumbColor={saveCard ? "#17375e" : "#f4f3f4"}
                  ios_backgroundColor="#17375e"
                  onValueChange={() =>
                    this.setState((state) => ({ saveCard: !state.saveCard }))
                  }
                  value={saveCard}
                />
              </View>
            )}
            <CardComponent
              platformProvider={this.state.provider}
              logo={this.state.logo}
              info={this.state.info}
              cardNo={this.state.cardNo}
              onChangeCardNo={(cardNo) => this.setState({ cardNo })}
              cvc={this.state.cvc}
              onChangeCvc={(cvc) => this.setState({ cvc })}
              expiry={this.state.expiryDate}
              onChangeExpiry={this.handleExpiryChange}
              amount={this.state.amount}
              onChangeAmount={(amount) => this.setState({ amount })}
              buttonDisabled={this.state.processing}
              onPressContinue={() => this.continue()}
              editableFields={this.state.newCard}
            />
          </View>

          <Summary
            header="Fund Request Summary"
            closModal={() => this.setState({ showSummary: false })}
            visible={showSummary}
            continueButtonText="Submit Fund Request"
            onPressContinue={() => this.showPinModal()}
            details={[{ label: "Amount", value: amount }]}
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
          <Result
            closModal={() => this.props.navigation.navigate("Main")}
            status={transactionStatus}
            userMessage={userMessage}
            visible={showResult}
            buttonDisabled={processing}
          />

          <ProcessingComponent
            visible={showProcessing}
            message="Processing"
            closModal={() => this.setState({ showProcessing: false })}
          />
        </ScrollView>
      </View>
    );
  }
}
