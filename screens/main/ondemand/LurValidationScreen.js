import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import TransactionPin from "../../../components/TransactionPin";
import Summary from "../../../components/Summary";
import PrintComponents from "../../../components/PrintComponents";
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import Result from "../../../components/Result";
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
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  titleWrapper: {
    marginTop: 10,
    marginBottom: 20,
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
      processing: false,
      pin: "",
      insuredName: "",
      insuranceType: "",
      engineNumber: "",
      insuranceType: null,
      vehicleMake: "",
      email: "",
      vehicleColor: "",
      phone: "",
      address: "",
      chassisNumber: "",
      plateNumber: null,
      vehicleModel: "",
      yearOfMake: "",
      tokenLength: Config.tokenLength,
      showProcessing: false,
      showModalSelect: false,
      showDate: false,
      showTransactionPin: false,
      showResult: false,
      transactionStatus: "",
      userMessage: "",
      validationList: [],
      summaryList: [],
      showSummary: false,
      showPrint: false,
      amount: "",
      total: "",
      logo:null
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
      let {
        insuredName,
        insuranceType,
        engineNumber,
        vehicleMake,
        email,
        vehicleColor,
        yearOfMake,
        phone,
        address,
        chassisNumber,
        plateNumber,
        vehicleModel,
      } = this.props.route.params;

      console.log(body);

      let url = Config.app_url;

      let body = {
        serviceCode: "LUP",
        insured_name: insuredName,
        amount: insuranceType.amount,
        phone: phone,
        insurance_type: insuranceType.name,
        chassis_number: chassisNumber,
        engine_number: engineNumber,
        plate_number: plateNumber,
        vehicle_make: vehicleMake,
        vehicle_model: vehicleModel,
        vehicle_color: vehicleColor,
        year_of_make: yearOfMake,
        email: email,
        contact_address: address,
        transactionPin: this.state.pin,
      };

      this.setState({ showTransactionPin: false, showProcessing: true });

      let { error, errorMessage, response } = await new Network()

        .post(url, body)

        .then((response) => response);

      if (error) {
        return Alert.alert("LUR Insurance", errorMessage, [
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
      return Alert.alert("LUR Insurance", error.toString(), [
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

  componentDidMount() {
    let {
      insuredName,
      insuranceType,
      engineNumber,
      vehicleMake,
      email,
      vehicleColor,
      yearOfMake,
      phone,
      address,
      chassisNumber,
      plateNumber,
      vehicleModel,
      logo
    } = this.props.route.params;

    let summaryList = [
      {
        label: "Amount",
        value: Helper.formattedAmountWithNaira(insuranceType.amount),
      },
    ];

    this.setState({
      summaryList,
      insuredName,
      insuranceType: `${insuranceType.name} -${insuranceType.amount}`,
      engineNumber,
      vehicleMake,
      email,
      vehicleColor,
      yearOfMake,
      phone,
      address,
      chassisNumber,
      plateNumber,
      vehicleModel,
      amount: insuranceType.amount,
      total: insuranceType.amount,
      logo
    });
  }
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
      logo
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
          <View style={styles.backWrapper}>
            <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>LUR Insurance Details Summary</Text>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(insuredName) => this.setState({ insuredName })}
              inputValue={this.state.insuredName}
              inputLabel="Insured Name"
              editable={false}
              placeholder="Insured Name"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="number-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Enter Phone Number"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              inputValue={this.state.email}
              inputLabel="Email Address"
              placeholder="Enter Your Email Address"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(address) => this.setState({ address })}
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
              onChangeText={(insuranceType) => this.setState({ insuranceType })}
              inputValue={this.state.insuranceType}
              inputLabel="Insurance Type"
              placeholder="Insurance Type"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(vehicleMake) => this.setState({ vehicleMake })}
              inputValue={this.state.vehicleMake}
              inputLabel="Vehicle Make"
              placeholder="Vehicle Make"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(vehicleModel) => this.setState({ vehicleModel })}
              inputValue={this.state.vehicleModel}
              inputLabel="Vehicle Model"
              placeholder="Vehicle Model"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formRow}>
              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(vehicleColor) =>
                    this.setState({ vehicleColor })
                  }
                  inputValue={this.state.vehicleColor}
                  inputLabel="Vehicle Colour"
                  inputWidth={screenWidth * 0.38}
                  editable={false}
                  placeholder="Vehicle Colour"
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(yearOfMake) => this.setState({ yearOfMake })}
                  inputValue={this.state.yearOfMake}
                  inputLabel="Vehicle Year of Make"
                  placeholder="Vehicle Year of Make"
                  editable={false}
                  inputWidth={screenWidth * 0.38}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(plateNumber) => this.setState({ plateNumber })}
              inputValue={this.state.plateNumber}
              inputLabel="Plate Number"
              placeholder="plate Number"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(chassisNumber) => this.setState({ chassisNumber })}
              inputValue={this.state.chassisNumber}
              inputLabel="Chassis Number"
              placeholder="Chassis Number"
              editable={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(engineNumber) => this.setState({ engineNumber })}
              inputValue={this.state.engineNumber}
              inputLabel="Engine Number"
              placeholder="Engine Number"
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
                image={logo}
              />
            </View>
          ) : (
            <View style={styles.submitButtonWrapper}>
              <GreenButton
                text="Continue"
                disabled={this.state.processing}
                processing={this.state.processing}
                onPress={() => this.setState({ showSummary: true })}
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
