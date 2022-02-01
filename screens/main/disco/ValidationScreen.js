import React, { Component } from "react";
import { Alert, Text, View, Image } from "react-native";
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
      amount: null,
      total: null,
      pin: "",
      tokenLength: Config.tokenLength,
      processing: false,
      showSummary: false,
      showResult: false,
      showTransactionPin: false,
      transactionStatus: "",
      userMessage: "",
      showProcessing: false,
      showPrint: false,
      logo: null,
    };
  }

  componentDidMount() {
    let {
      meterNo,
      disco,
      meterType,
      name,
      address,
      validationResponse,
      phone,
      amount,
      logo,
    } = this.props.route.params;

    let validationList = [
      { label: "Customer Name", value: name },
      { label: "Phone Number", value: phone },
      { label: "Meter Number", value: meterNo },
      { label: "Address", value: address },
      { label: "Meter Type", value: meterType },
      { label: "DISCO", value: disco },
      { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
    ];

    let summaryList = [
      {
        label: "Amount",
        value: Helper.formattedAmountWithNaira(amount),
      },
    ];

    this.setState({ validationList, summaryList, amount, total: amount, logo });
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
        meterNo,
        disco,
        meterType,
        name,
        address,
        phone,
        amount,
      } = this.props.route.params;

      let url = Config.app_url;

      let body = {
        serviceCode: "AOB",
        disco: disco,
        meterNo: meterNo,
        amount: amount,
        type: meterType,
        phonenumber: phone,
        name: name,
        address: address,
        transactionPin: this.state.pin,
      };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()
        .post(url, body,{username:global.username,password:global.password})
        .then((response) => response);

      if (error) {
        return Alert.alert("Electricity", errorMessage, [
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
          //set token and unit

          validationList.push({
            label: "Token",
            value: Helper.getPropValue(response, "token"),
          });
          validationList.push({
            label: "Units",
            value: Helper.getPropValue(response, "unit"),
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
      this.setState({
        showTransactionPin: false,
        pin: "",
        showProcessing: false,
      });

      return Alert.alert("Electricity", error.toString(), [
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
    let {
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
      logo,
      showProcessing,
    } = this.state;

    return (
      <>
        <TransactionValidation
          showPrint={this.state.showPrint}
          title="Confirm payment"
          header="Disco Payment Information"
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
          continueButtonText="Make Payment"
          onPressContinue={() => this.showPinModal()}
          details={summaryList}
          total={Helper.formattedAmountWithNaira(total)}
        />
        {/* <TransactionPin
          tokenLength={this.state.tokenLength}
          closModal={() =>
            this.setState({ showTransactionPin: false, pin: "" })
          }
          value={pin}
          setValue={(pin) => this.setState({ pin })}
          onPressContinue={() => this.confirmToken()}
          visible={showTransactionPin}
        /> */}
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
