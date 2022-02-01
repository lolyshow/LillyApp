import React, { Component } from "react";
import { Alert, Text, View, Animated } from "react-native";
import TransactionValidation from "../../../components/TransactionValidation";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Result from "../../../components/Result";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

export default class ValidationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationList: [],
      summaryList: [],
      amount: "",
      total: "",
      pin: "",
      phone: "",
      fee: 50,
      processing: false,
      showSummary: false,
      showResult: false,
      showTransactionPin: false,
      tokenLength: Config.length,
      showProcessing: false,
      transactionStatus: "",
      userMessage: "",
      showPrint: false,
    };
  }

  componentDidMount() {
    let { fac, amount, phone, charge } = this.props.route.params;

    let validationList = [
      { label: "FAC", value: fac },
      { label: "Phone Number", value: phone },
      { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
      {
        label: "Convenience Fee",
        value: Helper.formattedAmountWithNaira(charge),
      },
    ];

    let summaryList = [
      { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
      {
        label: "Convenience Fee",
        value: Helper.formattedAmountWithNaira(charge),
      },

      {
        label: "Total Amount To Be Funded",
        value: Helper.formattedAmountWithNaira(
          parseFloat(amount) - parseFloat(charge)
        ),
      },
    ];

    this.setState({
      validationList,
      summaryList,
      fee: charge,
      amount,
      fac: fac,
      phone: phone,
    });
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

    if (inputted_pin.length == Config.tokenLength) {
      return this.processTransaction();
    }
  };

  processTransaction = async () => {
    try {
      let { fac, amount, phone, type } = this.props.route.params;

      let url = Config.app_url;

      let body = {
        serviceCode: "CDP",
        fac: fac,
        amount: amount,
        phone: phone,
        type: type,
        transactionPin: this.state.pin,
      };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()
        .post(url, body)
        .then((response) => response);

      if (error) {
        return Alert.alert("Cardless", errorMessage, [
          {
            text: "OK",
            onPress: () =>
              this.setState({
                showTransactionPin: false,
                pin: "",
                showProcessing: false,
              }),
          },
        ]);
      }

      let { status, message } = response;
      let validationList = this.state.validationList;

      switch (status) {
        case "200":
          validationList.push({
            label: "Transaction ID",
            value: Helper.getPropValue(response, "transId"),
          });

          validationList.push({
            label: "Transaction Status",
            value: "Successful",
          });

          this.setState({
            validationList,
            showPrint: true,
            userMessage: message,
            transactionStatus: status,
            showTransactionPin: false,
            pin: "",
            showProcessing: false,
          });

          break;

        case "400":
          validationList.push({
            label: "Transaction Status",
            value: "Pending/Processing",
          });

          this.setState({
            validationList,
            showPrint: true,
            userMessage: message,
            transactionStatus: status,
            showTransactionPin: false,
            pin: "",
            showProcessing: false,
          });

          break;

        default:
          this.setState({
            userMessage: message,
            transactionStatus: "300",
            showTransactionPin: false,
            pin: "",
            showProcessing: false,
          });

          break;
      }

      this.showResult();
    } catch (error) {
      return Alert.alert("Cardless", error.toString(), [
        {
          text: "OK",
          onPress: () =>
            this.setState({
              showTransactionPin: false,
              pin: "",
              showProcessing: false,
            }),
        },
      ]);
    }
  };

  showResult = () => {
    this.setState({ showResult: true });
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
      summaryList,
      total,
      tokenLength,
      showProcessing,
    } = this.state;

    return (
      <>
        <TransactionValidation
          showPrint={this.state.showPrint}
          title="Confirm GT Rescue Cardless Withdrawal"
          backPress={() => this.props.navigation.goBack()}
          buttonPress={() => this.setState({ showSummary: true })}
          buttonDisabled={processing}
          list={validationList}
          continueButtonText="Proceed"
          loading={this.state.showProcessing}
        />
        <Summary
          closModal={() => this.setState({ showSummary: false })}
          visible={showSummary}
          continueButtonText="Proceed"
          onPressContinue={() => this.showPinModal()}
          details={summaryList}
          // total ={total}
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
          closModal={() => this.setState({ showResult: false })}
          status={transactionStatus}
          userMessage={userMessage}
          visible={showResult}
          buttonDisabled={processing}
        />
      </>
    );
  }
}
