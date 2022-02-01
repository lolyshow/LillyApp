import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
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
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      numberOfPin: null,
      selectedEducation: "WAEC",
      showModalSelect: false,
    };
  }

  continue = async () => {
    try {
      let { numberOfPin, selectedEducation } = this.state;

      if (numberOfPin && selectedEducation) {
        let body = {
          serviceCode: "WAV",
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

          let price = response.product[0].price;

          let purchaseBody = {
            serviceCode: "WAP",
            amount: price,
            numberOfPin: numberOfPin,
          };

          
          let validationList = [
            { label: "Education Body", value: "WAEC" },
            { label: "Number of Pins", value: numberOfPin },
            { label: "Amount", value: Helper.formattedAmountWithNaira(price) },
            { label: "Total Amount", value: Helper.formattedAmountWithNaira(price * numberOfPin) },
          ];

          let summaryList =  [

            { label: "PIN Amount", value: Helper.formattedAmountWithNaira(price) },
            { label: "Number of Pins", value: numberOfPin },

          ];

          let item =  this.props.route.params; 

          this.props.navigation.navigate("Education.Validation", {
            amount: price,
            total: price * numberOfPin,
            validationList,
            summaryList,
            validationResponse: response,
            body: purchaseBody,
            logo: item.value
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="WAEC"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(numberOfPin) => this.setState({ numberOfPin })}
              inputValue={this.state.numberOfPin}
              inputLabel="Number of Pin"
              placeholder="Enter Number of Pin"
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
