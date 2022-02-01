import React, { Component } from "react";
import { Alert, Text, View, Animated } from "react-native";
import TransactionValidation from "../../../components/TransactionValidation";
import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";
import Result from "../../../components/Result";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

export default class ValidateScreens extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validationList: [],
      summaryList: [],
      amount: "",
      total: "",
      pin: "",
      addonSelected: false,
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
      smartCard,
      type,
      plan,
      addon,
      name,
      validationResponse,
      logo,
      boxOffice,
    } = this.props.route.params;

    this.setState({ logo });

    let validationList = [
      { label: "Tv Type", value: type },
      { label: "Customer Name", value: name },
      { label: "Smart Card Number", value: smartCard },
    //   { label: "Tv plan", value: plan.name },
    //   { label: "Amount", value: Helper.formattedAmountWithNaira(plan.price) },
    ];

    let summaryList = [
      {
        label: "Plan Amount",
        value: Helper.formattedAmountWithNaira(plan.price),
      },
    ];

    switch (type) {
      case "GOTV":
      case "DSTV":
        validationList.push({ label: "Month", value: plan.month });

        Helper.getPropValue(validationResponse, "accountStatus") &&
          validationList.push({
            label: "Account Status",
            value: Helper.getPropValue(validationResponse, "accountStatus"),
          });
        Helper.getPropValue(validationResponse, "dueDate") &&
          validationList.push({
            label: "Due Date",
            value: Helper.getPropValue(validationResponse, "dueDate"),
          });

        if (addon && type == "DSTV") {
          validationList.push({ label: "Add-on Plan", value: addon.name });
          validationList.push({
            label: "Add-on Amount",
            value: Helper.formattedAmountWithNaira(addon.price),
          });
          summaryList.push({
            label: "Addon Amount",
            value: Helper.formattedAmountWithNaira(addon.price),
          });

          validationList.push({
            label: "Total Amount",
            value: Helper.formattedAmountWithNaira(addon.price + plan.price),
          });

          this.setState({
            addonSelected: true,
            validationList,
            summaryList,
            amount: plan.price,
            total: plan.price + addon.price,
          });
        } else {
          this.setState({
            validationList,
            summaryList,
            amount: plan.price,
            total: plan.price,
          });
        }

        break;

      case "STARTIMES":
        validationList.push({ label: "Duration", value: plan.month });
        Helper.getPropValue(validationResponse, "balance") &&
          validationList.push({
            label: "Prev Balance",
            value: Helper.formattedAmountWithNaira(
              Helper.getPropValue(validationResponse, "balance")
            ),
          });
        this.setState({
          validationList,
          summaryList,
          amount: plan.price,
          total: plan.price,
        });
        break;

      default:
        this.setState({
          validationList,
          summaryList,
          amount: plan.price,
          total: plan.price,
        });

        break;
    }
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
      let url = Config.app_url;

      let body = this.getBody();

      body = { ...body, transactionPin: this.state.pin };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()

        .post(url, body)

        .then((response) => response);

      if (error) {
        return Alert.alert("TV", errorMessage, [
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
      return Alert.alert("TV", error.toString(), [
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

  getBody = () => {
    let {
      smartCard,
      type,
      plan,
      addon,
      name,
      validationResponse,
      boxOffice,
    } = this.props.route.params;

    let body;

    switch (type) {
      case "DSTV":
        if (this.state.addonSelected) {
          body = {
            amount: this.state.amount,
            smartCardNo: smartCard,
            serviceCode: "GDB",
            type: type,
            customerName: name,
            productsCode: plan.code,
            period: plan.period,
            month: plan.month,
            packagename: plan.name,
            addon: `${addon.code}|${addon.price}|${addon.name}`,
          };
        } else {
          body = {
            amount: this.state.amount,
            smartCardNo: smartCard,
            serviceCode: "GDB",
            type: type,
            customerName: name,
            productsCode: plan.code,
            period: plan.period,
            month: plan.month,
            packagename: plan.name,
            addon: null,
            boxOffice,
          };
        }

        break;

      case "GOTV":
        body = {
          amount: this.state.amount,
          smartCardNo: smartCard,
          serviceCode: "GDB",
          type: type,
          customerName: name,
          productsCode: plan.code,
          period: plan.period,
          month: plan.month,
          packagename: plan.name,
          addon: null,
        };

        break;

      case "STARTIMES":
        body = {
          amount: this.state.amount,
          smartCardNo: smartCard,
          serviceCode: "GDB",
          type: type,
          customerName: name,
          productsCode: plan.code,
          month: plan.month,
          packagename: plan.name,
          addon: null,
        };

        break;

      default:
        body = {};

        break;
    }

    return body;
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
      logo,
    } = this.state;

    return (
      <>
        <TransactionValidation
          showPrint={this.state.showPrint}
          title="Tv Confirmation"
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
          onPressContinue={() => this.showPinModal()}
          details={summaryList}
          total={Helper.formattedAmountWithNaira(total)}
        />
        <TransactionPin
          tokenLength={this.state.tokenLength}
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
