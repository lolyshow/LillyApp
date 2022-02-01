import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";

// import RNPickerSelect from 'react-native-picker-select';

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

import logoWatermark from "../../assets/logoWatermark.png";

import Icon from "react-native-vector-icons/Ionicons";

import SelectLine from "../../components/SelectLine";

import InputLine from "../../components/InputLine";

import GreenButton from "../../components/GreenButton";
import Config from "../../Helpers/Config";
import axios from "axios";
import Helper from "../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17375e",
    flexDirection: "column",
    padding: 15,
  },

  formColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Platform.select({
      ios: 40,
      android: 30,
    }),
  },

  formRow: {
    marginBottom: Platform.select({
      ios: 40,
      android: 30,
    }),
  },

  signupText: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  signupWrapper: {
    justifyContent: "flex-start",
    marginBottom: Platform.select({
      ios: 40,
      android: 20,
    }),
  },

  close: {
    fontSize: 25,
    color: "#ffffff",
  },

  closeWrapper: {
    marginLeft: -15,
  },

  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default class Info extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      username: "",
      gender: "",
      phone: "",
      referred_id: "",
      state: "",
      lga: "",
      email: "",
      genders: ["Male", "Female"],
      states: [],
      lgas: [],
    };
  }

  genderList = () => {
    let gendersLists = [];

    this.state.genders.forEach((item, index) => {
      gendersLists.push({ label: item, value: item, key: index });
    });

    return gendersLists;
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

  continue = () => {
    const {
      firstname,
      lastname,
      username,
      phone,
      email,
      gender,
      state,
      lga,
      referred_id,
    } = this.state;

    if (
      firstname &&
      lastname &&
      username &&
      phone &&
      email &&
      gender &&
      state &&
      lga
    ) {
      const info = {
        firstname,
        lastname,
        username,
        phone,
        email,
        gender: gender.toLocaleLowerCase(),
        state,
        lga,
        referred_id,
      };

      this.props.navigation.navigate("Registration.Password", info);
    } else {
      Alert.alert("Sign Up", "Fill in the blank fields");

      return;
    }
  };

  componentDidMount() {
    this.getStates();
  }

  onChangeState = (state) => {
    this.setState({ state, lga: "" });

    if (state) {
      this.getLga(state);
    }
  };

  render() {
    return (
      <ImageBackground
        source={logoWatermark}
        style={styles.container}
        imageStyle={{
          resizeMode: "contain",
          height: "55%",
          top: undefined,
          // marginRight:'-25%'
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.select({ ios: 150, android: 10 }),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.closeWrapper}>
            <Icon
              onPress={() => this.props.navigation.goBack()}
              size={30}
              name="close-outline"
              color="#ffffff"
            ></Icon>
          </View>
          <View style={styles.signupWrapper}>
            <Text style={[styles.signupText]}> Sign up</Text>
          </View>

          <View style={styles.formColumn}>
            <InputLine
              keyboardType="default"
              onChangeText={(firstname) => this.setState({ firstname })}
              inputValue={this.state.firstname}
              inputLabel="Firstname"
              inputWidth={screenWidth * 0.45}
            />

            <InputLine
              keyboardType="default"
              onChangeText={(lastname) => this.setState({ lastname })}
              inputValue={this.state.lastname}
              inputLabel="Lastname"
              inputWidth={screenWidth * 0.45}
            />
          </View>

          <View style={styles.formColumn}>
            <InputLine
              keyboardType="default"
              onChangeText={(username) => this.setState({ username })}
              inputValue={this.state.username}
              inputLabel="Username"
              inputWidth={screenWidth * 0.45}
            />

            <SelectLine
              inputWidth={screenWidth * 0.45}
              inputLabel="Gender"
              value={this.state.gender}
              onValueChange={(gender) => this.setState({ gender })}
              placeholder={{ label: "Select gender", value: null }}
              items={this.genderList()}
            />
          </View>

          <View style={styles.formRow}>
            <InputLine
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              inputValue={this.state.email}
              inputLabel="Email"
            />
          </View>

          <View style={styles.formRow}>
            <InputLine
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone Number"
            />
          </View>

          <View style={styles.formColumn}>
            <SelectLine
              inputLabel="State of Residence"
              inputWidth={screenWidth * 0.45}
              value={this.state.state}
              onValueChange={this.onChangeState}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
            />

            <SelectLine
              inputWidth={screenWidth * 0.45}
              inputLabel="LGA of Residence"
              value={this.state.lga}
              onValueChange={(lga) => this.setState({ lga })}
              placeholder={{ label: "Select LGA", value: null }}
              items={this.lgaList()}
            />
          </View>

          <View style={styles.formRow}>
            <InputLine
              keyboardType="default"
              onChangeText={(referred_id) => this.setState({ referred_id })}
              inputValue={this.state.referred_id}
              inputLabel="Referral ID (Optional)"
            />
          </View>

          <View style={styles.buttonWrapper}>
            <GreenButton text="Continue" onPress={() => this.continue()} />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
