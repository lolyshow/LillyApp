import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";

import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import SelectBox from "../../../components/SelectBox";
import WhiteButton from "../../../components/WhiteButton";
import Header from "../../../components/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowField: {
  
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      phone: "",
      address: "",
      chassisNumber: "",
      plateNumber: null,
      vehicleModel: "",
      showModalSelect: false,
      showDate: false,
      pageIndex: 0,
    };
  }
  continue = async () => {
    try {
      let {
        phone,
        address,
        chassisNumber,
        plateNumber,
        vehicleModel,
      } = this.state;

      if (phone && address && chassisNumber && plateNumber && vehicleModel) {
        let {
          insuredName,
          insuranceType,
          engineNumber,
          vehicleMake,
          email,
          vehicleColor,
          yearOfMake,
          logo,
        } = this.props.route.params;

        this.props.navigation.navigate("LUR.Validation", {
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
          logo,
        });
      } else {
        this.setState({ processing: false });
        return Alert.alert("LUR Insurance", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("LUR Insurance", error.toString());
    }
  };

  componentDidMount() {
    console.log(this.props.route.params);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="LUR Insurance"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone Number"
              placeholder="Enter Phone Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(address) => this.setState({ address })}
              inputValue={this.state.address}
              inputLabel="Contact Address"
              placeholder="Enter Contact Address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(chassisNumber) => this.setState({ chassisNumber })}
              inputValue={this.state.chassisNumber}
              inputLabel="Vehicle Chassis Number"
              placeholder="Enter Vehicle Chassis Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(plateNumber) => this.setState({ plateNumber })}
              inputValue={this.state.plateNumber}
              inputLabel="Vehicle Plate Number"
              placeholder="Enter Vehicle Plate Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(vehicleModel) => this.setState({ vehicleModel })}
              inputValue={this.state.vehicleModel}
              inputLabel="Vehicle Model"
              placeholder="Enter Vehicle Model"
            />
          </View>
          <View style={styles.submitButtonWrapper}>
            <WhiteButton
              text="Back"
              bordered
              buttonWidth={100}
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.props.navigation.goBack()}
            />
            <GreenButton
              text="Continue"
              buttonWidth={100}
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.continue()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
