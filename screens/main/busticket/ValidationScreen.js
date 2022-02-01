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
      routes: "",
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
    };
  }

  componentDidMount() {
    if (this.props.route.params) {
      this.formatDocument(
        this.props.route.params.body,
        this.props.route.params.details
      );
    }
  }

  formatDocument(params, details) {
    var validationList = [];

    let summaryList = [
      {
        label: "Leaving Amount Per Seat",
        value: Helper.formattedAmountWithNaira(details.leavingAmountEach),
      },
      {
        label: "Leaving Seat(s)",
        value: details.passengers,
      },
    ];

    for (let index = 0; index < params.leavingSeats.length; index++) {
      validationList.push({
        label: "Passenger " + (index + 1) + " name",
        value: params.name[index],
      });
      validationList.push({ label: "Gender", value: params.gender[index] });
    }

    validationList.push({ label: "Email Address", value: params.email });
    validationList.push({
      label: "No. Passengers",
      value: params.leavingSeats.length,
    });
    validationList.push({ label: "Departure Date", value: params.leavingDate });
    validationList.push({ label: "Departure Time", value: params.leavingTime });

    validationList.push({
      label: "Leaving Amount Per Seat",
      value: Helper.formattedAmountWithNaira(details.leavingAmountEach),
    });

    if (params.returningDate) {
      validationList.push({
        label: "Return Date",
        value: params.returningDate,
      });
      validationList.push({
        label: "Return Time",
        value: params.returningTime,
      });

      validationList.push({
        label: "Return Amount Per Seat",
        value: Helper.formattedAmountWithNaira(
          details.returningAmountAmountEach
        ),
      });

      summaryList.push({
        label: "Return Amount Per Seat",
        value: Helper.formattedAmountWithNaira(
          details.returningAmountAmountEach
        ),
      });
      summaryList.push({
        label: "Return Seat(s)",
        value: details.passengers,
      });
    }
    validationList.push({ label: "Next Of Kin", value: params["next-of-kin"] });
    validationList.push({
      label: "Phone Number",
      value: params["next-of-kin-phone"],
    });
    validationList.push({ label: "Relationship", value: params.relations });

    this.setState({
      body: params,
      validationList,
      summaryList,
      amount: params.amount,
      routes: params.leavingRoute.split("=>"),
    });
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

    if (this.state.transactionStatus == "200") {
      setTimeout(() => {
        this.setState({ showResult: false });
        this.props.navigation.navigate(
          "BusTicket.TicketDownload",
          this.props.route.params
        );
      }, 3000);
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
      let { pin, body } = this.state;

      body = { ...body, transactionPin: pin };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      if (error) {
        return Alert.alert("Transport", errorMessage, [
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
      return Alert.alert("Transport", error.toString(), [
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
          title="Booking Summary"
          backPress={() => this.props.navigation.goBack()}
          buttonPress={() => this.showSummaryModal()}
          buttonDisabled={false}
          list={this.state.validationList}
          routes={this.state.routes}
          loading={this.state.showProcessing}
        />

        <Summary
          closModal={() => this.setState({ showSummary: false })}
          visible={this.state.showSummary}
          onPressContinue={() => this.showPinModal()}
          details={this.state.summaryList}
          total={Helper.formattedAmountWithNaira(this.state.body.amount)}
        />
        <TransactionPin
          tokenLength={this.state.tokenLength}
          closModal={() =>
            this.setState({ showTransactionPin: false, pin: "" })
          }
          value={this.state.pin}
          setValue={(pin) => this.setState({ pin })}
          onPressContinue={() => this.confirmToken()}
          visible={this.state.showTransactionPin}
        />
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
