import axios from "axios";
import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import Header from "../../../../components/Header";
import InputBox from "../../../../components/InputBox";
import WhiteButton from "../../../../components/WhiteButton";
import Config from "../../../../Helpers/Config";

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

export default class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      processing: false,
    };
  }

  componentDidMount() {
    this.setState({ email: global.user.email });
  }

  handleSubmit = () => {
    let email = this.state.email;

    if (!email) {
      Alert.alert("Reset Password", "Fill in the blank fields");

      return;
    }

    let this_ = this;

    let url = Config.base_url + "/forgot-password";

    let body = { email: email };

    this.setState({ processing: true });

    axios
      .post(url, body)
      .then(function(response) {
        data = response.data;

        status = data.status;
        message = data.message;

        if (status != "200") {
          Alert.alert("Reset Password", message.toString());
        } else {
          Alert.alert("Reset Password", message.toString());
        }

        this_.setState({ processing: false });

        return;
      })
      .catch(function(error) {
        this_.setState({ processing: false });

        Alert.alert("Reset Password", error.toString());

        return;
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          text="Reset Password"
          backAction={() => this.props.navigation.goBack()}
        />

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

        <View style={styles.submitButtonWrapper}>
          <GreenButton
            text="Submit"
            disabled={this.state.processing}
            processing={this.state.processing}
            onPress={() => this.handleSubmit()}
          />
        </View>
      </View>
    );
  }
}
