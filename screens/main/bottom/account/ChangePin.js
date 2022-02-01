import axios from "axios";
import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
import Result from "../../../../components/Result";
import TokenMaskedBox from "../../../../components/TokenMaskedBox";
import WhiteButton from "../../../../components/WhiteButton";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  titleWrapper: {
    flexDirection: "row",

    // justifyContent: "space-between",

    marginBottom: 50,
  },

  title: {
    fontSize: 24,

    fontWeight: "500",

    fontStyle: "normal",

    // lineHeight: 32,

    letterSpacing: 0,

    textAlign: "left",

    color: "#17375e",

    marginLeft: 40,
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

  blueText: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    textAlign: "left",
    color: "#707070",
  },
});

export default class ChangePin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      existingPin: "",
      newPin: "",
      newPinConfirm: "",
      screen: "old",
      showResult: false,
      secretPIn: "",
    };
  }

  componentDidMount() {
    let { transaction_pin } = global.user;

    this.setState({ secretPIn: transaction_pin });
  }
  continueToNewPin = () => {
    if (this.state.existingPin.length == 4) {
      if (this.state.existingPin == this.state.secretPIn) {
        this.setState({ screen: "new" });
      } else {
        Alert.alert("Change PIN", "The existing pin you entered is wrong");
      }
    } else {
      Alert.alert("Change PIN", "Please enter a 4 digit pin");
    }
  };

  continueToConfirmPin = () => {
    if (this.state.newPin.length === 4) {
      this.setState({ screen: "confirm" });
    } else {
      Alert.alert("Change PIN", "Please enter a 4 digit pin");
    }
  };

  confirmPin = () => {
    if (this.state.newPinConfirm.length == 4) {
      if (this.state.newPinConfirm == this.state.newPin) {
        this.ChangePinApi();
      } else {
        Alert.alert(
          "Change PIN",
          "Your confirmation PIN does not match with initial PIN"
        );
      }
    } else {
      Alert.alert("Change PIN", "Please enter a 4 digit pin");
    }
  };

  ChangePinApi = async () => {
    try {
      let body = {
        serviceCode: "PIC",
        existing_pin: this.state.existingPin,
        new_pin: this.state.newPin,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Change PIN", errorMessage);
      }

      if (response.status == "200") {
        global.user.transaction_pin = this.state.newPin;

        this.setState({
          existingPin: "",
          newPin: "",
          newPinConfirm: "",
          screen: "old",
          showResult: true,
        });

        this.props.navigation.navigate("Account");
      } else {
        this.setState({
          existingPin: "",
          newPin: "",
          newPinConfirm: "",
          screen: "old",
        });

        Alert.alert("Change PIN", response.message.toString());
      }
    } catch (error) {
      this.setState({
        existingPin: "",
        newPin: "",
        newPinConfirm: "",
        screen: "old",
      });

      Alert.alert("Change PIN", error.toString());
    }
  };

  ExistingPinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}>Existing Transaction PIN</Text>
        <Text style={styles.greyText}>
          Please input existing transaction pin
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <TokenMaskedBox
          length={4}
          value={this.state.existingPin}
          setValue={(existingPin) => this.setState({ existingPin })}
          autoFocus={true}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <GreenButton
          text="Continue"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.continueToNewPin()}
        />
      </View>
    </>
  );

  NewPinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}>New Transaction PIN</Text>
        <Text style={styles.greyText}>Please input new transaction pin</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TokenMaskedBox
          length={4}
          value={this.state.newPin}
          setValue={(newPin) => this.setState({ newPin })}
          autoFocus={true}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <GreenButton
          text="Continue"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.continueToConfirmPin()}
        />
      </View>
    </>
  );

  confirmNewPinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}>Confirm New Transaction PIN</Text>
        <Text style={styles.greyText}>Please confirm new transaction pin</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TokenMaskedBox
          length={4}
          value={this.state.newPinConfirm}
          setValue={(newPinConfirm) => this.setState({ newPinConfirm })}
          autoFocus={true}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <GreenButton
          text="Confirm Pin"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.confirmPin()}
        />
      </View>
    </>
  );
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton onPress={() => this.props.navigation.goBack()} />
        </View>

        {this.state.screen === "old"
          ? this.ExistingPinView()
          : this.state.screen === "new"
          ? this.NewPinView()
          : this.confirmNewPinView()}

        <Result
          closModal={() => this.setState({ showResult: false })}
          status={200}
          header="Transaction PIN Change Successful"
          userMessage={"You have successfully Reset your Transaction PIN"}
          visible={this.state.showResult}
        />
      </View>
    );
  }
}
