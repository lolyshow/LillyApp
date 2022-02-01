import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  Button,
  Alert,
} from "react-native";

import InputBox from "../../../../components/InputBox";

import SelectBox from "../../../../components/SelectBox";

import GenderSelect from "../../../../components/GenderSelect";

import WhiteButton from "../../../../components/WhiteButton";
import Header from "../../../../components/Header";
import Helper from "../../../../Helpers/Helper";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,

    // paddingBottom:100
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

export default class Profile extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,

      firstname: "",

      lastname: "",

      state: "",

      username: "",

      lga: "",

      address: "",

      email: "",

      phone: "",

      gender: "",

      plan: null,

      date: "DD/MM/YYYY",

      states: [],

      lgas: [],

      showModalSelect: false,

      showDate: false,
    };
  }

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;

    this.setState({ showDate: Platform.OS === "ios", date: currentDate });
  };

  componentDidMount() {
    let {
      firstname,
      lastname,
      level,
      email,
      phone,
      username,
      gender,
      state,
      lga,
      address,
      dob,
    } = global.user;

    this.setState({
      firstname,
      lastname,
      level,
      email,
      phone,
      username,
      gender,
      state,
      address,
      lga,
      date: dob,
    });

    this.getStates();
  }

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

  getStates = async () => {
    const response = await Helper.getStates().then((response) => response);

    if (response.error) {
      Alert.alert("Error", response.message.toString());

      return;
    }

    this.setState({ states: response.states });
  };

  getLga = async (state) => {
    const response = await Helper.getLga(state).then((response) => response);

    if (response.error) {
      Alert.alert("Error", response.message.toString());
      return;
    }

    this.setState({ lgas: response.lga });
  };

  onChangeState = (state) => {
    this.setState({ state });

    if (state) {
      this.getLga(state);
    }
  };

  submit = async () => {
    try {
      let { firstname, lastname, gender, lga, state } = this.state;

      if (firstname && lastname && gender && lga && state) {
        let body = {
          serviceCode: "UPD",
          firstname,
          lastname,
          gender,
          lga,
          state,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Update Profile", errorMessage);
        }

        if (response.status == "200") {
          global.user = {
            ...global.user,
            firstname,
            lastname,
            gender,
            lga,
            state,
          };

          Alert.alert("Update Profile", response.message.toString());

          this.props.navigation.navigate("Account");
        } else {
          Alert.alert("Update Profile", response.message.toString());
        }
      } else {
        Alert.alert("Update Profile", "Please fill in the empty fields");
      }
    } catch (error) {
      Alert.alert("Update Profile", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Profile"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(username) => this.setState({ username })}
              inputValue={this.state.username}
              inputLabel="Username"
              placeholder="Enter Username"
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
              keyboardType="number-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Enter Phone Number"
              editable={false}
              editable={false}
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
                  inputWidth={screenWidth * 0.37}
                  placeholder="Enter First Name"
                  editable={false}
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(lastname) => this.setState({ lastname })}
                  inputValue={this.state.lastname}
                  inputLabel="Last Name"
                  placeholder="Enter Last Name"
                  inputWidth={screenWidth * 0.37}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* <View style={styles.inputWrapper}>
            <DatePicker
              value={this.state.date}
              onDateChange={this.onChangeDate}
              label="Date of Birth"
              showDate={this.state.showDate}
              showDatePicker={() => this.setState({ showDate: true })}
            />
          </View> */}

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="State of Residence"
              value={this.state.state}
              onValueChange={this.onChangeState}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
              iconColor="#17375e"
              iconSize={22}
              disabled={true}
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
              disabled={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <GenderSelect
              value={this.state.gender}
              // onGenderChange={(gender) => this.setState({ gender })}
              onGenderChange={(gender) => null}
            />
          </View>

          {/* <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Update Profile"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.submit()}
              editable={false}
            />
          </View> */}

          <View style={styles.submitButtonWrapper}>
            <WhiteButton
              text="Cancel"
              bordered
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
