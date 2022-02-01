import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Platform, Alert } from "react-native";

import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import SelectBox from "../../../components/SelectBox";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import axios from "axios";
import Network from "../../../Helpers/Network";

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
    alignItems: "flex-end",
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowField: {
    // alignSelf:'stretch'
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      insuredName: "",
      insuranceType: "",
      engineNumber: "",
      vehicleMake: "",
      email: "",
      vehicleColor: "",
      yearOfMake: "",
      insurancePlans: [],
      yearOfMakes: [],
      vehicleColors: [],
      showModalSelect: false,
      showDate: false,
      pageIndex: 0,
    };
  }

  componentDidMount() {
    this.getPlans();
  }

  planLIst = () => {
    let list = [];

    this.state.insurancePlans.forEach((item, index) => {
      list.push({
        label: `${item.name} -${item.amount}`,
        value: item,
        key: index,
      });
    });

    return list;
  };

  colorList = () => {
    let list = [];

    this.state.vehicleColors.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  yearOfMakeList = () => {
    let list = [];

    this.state.yearOfMakes.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  getPlans = async () => {
    try {
      let body = {
        serviceCode: "LUL",
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      if (error) {
        return Alert.alert("LUR Insurance", errorMessage);
      }

      if (response.lookup) {
        this.setState({
          insurancePlans: response.lookup.insuranceType,
          vehicleColors: response.lookup.vehicleColor,
          yearOfMakes: response.lookup.yearOfMake,
        });
      } else {
        Alert.alert("LUR Insurance", "Could not fetch plans");
      }
    } catch (error) {
      Alert.alert("LUR Insurance", error.toString());
    }
  };

  continue = async () => {
    try {
      let {
        insuredName,
        insuranceType,
        engineNumber,
        vehicleMake,
        email,
        vehicleColor,
        yearOfMake,
      } = this.state;

      if (
        insuredName &&
        insuranceType &&
        engineNumber &&
        vehicleMake &&
        email &&
        vehicleColor &&
        yearOfMake
      ) {

        let item =  this.props.route.params; 

        this.props.navigation.navigate("LUR.SecondScreen", {
          insuredName,
          insuranceType,
          engineNumber,
          vehicleMake,
          email,
          vehicleColor,
          yearOfMake,
          logo:"LUR_INSURANCE"
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
              keyboardType="default"
              onChangeText={(insuredName) => this.setState({ insuredName })}
              inputValue={this.state.insuredName}
              inputLabel="Insured Name"
              placeholder="Enter Insured Name"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              inputValue={this.state.email}
              inputLabel="Email Address"
              placeholder="Enter Your Email Address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="Insurance Type"
              value={this.state.insuranceType}
              onValueChange={(insuranceType) =>
                this.setState({ insuranceType })
              }
              placeholder={{ label: "Insurance Type", value: null }}
              items={this.planLIst()}
              iconColor="#17375e"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(engineNumber) => this.setState({ engineNumber })}
              inputValue={this.state.engineNumber}
              inputLabel="Engine Number"
              placeholder="Enter Engine Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(vehicleMake) => this.setState({ vehicleMake })}
              inputValue={this.state.vehicleMake}
              inputLabel="Vehicle Make"
              placeholder="Enter Vehicle Make"
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="Vehicle Year of Make"
              value={this.state.yearOfMake}
              onValueChange={(yearOfMake) => this.setState({ yearOfMake })}
              placeholder={{ label: "Vehicle Year of Make", value: null }}
              items={this.yearOfMakeList()}
              iconColor="#17375e"
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="Vehicle Colour"
              value={this.state.vehicleColor}
              onValueChange={(vehicleColor) => this.setState({ vehicleColor })}
              placeholder={{ label: "Vehicle Colour", value: null }}
              items={this.colorList()}
              iconColor="#17375e"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Next"
              buttonWidth={125}
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
