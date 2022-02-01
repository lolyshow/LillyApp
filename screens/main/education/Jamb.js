import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import SelectBox from "../../../components/SelectBox";
import Helper from "../../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  selectDiscProviderWrapper: {
    marginBottom: 20,
  },

  selectDiscProvider: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#acacac",
    textAlign: "left",
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      profileCode: null,
      selectedEducation: "JAMB",
      showModalSelect: false,
      options: [],
      option: null,
    };
  }

  continue = async () => {
    try {
      let { profileCode, selectedEducation, option } = this.state;

      if (profileCode && selectedEducation && profileCode && option) {
        let { type, price } = option;

        let body = {
          serviceCode: "JMV",
          profileCode,
          type,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Education", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          let purchaseBody = {
            serviceCode: "JMB",
            amount: price,
            profileCode: profileCode,
            type: type,
          };

          let validationList = [
            { label: "Education Body", value: "JAMB" },
            { label: "Option", value: type },
            { label: "Profile Code", value: profileCode },
            { label: "Full Name", value: response.fullName },
            { label: "Amount", value: Helper.formattedAmountWithNaira(price) },
          ];

          let summaryList =  [
            { label: "PIN Amount", value: Helper.formattedAmountWithNaira(price) }
          ];

          let item =  this.props.route.params; 

          this.props.navigation.navigate("Education.Validation", {
            amount: price,
            total: price,
            validationResponse: response,
            validationList,
            summaryList,
            body: purchaseBody,
            logo:item.value
          });
        } else {
          return Alert.alert("Education", message.toString());
        }
      } else {
        this.setState({ processing: false });
        return Alert.alert("Education", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("Education", error.toString());
    }
  };

  componentDidMount() {
    this.getOptions();
  }

  getOptions = async () => {
    let options = [];

    let body = {
      serviceCode: "JMO",
    };

    let url = Config.app_url;

    this.setState({ processing: true });

    let { error, errorMessage, response } = await new Network().post(url, body);

    this.setState({ processing: false });

    if (error) {
      return Alert.alert("Education", errorMessage);
    }

    let { status, message } = response;

    if (status == "200") {
      response.product.forEach((element) => {
        options.push({
          label:
            element.type +
            " - " +
            Helper.formattedAmountWithNaira(element.price),
          value: element,
        });

        this.setState({ options });
      });
    } else {
      return Alert.alert("Education", "Could not fetch option and pricing");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="JAMB"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.infoText}>
              {" "}
              <Icon name="information-circle" size={22} color="#17375e" /> Send
              NIN [Your NIN] e.g. NIN 0000000000 to 55019 to create Profile Code
              or send HELP to 55019
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              items={this.state.options}
              value={this.state.option}
              placeholder={{ label: "Choose from options", value: null }}
              inputLabel="Jamb Options"
              onValueChange={(option) => this.setState({ option })}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(profileCode) => this.setState({ profileCode })}
              inputValue={this.state.profileCode}
              inputLabel="Profile Code"
              placeholder="Enter Profile Code"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Continue"
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
