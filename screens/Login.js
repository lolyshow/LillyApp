import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  AlertIOS,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  AppState,
} from "react-native";
import axios from "axios";
import InputLine from "../components/InputLine";
import InputLinePassword from "../components/InputLinePassword";
import GreenButton from "../components/GreenButton";
import Logo from "../assets/lilly2.png";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../Helpers/Config";
import logoWatermark from "../assets/logoWatermark.png";
import Helper from "../Helpers/Helper";
import Storage from "../Helpers/Storage";

import FingerprintScanner from "react-native-fingerprint-scanner";

import styles from "../components/Fingerprint/Application.container.styles";

import FingerprintPopup from "../components/Fingerprint/FingerprintPopup.component";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

import { store } from "../redux/store";

const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6951b3",
    flexDirection: "column",
    padding: 20,
    paddingBottom: Platform.select({
      ios: 40,
      android: 10,
    }),
  },

  inputWrapper: {
    marginVertical: Platform.select({
      ios: 25,
      android: 12,
    }),
  },
  brandWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  submitButtonWrapper: {
    flexDirection: "column",
    marginTop: 20,
    paddingHorizontal: 10,
  },

  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },

  forgetPasswordWrapper: {
    marginTop: 20,
    // marginBottom:15
  },

  Log_In: {
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 57,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  brandLogo: {
    width: 40,
    height: 50,
  },

  signupWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },

  signupText: {
    textAlign: "center",
    color: "white",
    textDecorationLine: "underline",
  },

  close: {
    fontWeight: "bold",
    fontSize: 27,
    color: "#ffffff",
  },

  closeWrapper: {
    marginLeft: -5,
    marginBottom: 10,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      secureTextEntry: true,
      processing: false,
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
      showBiometric: false,
      biometryType: undefined,
    };
  }

  validateForm = () => {
    let email = this.state.email;
    let password = this.state.password;

    if (!email) {
      return {
        validationStatus: false,
        errorMessage: "Username cannot be empty",
      };
    } else if (!password) {
      return {
        validationStatus: false,
        errorMessage: "Password cannot be empty",
      };
    } else {
      return { validationStatus: true, errorMessage: "Ok" };
    }
  };

  accountVerified = (user) => {
    return user.email_verified == "1" || user.phone_verified == "1"
      ? true
      : false;
  };

  acceptedTerms = (user) => {
    return user.accept_terms == "1" ? true : false;
  };

  submitForm = async () => {
    try {
      let { email, password } = this.state;

      let { validationStatus, errorMessage } = this.validateForm();

      if (!validationStatus) {
        return Alert.alert("Message", errorMessage);
      }

      return this.signIn(email, password);
    } catch (error) {
      Alert.alert("Error", error.toString());
    }
  };

  signIn = async (email, password) => {
    try {
      this.setState({ processing: true });

      let { message, error, user } = await Helper.logInApi(
        email,
        password
      ).then((result) => result);

      this.setState({ processing: false });

      if (!error) {
        this.setState({ email: "", password: "" });

        let accountVerified = this.accountVerified(user);

        let acceptedTerms = this.acceptedTerms(user);

        // if (!accountVerified) {
        //   return this.props.navigation.navigate("Verification", {
        //     email: Helper.getPropValue(global, "user.email") ?? email,
        //     password,
        //     phone: user.phone,
        //     firstname: user.firstname,
        //     lastname: user.lastname,
        //   });
        // }

        // if (!acceptedTerms) {
        //   return this.props.navigation.navigate("Terms", {
        //     email: Helper.getPropValue(global, "user.email") ?? email,
        //     password,
        //     firstname: user.firstname,
        //     lastname: user.lastname,
        //   });
        // }
        store.dispatch({
          type: "IS_SIGNED_IN",
          payload: true,
        });
        return this.props.navigation.navigate("Main");
      } else {
        Alert.alert("Login", message);
      }
    } catch (error) {
      this.setState({ processing: false });

      Alert.alert("Error", error.toString());
    }
  };

  async componentDidMount() {
    try {
      AppState.addEventListener("change", this.handleAppStateChange);

      let [autoLoginPromise, biometricLoginPromise] = await Promise.all([
        Storage.getObjectData("autoLogin").then((res) => res),
        Storage.getObjectData("biometricLogin").then((res) => res),
      ]).then((results) => results);

      if (autoLoginPromise.data === true) {
        this.asyncLogin();
      }

      if (biometricLoginPromise.data === true) {
        this.fingerPrintLogin();
      }
    } catch (error) {}
  }

  asyncLogin = async () => {
    try {
      const [usernamePromise, passwordPromise] = await Promise.all([
        Storage.getStringData("username").then((res) => res),
        Storage.getStringData("password").then((res) => res),
      ]);

      if (usernamePromise.data && passwordPromise.data) {
        this.setState({
          email: usernamePromise.data,
          password: passwordPromise.data,
        });
        return this.signIn(usernamePromise.data, passwordPromise.data);
      }
    } catch (error) {}
  };

  fingerPrintLogin = async () => {
    try {
      const [usernamePromise, passwordPromise] = await Promise.all([
        Storage.getStringData("username").then((res) => res),
        Storage.getStringData("password").then((res) => res),
      ]);

      if (usernamePromise.data && passwordPromise.data) {
        FingerprintScanner.isSensorAvailable()
          .then((biometryType) => {
            this.setState({ showBiometric: true, biometryType });
          })
          .catch((error) => {
            this.setState({
              errorMessage: error.message,
              biometric: error.biometric,
            });
            Alert.alert("Biometric signIn", error.message);
          });
      }
    } catch (error) {}
  };

  handleFingerprintShowed = () => {
    this.setState({ popupShowed: true });
  };

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false });
  };

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  detectFingerprintAvailable = () => {
    FingerprintScanner.isSensorAvailable().catch((error) =>
      this.setState({ errorMessage: error.message, biometric: error.biometric })
    );
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    const { popupShowed, showBiometric } = this.state;

    return (
      <ImageBackground
        // source={logoWatermark}
        style={styles_.container}
        imageStyle={{
          resizeMode: "contain",
          height: "55%",
          top: undefined,
          // marginRight:'-25%'
        }}
      >
        {/* <ScrollView> */}
        <View style={styles_.closeWrapper}>
          <Icon
            onPress={() => this.props.navigation.goBack()}
            size={30}
            name="close-outline"
            color="#ffffff"
          ></Icon>
        </View>
        <View style={styles_.brandWrapper}>
          <Text style={[styles_.Log_In]}> Log In</Text>

          <Image source={Logo} resizeMode="contain" style={styles_.brandLogo} />
        </View>
        <InputLine
          keyboardType="email-address"
          placeholder = "Enter email Address"
          onChangeText={(email) => this.setState({ email })}
          inputValue={this.state.email}
          inputLabel="Email Addesss"
          inputWrapperStyle={styles_.inputWrapper}
        />
        <InputLinePassword
          keyboardType="default"
          placeholder = "Enter Password"
          onChangeText={(password) => this.setState({ password })}
          inputValue={this.state.password}
          inputLabel="Password"
          inputWrapperStyle={styles_.inputWrapper}
          secureTextEntry={this.state.secureTextEntry}
          passwordViewToggle={() =>
            this.setState({ secureTextEntry: !this.state.secureTextEntry })
          }
        />
        {showBiometric && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
            }}
            onPress={this.handleFingerprintShowed}
            // disabled={!!errorMessage}
          >
            <Text style={styles_.forgotPassword}>
              {" "}
              {Platform.select({
                ios: " Touch ID Login",
                android: "FingerPrint Login",
              })}
              {"   "}
            </Text>
            <Image
              source={require("../components/Fingerprint/assets/finger_print.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        )}
        <View style={styles_.submitButtonWrapper}>
          <GreenButton
            text="Login"
            disabled={this.state.processing}
            processing={this.state.processing}
            onPress={() => this.submitForm()}
          />
        </View>
        <View style={styles_.forgetPasswordWrapper}>
          <Text
            style={styles_.forgotPassword}
            onPress={() => {
              this.props.navigation.navigate("ForgotPassword");
            }}
          >
            Forgot Password
          </Text>
        </View>
        <View style={styles_.signupWrapper}>
          <Text
            style={styles_.signupText}
            onPress={() => {
              this.props.navigation.navigate("Register");
            }}
          >
            New here? Sign up
          </Text>
        </View>

        {popupShowed && (
          <FingerprintPopup
            style={styles.popup}
            handlePopupDismissed={this.handleFingerprintDismissed}
            afterVerification={this.asyncLogin}
          />
        )}

        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}

export default Login;
