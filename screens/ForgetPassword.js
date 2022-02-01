import axios from "axios";
import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ImageBackgroundBase,
  ImageBackground
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import GreenButton from "../components/GreenButton";

import InputLine from "../components/InputLine";

import Config from "../Helpers/Config";

const screenWidth = Math.round(Dimensions.get("window").width);

import logoWatermark from "../assets/logoWatermark.png";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17375e",
    flexDirection: "column",
    padding: 5,
  },

  formRow: {
    marginBottom: 40,
    paddingHorizontal: 25,
  },
  back: {
    fontSize: 25,
    color: "#ffffff",
  },

  backWrapper: {
    marginTop: 15,
    marginLeft: -5,
  },

  buttonWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  createYourPasswordWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  createYourPassword: {
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  instructionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    paddingLeft: 20,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    // textAlign: "center",
    color: "#ffffff",
  },
});

export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      processing: false,
    };
  }

  handleSubmit = () => {
    let email = this.state.email;

    if (!email) {
      Alert.alert("Forget Password", "Fill in the blank fields");

      return;
    }

    let this_ = this;

    let url = Config.base_url + "/forgot-password";

    let body = { email: email };

    this.setState({ processing: true });

    axios
      .post(url, body)
      .then(function (response) {
        data = response.data;

        status = data.status;
        message = data.message;

        if (status != "200") {
          Alert.alert("Forget Password", message.toString());
        } else {
          Alert.alert("Forget Password", message.toString());
        }

        this_.setState({ processing: false, email:"" });

        return;
      })
      .catch(function (error) {
        this_.setState({ processing: false , email:""});

        Alert.alert("Forget Password", error.toString());

        return;
      });
  };

  render() {
    return (
      <ImageBackground
        source={logoWatermark}
        style={styles.container}
        imageStyle={{
          resizeMode:"contain",
          height: '55%', 
          top: undefined,
          // marginRight:'-25%'
          
        }}
      >
        <View style={styles.backWrapper}>
          <Icon
            onPress={() => this.props.navigation.goBack()}
            size={30}
            name="chevron-back-outline"
            color="#ffffff"
          ></Icon>
        </View>

        <View style={styles.createYourPasswordWrapper}>
          <Text style={styles.createYourPassword}>Forgot Password</Text>
        </View>

        <View style={styles.instructionWrapper}>
          <Text style={styles.instructionText}>
            Please enter your email address registered on Lilly
          </Text>
        </View>

        <View style={styles.formRow}>
          <InputLine
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
            inputValue={this.state.email}
            inputLabel="Email"
            // inputWrapperStyle={{ marginTop: 30, marginBottom: 30 }}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <GreenButton
            text="Send Password Reset Link"
            disabled={this.state.processing}
            processing={this.state.processing}
            onPress={() => this.handleSubmit()}
          />
        </View>
      </ImageBackground>
    );
  }
}
