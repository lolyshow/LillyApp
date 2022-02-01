import React, { Component } from "react";
import { Alert, Text, View, Animated } from "react-native";
import TransactionValidation from "../../../components/TransactionValidation";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Result from "../../../components/Result";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

export default class ShowMaxValidation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationList: [],
      summaryList: [],
      amount: "",
      total: "",
      pin: "",
      processing: false,
      showSummary: false,
      showResult: false,
      showTransactionPin: false,
      transactionStatus: "",
      userMessage: "",
      showProcessing: false,
      tokenLength: Config.tokenLength,
      showPrint: false,
      logo: null,
    };
  }

  componentDidMount() {
    let {
      amount,
      total,
      summaryList,
      validationList,
      logo,
    } = this.props.route.params;

    this.setState({ validationList, summaryList, amount, total, logo });
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
      let { body } = this.props.route.params;

      let url = Config.app_url;

      body.transactionPin = this.state.pin;

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()

        .post(url, body)

        .then((response) => response);

      if (error) {
        return Alert.alert("ShowMax", errorMessage, [
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
            label: "Voucher Code",
            value: Helper.getPropValue(response, "voucherCode"),
          });

          validationList.push({
            label: "Capture URL",
            value: Helper.getPropValue(response, "captureUrl"),
          });

          validationList.push({
            label: "Valid Until",
            value: Helper.getPropValue(response, "validUntil"),
          });
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
      return Alert.alert("ShowMax", error.toString(), [
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
      showProcessing,
      tokenLength,
      logo,
    } = this.state;

    return (
      <>
        <TransactionValidation
          showPrint={this.state.showPrint}
          title="ShowMax"
          backPress={() => this.props.navigation.goBack()}
          buttonPress={() => this.setState({ showSummary: true })}
          buttonDisabled={processing}
          list={validationList}
          loading={showProcessing}
          receiptLogo={logo}
        />
        <Summary
          closModal={() => this.setState({ showSummary: false })}
          visible={showSummary}
          continueButtonText="Proceed"
          onPressContinue={() => this.showPinModal()}
          details={summaryList}
          total={Helper.formattedAmountWithNaira(total)}
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
