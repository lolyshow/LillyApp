import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ModalSelectBoxWithImage from "../../../components/ModalSelectBoxWithImage";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import axios from "axios";
import Network from "../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  productWrapper: {
    flex: 1,
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

      fac: null,
      amount: null,
      selectedBank: "GTBCardless",
      phone: null,
    };
  }

  continue = async () => {
    try {
      let { fac, amount, phone, selectedBank } = this.state;

      if (fac && phone && amount) {
        let body = {
          serviceCode: "CDV",
          fac: fac,
          amount: amount,
          phone: phone,
          type: selectedBank,
        };
      
        let url = Config.app_url;

        this.setState({ processing: true });

        let { response, error, errorMessage } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Cardless", errorMessage);
        }

        let { status, message } = response;


        if (status == "200") {

          this.setState({ processing: false });

          return this.props.navigation.navigate("BankCardless.Validation", {
            fac: fac,
            amount: amount,
            phone: phone,
            type: selectedBank,
            charge : response.charge,
            validationResponse : response
          });
        }
        
        else {
         
          return Alert.alert("Cardless", message.toString());
        }
      } else {
        this.setState({ processing: false });
        return Alert.alert("Cardless", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("Cardless", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="GT Rescue Cardless Withdrawal"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(fac) => this.setState({ fac })}
              inputValue={this.state.fac}
              inputLabel="FAC"
              placeholder="Enter FAC"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone Number"
              placeholder="Enter Phone Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(amount) => this.setState({ amount })}
              inputValue={this.state.amount}
              inputLabel="Amount"
              placeholder="Amount"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Withdraw"
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
