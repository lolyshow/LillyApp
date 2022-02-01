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
      processing: false,
      showSummary: false,
      showResult: false,
      showTransactionPin: false,
      transactionStatus: "",
      userMessage: "",
      tokenLength: Config.tokenLength,
      showProcessing: false,
      showPrint: false,
    };
  }

  componentDidMount() {
    let {
      name,
      reference,
      amount,
      type,
      validationResponse,
    } = this.props.route.params;

    let validationList = [
      { label: "Account Name", value: name },
      { label: "Pay Type", value: type },
      { label: "Transaction Reference", value: reference },
      { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
    ];

    let summaryList = [
      {
        label: "Invoice Amount",
        value: Helper.formattedAmountWithNaira(amount),
      },
    ];

    this.setState({ validationList, summaryList, amount, total: amount });
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
      let {
        name,
        reference,
        amount,
        type,
        product,
        validationResponse,
      } = this.props.route.params;

      let url = Config.app_url;

      let body = {
        transNo: reference,
        serviceCode: "ODP",
        type: type,
        customerName: name,
        amount: amount,
        product: product,
        transactionPin: this.state.pin,
      };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()

        .post(url, body)

        .then((response) => response);

      if (error) {
        return Alert.alert("Saana", errorMessage, [
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
      return Alert.alert("Saana", error.toString(), [
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
          title="Confirm Saana Payment"
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
          continueButtonText="Verify"
          onPressContinue={() => this.showPinModal()}
          details={summaryList}
          total={Helper.formattedAmountWithNaira(total)}
        />
        <TransactionPin
          tokenLength={tokenLength}
          closModal={() =>
            this.setState({ showTransactionPin: false, pin: null })
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
