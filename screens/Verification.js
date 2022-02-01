import React, { Component } from "react";

import {
  ScrollView,
  TextInput,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";

import GreenButton from "../components/GreenButton";

import Icon from "react-native-vector-icons/Ionicons";

import TokenUnderline from "../components/TokenUnderline";
import InputBox from "../components/InputBox";
import axios from "axios";
import Config from "../Helpers/Config";
import SelectBox from "../components/SelectBox";

import logoWatermark from "../assets/logoWatermark.png";

const screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17375e",
    flexDirection: "column",
    padding: 5,
  },

  line: {
    width: 47,
    height: 60,
    opacity: 0.15,
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderColor: "#17375e",
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

  verificationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  verification: {
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
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },

  rectangle3079: {
    marginHorizontal: 5,
    alignSelf: "stretch",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "space-around",
  },
  inputs: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  verifySwitch: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
  },

  verify: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
  },
  verifyActive: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },
  verifyWrapper: {
    height: 36,
    width: 135,
    alignItems: "center",
    justifyContent: "center",
  },

  verifyWrapperActive: {
    height: 36,
    width: 135,
    borderRadius: 10,
    backgroundColor: "#17375e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  formRow: {
    marginHorizontal: 20,
    marginTop: 40,
  },
});

const countDownMinutes = 5;
const countDownSeconds = 0;

