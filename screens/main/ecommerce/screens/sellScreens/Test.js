import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from "react-native";

import InputBox from "../../../components/InputBox";

import SelectBox from "../../../components/SelectBox";

import GreenButton from "../../../components/GreenButton";

import DatePicker from "../../../components/DatePicker";

import GenderSelect from "../../../components/GenderSelect";

import ModalSelect from "./ModalSelect";

import Header from "../../../components/Header";
import Helper from "../../../Helpers/Helper";
import axios from "axios";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

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

      date:  "DD/MM/YYYY",

      states: [],
      lgas: [],
      plans: [],

      showModalSelect: false,

      showDate: false,
    };
  }

  planList = () => {
    let list = [];

    this.state.plans.forEach((item, index) => {
      if (item.numberOfPersons == 1) {
        list.push({
          month: item.planType,
          condition: item.condition,
          amount: item.price,
          value: item,
          key: index,
        });
      }
    });

    return list;
  };

  stateList = () => {
    let list = [];

    this.state.states.forEach((item, index) => {
      list.push({ label: item.name, value: item.name, key: item.capital });
    });

    return list;
  };

  lgaList = () => {
    let list = [];

    let state = this.state.state;

    this.state.lgas.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  getPlans = async () => {
    try {
      let body = {
        serviceCode: "WLL",
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      if (response.lookup) {
        this.setState({ plans: response.lookup });
      } else {
        Alert.alert("Health", "Could not fetch packages");
      }
    } catch (error) {
      Alert.alert("Health", error.toString());
    }
  };

  getStates = async () => {
    const response = await Helper.getStates().then((response) => response);

    if (response.error) {
      Alert.alert("Health", response.message.toString());

      return;
    }

    this.setState({ states: response.states });
  };

  getLga = async (state) => {
    const response = await Helper.getLga(state).then((response) => response);

    if (response.error) {
      Alert.alert("Health", response.message.toString());
      return;
    }

    this.setState({ lgas: response.lga });
  };

  onChangeState = (state) => {
    this.setState({ state, lga: "" });

    if (state) {
      this.getLga(state);
    }
  };
  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;

    this.setState({ showDate: Platform.OS === "ios", date: currentDate });
  };

  continue = () => {
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
    } = this.state;

    if (
      firstname &&
      lastname &&
      email &&
      phone &&
      gender &&
      state &&
      address &&
      area &&
      plan &&
      date &&
      date != "DD/MM/YYYY"
    ) {
      this.props.navigation.navigate("Health.Validation", {
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
      });
    } else {
      Alert.alert("Health", "Fill in the blank fields");
    }
  };

  componentDidMount() {
    this.getPlans();
    this.getStates();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Lilly Health"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <ModalSelect
              inputLabel="Choose Health package"
              selectTitle="Choose Health package"
              items={this.planList()}
              visible={this.state.showModalSelect}
              selected={this.state.plan}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={(plan) =>
                this.setState({ plan, showModalSelect: false })
              }
              placeholder="Health Plan"
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formRow}>
              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(firstname) => this.setState({ firstname })}
                  inputValue={this.state.firstname}
                  inputLabel="First Name"
                  inputWidth={screenWidth * 0.38}
                  placeholder="Enter First Name"
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(lastname) => this.setState({ lastname })}
                  inputValue={this.state.lastname}
                  inputLabel="Last Name"
                  placeholder="Enter Last Name"
                  inputWidth={screenWidth * 0.38}
                />
              </View>
            </View>
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
            <InputBox
              keyboardType="number-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Enter Phone Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <DatePicker
              value={this.state.date}
              onDateChange={this.onChangeDate}
              label="Date of Birth"
              showDate={this.state.showDate}
              showDatePicker={() => this.setState({ showDate: true })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <GenderSelect
              value={this.state.gender}
              onGenderChange={(gender) => this.setState({ gender })}
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
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="State of Residence"
              value={this.state.state}
              onValueChange={this.onChangeState}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="L.G.A of Residence"
              value={this.state.lga}
              onValueChange={(lga) => this.setState({ lga })}
              placeholder={{ label: "Select L.G.A", value: null }}
              items={this.lgaList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(area) => this.setState({ area })}
              inputValue={this.state.area}
              inputLabel="Area"
              placeholder="Enter Area"
              multiline={true}
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Next"
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