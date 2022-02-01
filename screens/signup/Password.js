import React, { Component } from "react";

import {
  ScrollView,
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

import logoWatermark from "../../assets/logoWatermark.png";
import InputLinePassword from "../../components/InputLinePassword";

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

  inputWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  lineRow: {
    height: 40,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.select({
      ios: 20,
      android: 20,
    }),
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

export default class Password extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password_confirmation: "",
      secureTextEntryPassword: true,
      secureTextEntryConfirm: true,
      
    };
  }

  continue = () => {
    let data = this.props.route.params;
    let password = this.state.password;
    let password_confirmation = this.state.password_confirmation;

    data.password = password;
    data.password_confirmation = password_confirmation;

    let { valid, message } = this.validatePassword();

    if (!valid) {
      Alert.alert("Sign Up", message);

      return;
    }

    this.props.navigation.navigate("Registration.ConfirmEmail", data);
  };

  validatePassword = () => {
    const password = this.state.password;
    const password_confirmation = this.state.password_confirmation;

    let valid, message;

    // Validate empty string
    if (!password) {
      valid = false;
      message = "Password field cannot be empty";
      return { valid, message };
    }

    // Validate lowercase letters
    let lowerCaseLetters = /[a-z]/g;
    if (!password.match(lowerCaseLetters)) {
      valid = false;
      message = "Your password must contain at least one lowercase letter";
      return { valid, message };
    }

    // Validate capital letters
    // let upperCaseLetters = /[A-Z]/g;
    // if (!password.match(upperCaseLetters)) {
    //   valid = false;
    //   message = "Your password must contain at least one upper letter";
    //   return { valid, message };
    // }

    // Validate numbers
    let numbers = /[0-9]/g;
    if (!password.match(numbers)) {
      valid = false;
      message = "Your password must contain at least one number";
      return { valid, message };
    }

    // let specialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    // if (!password.match(specialCharacter)) {
    //   valid = false;
    //   message = "Your password must contain at least one special character";
    //   return { valid, message };
    // }

    // Validate length
    if (!(password.length >= 8)) {
      valid = false;
      message = "Your password must be at least 8 characters long";
      return { valid, message };
    }

    if (!password_confirmation) {
      valid = false;
      message = "Confirmation Password field cannot be empty";
      return { valid, message };
    }

    if (password_confirmation != password) {
      valid = false;
      message =
        "Your password confirmation must be the same with your password";
      return { valid, message };
    }

    valid = true;
    message = "Ok";
    return { valid, message };
  };

  componentDidMount() {
    // console.log(this.props.route.params);
  }

  componentWillUnmount() {
    // console.log(this.state)
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.backWrapper}>
            <Icon
              onPress={() => this.props.navigation.goBack()}
              size={30}
              name="chevron-back-outline"
              color="#ffffff"
            ></Icon>
          </View>

          <View style={styles.createYourPasswordWrapper}>
            <Text style={styles.createYourPassword}>Create your password</Text>
          </View>

          <View style={styles.instructionWrapper}>
            <Text style={styles.instructionText}>
              Enter at least 8 characters with at least One uppercase and One
              lowercase case letter
            </Text>
          </View>

          <View style={styles.formRow}>
            <InputLinePassword
              keyboardType="default"
              onChangeText={(password) => this.setState({ password })}
              inputValue={this.state.password}
              inputLabel="Password"
              secureTextEntry={true}
              inputStyle={styles.lineRow}
              secureTextEntry={this.state.secureTextEntryPassword}
              passwordViewToggle={() =>
                this.setState({ secureTextEntryPassword: !this.state.secureTextEntryPassword })
              }
            />
          </View>

          <View style={styles.formRow}>
            <InputLinePassword
              keyboardType="default"
              onChangeText={(password_confirmation) =>
                this.setState({ password_confirmation })
              }
              inputValue={this.state.password_confirmation}
              inputLabel="Confirm Password"
              secureTextEntry={true}
              inputStyle={styles.lineRow}
              secureTextEntry={this.state.secureTextEntryConfirm}
              passwordViewToggle={() =>
                this.setState({ secureTextEntryConfirm: !this.state.secureTextEntryConfirm })
              }
            />
          </View>

          <View style={styles.buttonWrapper}>
            <GreenButton
              text="Continue"
              // buttonWidth={317}
              onPress={() => this.continue()}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