export default class Verification extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      tokenLength: 6,
      email: "",
      phone: "",
      processing: false,
      tabs: ["Phone", "Email"],
      phoneVerificationTypes: [
        { label: "SMS", value: "sms" },
        { label: "Voice", value: "voice" },
      ],
      phoneVerificationType: "sms",
      selectedTab: "Phone",
      sentCode: false,
      minutes: countDownMinutes,
      seconds: countDownSeconds,
    };
  }

  componentDidMount() {
    let { email, phone } = this.props.route.params;

    this.setState({ email, phone });
  }

  getToken = async (type = null) => {
    try {
     let url = Config.base_url + "/generate/phone-token";
     let body = {
        phone: this.state.phone,
        type: type ?? this.state.phoneVerificationType,
      };

      this.setState({ processing: true });

      const { message, status } = await axios
        .post(url, body)
        .then((response) => response.data);

      this.setState({ processing: false });

      if (status == "200") {
        this.setState({
          minutes: countDownMinutes,
          seconds: countDownSeconds,
          sentCode: true,
        });
        this.countDown();
      } else {
        Alert.alert("Verification", message.toString());
        return;
      }
    } catch (err) {
      this.setState({ processing: false });
      Alert.alert("Verification", err.toString());
      return;
    }
  };

  verifyPhone = async () => {
    try {
      let url = Config.base_url + "/verify/phone";
      let body = {
        phone: this.state.phone,
        otp: this.state.token,
      };

      if (this.state.token.length != this.state.tokenLength) {
        Alert.alert("Verification", "Please complete the token field");
        return;
      }

      this.setState({ processing: true });

      const { message, status } = await axios
        .post(url, body)
        .then((response) => response.data);

      this.setState({ processing: false });

      if (status == "200") {
        Alert.alert("Verification", "Phone number verification successful");

        let { email, password, firstname, lastname } = this.props.route.params;

        return this.props.navigation.navigate("Terms", {
          email,
          password,
          firstname,
          lastname,
        });
      } else {
        Alert.alert("Verification", message.toString());
        return;
      }
    } catch (err) {
      this.setState({ processing: false });
      Alert.alert("Verification", err.toString());
      return;
    }
  };

  verifyEmail = async () => {
    try {
      let url = Config.base_url + "/verify/email";
      let body = {
        email: this.state.email,
      };

      this.setState({ processing: true });

      const { message, status } = await axios
        .post(url, body)
        .then((response) => response.data);

      this.setState({ processing: false });

      if (status == "200") {
        Alert.alert(
          "Verify Email",
          "An email verification link has been sent to your registered email address. Click on the link to continue your registration. Thank you"
        );

        this.props.navigation.navigate("Login");
      } else {
        Alert.alert("Verification", message.toString());
        return;
      }
    } catch (err) {
      this.setState({ processing: false });
      Alert.alert("Verification", err.toString());
      return;
    }
  };

  countDown = () => {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
          // this.setState({sentCode:false})
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  };

  myInterval = () => {};

  phoneView = () => (
    <>
      {this.state.sentCode ? (
        <>
          <View style={styles.instructionWrapper}>
            <Text style={styles.instructionText}>
              Enter the {this.state.tokenLength}-digit number sent to
            </Text>
            <Text style={styles.instructionText}> {this.state.phone} </Text>
          </View>

          <View style={styles.rectangle3079}>
            <View>
              <TokenUnderline
                length={this.state.tokenLength}
                value={this.state.token}
                setValue={(token) => {
                  this.setState({ token });
                }}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <GreenButton
                text="Verify Account"
                disabled={
                  this.state.processing ||
                  this.state.minutes == 0 ||
                  this.state.seconds == 0
                }
                processing={this.state.processing}
                onPress={() => this.verifyPhone()}
              />
            </View>

            <View>
              {this.state.minutes > 0 || this.state.seconds > 0 ? (
                <Text style={{ textAlign: "center" }}>
                  Re-send code {this.state.minutes}:
                  {this.state.seconds < 10
                    ? `0${this.state.seconds}`
                    : this.state.seconds}{" "}
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.getToken("sms");
                    }}
                  >
                    <Text
                      style={{
                        // textAlign: "center",
                        textDecorationLine: "underline",
                      }}
                    >
                      Re-send code (SMS)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.getToken("voice");
                    }}
                  >
                    <Text
                      style={{
                        // textAlign: "center",
                        textDecorationLine: "underline",
                      }}
                    >
                      Re-send code (Voice)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.formRow}>
          <View style={[{ marginVertical: 10 }]}>
            <Text style={{ fontSize: 17, color: "#ffffff" }}>
              Phone verification type
            </Text>
            <SelectBox
              value={this.state.phoneVerificationType}
              onValueChange={(phoneVerificationType) =>
                this.setState({ phoneVerificationType })
              }
              placeholder={{}}
              items={this.state.phoneVerificationTypes}
            />
          </View>
          <Text style={{ fontSize: 17, color: "#ffffff" }}>Phone number</Text>
          <InputBox
            keyboardType="phone-pad"
            onChangeText={(phone) => this.setState({ phone })}
            inputValue={this.state.phone}
            editable={false}
          />

          <View style={{ marginTop: 30 }}>
            <GreenButton
              text="Verify Phone Number"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.getToken()}
            />
          </View>
        </View>
      )}
    </>
  );

  emailView = () => (
    <View style={styles.formRow}>
      <Text style={{ fontSize: 17, color: "#ffffff" }}>Email address</Text>
      <InputBox
        keyboardType="email-address"
        onChangeText={(email) => this.setState({ email })}
        inputValue={this.state.email}
        editable={false}
      />

      <View style={{ marginTop: 30 }}>
        <GreenButton
          text="Verify Email Address"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.verifyEmail()}
        />
      </View>
    </View>
  );

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
            onPress={() => this.props.navigation.navigate("Login")}
            size={30}
            name="chevron-back-outline"
            color="#ffffff"
          ></Icon>
        </View>

        <View style={styles.verificationWrapper}>
          <Text style={styles.verification}>Verification</Text>
        </View>

        <View style={styles.verifySwitch}>
          {this.state.tabs.map((item, index) => (
            <TouchableOpacity
              key={item + index}
              onPress={() => this.setState({ selectedTab: item })}
            >
              <View
                style={
                  this.state.selectedTab === item
                    ? styles.verifyWrapperActive
                    : styles.verifyWrapper
                }
              >
                <Text
                  style={
                    this.state.selectedTab === item
                      ? styles.verifyActive
                      : styles.verify
                  }
                >
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {this.state.selectedTab == "Phone" && this.phoneView()}

        {this.state.selectedTab == "Email" && this.emailView()}
      </ImageBackground>
    );
  }
}
