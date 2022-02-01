import React, { Component } from "react";
import { Alert, Text, View, Animated } from "react-native";
import TransactionValidation from "../../../components/TransactionValidation";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Result from "../../../components/Result";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

const currency = "\u20A6";

export default class ValidationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationList: [],
      summaryList: [],
      amount: "",
      total: "",
      body: {},
      pin: "",
      tokenLength: Config.tokenLength,
      showTransactionPin: false,
      showResult: false,
      showSummary: false,
      showProcessing: false,
      userMessage: "",
      transactionStatus: "",
      showPrint: false,
      logo: null
    };
  }

  randomString = (length, chars) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  componentDidMount() {
    if (this.props.route.params) {
      var body = this.props.route.params.body;
      var logo = this.props.route.params.logo;
      var keys = Object.keys(body);
      var excludeList = ["serviceCode", "code", "productsCode", "package", "product"];
      var summaryList = [
        {
          label: "Vend Amount",
          value: Helper.formattedAmountWithNaira(body.amount),
        },
      ];
      var validationList = [];
      for (const key of keys) {
        if (!excludeList.includes(key)) {
          key != "amount" && key !="total"
            ? validationList.push({
                label: Helper.textRefine(key),
                value: body[key],
              })
            : validationList.push({
                label: Helper.textRefine(key),
                value: Helper.formattedAmountWithNaira(body[key]),
              });
        }
      }

      this.setState({
        validationList,
        summaryList,
        amount: body.amount,
        total: Helper.getPropValue(body,'total') ?? body.amount,
        body,
        logo
      });
    }
  }

  showSummaryModal = () => {
    this.setState({ showSummary: true });
  };

  showPinModal = () => {
    let checkIfPinEnabled = Helper.checkPinActive();

    if (checkIfPinEnabled) {
      this.setState({ showSummary: false, showTransactionPin: true });
    } else {
      this.setState({ showSummary: false });
      this.processTransaction();
    }
  };

  showResult = (visible) => {
    this.setState({ showResult: visible });
  };

  confirmToken = () => {
    let inputted_pin = this.state.pin;

    if (inputted_pin.length == this.state.tokenLength) {
      return this.processTransaction();
    }
  };

  processTransaction = async () => {
    try {
      let { pin, body } = this.state;

      body = { ...body, transactionPin: pin };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let url = Config.app_url;
      console.log("beforeCall");
      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      if (error) {
        return Alert.alert("Airtime & Data", errorMessage, [
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
      console.log('messagemeHere',message);
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
      return Alert.alert("Airtime & Data", error.toString(), [
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

  render() {
    return (
      <>
        <TransactionValidation
          showPrint={this.state.showPrint}
          title="Confirm Airtime & Data Payment"
          backPress={() => this.props.navigation.goBack()}
          buttonPress={() => this.showSummaryModal()}
          buttonDisabled={false}
          list={this.state.validationList}
          loading={this.state.showProcessing}
          receiptLogo={this.state.logo}
        />

        <Summary
          closModal={() => this.setState({ showSummary: false })}
          visible={this.state.showSummary}
          onPressContinue={() => this.showPinModal()}
          details={this.state.summaryList}
          total={Helper.formattedAmountWithNaira(this.state.total)}
        />
        {/* <TransactionPin
          tokenLength={this.state.tokenLength}
          closModal={() =>
            this.setState({ showTransactionPin: false, pin: "" })
          }
          value={this.state.pin}
          setValue={(pin) => this.setState({ pin })}
          onPressContinue={() => this.confirmToken()}
          visible={this.state.showTransactionPin}
        /> */}
        <Result
          visible={this.state.showResult}
          closModal={() => this.setState({ showResult: false })}
          status={this.state.transactionStatus}
          userMessage={this.state.userMessage}
        />
      </>
    );
  }
}
