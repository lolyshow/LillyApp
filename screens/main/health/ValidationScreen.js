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
  Dimensions,
  Alert,
} from "react-native";

import TransactionPin from "../../../components/TransactionPin";

import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import PrintComponents from "../../../components/PrintComponents";
import Result from "../../../components/Result";
import ModalSelect from "./ModalSelect";
import Summary from "../../../components/Summary";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import Helper from "../../../Helpers/Helper";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  backWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  titleWrapper: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowField: {
    // alignSelf:'stretch'
  },
});

export default class Validation extends Component {
  constructor() {
    super();

    this.state = {
      firstname: "",

      lastname: "",

      state: "",

      lga: "",

      address: "",

      area: "",

      email: "",

      phone: "",

      gender: "",

      plan: null,

      date: "",
      processing: false,

      pin: "",
      showProcessing: false,
      tokenLength: Config.tokenLength,
      showModalSelect: false,

      showDate: false,
      showTransactionPin: false,
      showResult: false,
      transactionStatus: "",
      userMessage: "",
      validationList: [],
      showSummary:false,
      summaryList: [],
      amount: "",
      total: "",
      showPrint: false,
    };
  }

  componentDidMount() {
    let {
      firstname,
      lastname,
      email,
      phone,
      gender,
      state,
      lga,
      address,
      area,
      plan,
      date,
    } = this.props.route.params;

    let summaryList = [
      { label: "Amount", value: Helper.formattedAmountWithNaira(plan.price) },
    ];

    this.setState({
      summaryList,
      firstname,
      lastname,
      email,
      phone,
      gender,
      state,
      lga,
      address,
      area,
      plan,
      date: date.toLocaleDateString(),
      amount: plan.price,
      total: plan.price,
    });
    // console.log(this.props.route.params)
  }

  planList = () => {
    let list = [];

    item = this.props.route.params.plan;

    list = [
      {
        month: item.planType,
        condition: item.condition,
        amount: item.price,
        value: item,
        key: 1,
      },
    ];

    return list;
  };

  showPinModal = () => {
    let checkIfPinEnabled = Helper.checkPinActive();

    if (checkIfPinEnabled) {
      this.setState({ showSummary:false, showTransactionPin: true });
    } else {
      this.setState({ showSummary:false});
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
        firstname,
        lastname,
        email,
        phone,
        gender,
        state,
        lga,
        address,
        area,
        plan,
        date,
      } = this.props.route.params;

      console.log(body);

      let url = Config.app_url;
      let planSelected = `${plan.planType}|${plan.price}|${plan.numberOfPersons}|${plan.numberOfMonths}`;

      let body = {
        serviceCode: "WLS",
        firstName: firstname,
        lastName: lastname,
        email: email,
        phone: phone,
        gender: gender,
        state: state,
        lga: lga,
        street: address,
        area: area,
        plan: planSelected,
        dateOfBirth: date,
        beneficiaries: [],
        transactionPin: this.state.pin,
      };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()

        .post(url, body)

        .then((response) => response);

      if (error) {
        return Alert.alert("Health", errorMessage, [
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

          let excludeList = ["message", "status", "transId"];

          Object.entries(response).forEach((item) => {
            !excludeList.includes(item[0]) &&
              validationList.push({
                label: Helper.textRefine(item[0]),
                value: item[1],
              });
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
      return Alert.alert("Health", error.toString(), [
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
      showTransactionPin,
      showResult,
      transactionStatus,
      userMessage,
      pin,
      tokenLength,
      showProcessing,
      showPrint,
      validationList,
      showSummary,
      summaryList,
      total,
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
        <ScrollView>
          <View style={styles.backWrapper}>
            <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>My Details</Text>
          </View>

          <View style={styles.inputWrapper}>
            <ModalSelect
              inputLabel=""
              selectTitle="Choose Health package"
              items={this.planList()}
              visible={false}
              selected={this.state.plan}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={(plan) =>
                this.setState({ plan, showModalSelect: false })
              }
              // placeholder="Health Plan"
              disabled={true}
            />
          </View>
          <View style={styles.inputWrapper}>
            <View style={styles.formRow}>
              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  inputValue={this.state.firstname}
                  inputLabel="First Name"
                  inputWidth={screenWidth * 0.38}
                  editable={false}
                  placeholder="Enter First Name"
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  inputValue={this.state.lastname}
                  inputLabel="Last Name"
                  placeholder="Enter Last Name"
                  editable={false}
                  inputWidth={screenWidth * 0.38}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="email-address"
              inputValue={this.state.email}
              inputLabel="Email Address"
              placeholder="Enter Your Email Address"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="number-pad"
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Enter Phone Number"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formRow}>
              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  inputValue={this.state.date}
                  inputLabel="Date of Birth"
                  inputWidth={screenWidth * 0.38}
                  editable={false}
                  placeholder="Date of Birth"
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  inputValue={this.state.gender}
                  inputLabel="Gender"
                  placeholder="Gender"
                  editable={false}
                  inputWidth={screenWidth * 0.38}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              inputValue={this.state.address}
              inputLabel="Address of Residence"
              placeholder="Enter Address"
              multiline={true}
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              inputValue={this.state.state}
              inputLabel="State of Residence"
              placeholder="Select State"
              multiline={true}
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              inputValue={this.state.lga}
              inputLabel="L.G.A of Residence"
              placeholder="Select L.G.A"
              multiline={true}
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              inputValue={this.state.area}
              inputLabel="Area"
              placeholder="Enter Area"
              multiline={true}
              editable={false}
            />
          </View>

          {showPrint ? (
            <View style={styles.submitButtonWrapper}>
              <PrintComponents
                showHomeReturn={true}
                showPrintReceipt={true}
                showDownloadPdf={true}
                showExternalPrintReceipt={true}
                printObjectsArray={validationList}
              />
            </View>
          ) : (
            <View style={styles.submitButtonWrapper}>
              <GreenButton
                text="Continue"
                disabled={this.state.processing}
                processing={this.state.processing}
                onPress={() =>  this.setState({ showSummary: true })}
              />
            </View>
          )}

          <Summary
            closModal={() => this.setState({ showSummary: false })}
            visible={showSummary}
            continueButtonText="Make Payment"
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
          />
        </ScrollView>
      </View>
    );
  }
}
