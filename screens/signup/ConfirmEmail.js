import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import InputLine from "../../components/InputLine";

import GreenButton from "../../components/GreenButton";
import axios from "axios";
import Config from "../../Helpers/Config";

import logoWatermark from "../../assets/logoWatermark.png";

const screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17375e",
    flexDirection: "column",
    padding: 5,
  },

  formRow: {
    margin: 20,
  },

  lineRow: {
    alignSelf: "stretch",
    height: 40,
    opacity: 0.5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
  },

  back: {
    fontSize: 25,
    color: "#ffffff",
  },

  backWrapper: {
    marginLeft: -5,
    marginTop: 15,
  },

  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.select({
      ios: 20,
      android: 20,
    }),
    paddingHorizontal: 30,
  },
  confirmWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  confirm: {
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
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
});

export default class ConfirmEmail extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      processing: false,
    };
  }

  continue = async () => {
    let data = this.props.route.params;
    data.email = this.state.email;

    this.setState({ processing: true });
    let { status, response, message } = await this.submitForm().then(
      (response) => response
    );
    this.setState({ processing: false });

    if (status) {

      Alert.alert("Verification", "Account created successfully");

      this.props.navigation.navigate("Verification", data);

    } else {
      Alert.alert("Sign Up", message);
    }
  };

  submitForm = async () => {
    
    const url = Config.base_url + "/register";

    const body = this.props.route.params;

    body.email = this.state.email;

    let responseData;

    await axios
      .post(url, body)

      .then((res) => {
        let response = res.data;

        let status = response.status;

        let message = response.message;

        if (status === "200") {
          responseData = {
            status: true,
            response: response,
            message: "Account Successfully Created",
          };
        } else {
          responseData = {
            status: false,
            response: response,
            message: message.toString(),
          };
        }
      })
      .catch((error) => {
        responseData = {
          status: false,
          response: response,
          message: error.toString(),
        };
      });

    return responseData;
  };

  componentDidMount() {
    this.setState({ email: this.props.route.params.email });
  }

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
        <View style={styles.backWrapper}>
          <Icon
            onPress={() => this.props.navigation.goBack()}
            size={30}
            name="chevron-back-outline"
            color="#ffffff"
          ></Icon>
        </View>

        <View style={styles.confirmWrapper}>
          <Text style={styles.confirm}>Please Confirm</Text>
        </View>

        <View style={styles.instructionWrapper}>
          <Text style={styles.instructionText}>
            An account is about to be created with email address below. Please
            make sure it's the correct email address
          </Text>
        </View>

        <View style={styles.formRow}>
          <InputLine
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
            inputValue={this.state.email}
            inputLabel="Email"
            inputWrapperStyle={styles.inputWrapper}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <GreenButton
            text="Yes, Create my account"
            // buttonWidth={317}
            onPress={() => this.continue()}
            processing={this.state.processing}
            disabled={this.state.processing}
          />
        </View>
      </ImageBackground>
    );
  }
}
