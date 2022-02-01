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
import axios from "axios";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";

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
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      bets: [
        {
          value: "Bet9ja",
          label: "Bet9ja",
          image: require("../../../assets/bet/bet9ja.png"),
          borderColor: "#14b151",
        },
        {
          value: "BetWay",
          label: "BetWay",
          image: require("../../../assets/bet/betway.jpg"),
          borderColor: "#000000",
        },
        {
          value: "NairaBet",
          label: "NairaBet",
          image: require("../../../assets/bet/nairabet.png"),
          borderColor: "#013be5",
        },

        {
          value: "1xBet",
          label: "1xBet",
          image: require("../../../assets/bet/1xbet.png"),
          borderColor: "#00BFFF",
        },
        {
          value: "MerryBet",
          label: "MerryBet",
          image: require("../../../assets/bet/merrybet.jpg"),
          borderColor: "#FF8C00",
        },

        {
          value: "CloudBet",
          label: "CloudBet",
          image: require("../../../assets/bet/cloudbet.jpg"),
          borderColor: "#008000",
        },

        {
          value: "SupaBet",
          label: "SupaBet",
          image: require("../../../assets/bet/supabet.jpeg"),
          borderColor: "#FF0000",
        },

        {
          value: "BangBet",
          label: "BangBet",
          image: require("../../../assets/bet/bangbet.png"),
          borderColor: "#000000",
        },

        {
          value: "BetKing",
          label: "BetKing",
          image: require("../../../assets/bet/betking.jpg"),
          borderColor: "#003F87",
        },

        {
          value: "BetLand",
          label: "BetLand",
          image: require("../../../assets/bet/betland.jpeg"),
          borderColor: "#8B0000",
        },

        {
          value: "LiveScoreBet",
          label: "LiveScoreBet",
          image: require("../../../assets/bet/livescorebet.jpg"),
          borderColor: "#FF8C00",
        },

        {
          value: "BetLion",
          label: "BetLion",
          image: require("../../../assets/bet/betlion.jpg"),
          borderColor: "#000000",
        },

        {
          value: "NaijaBet",
          label: "NaijaBet",
          image: require("../../../assets/bet/naijabet.jpg"),
          borderColor: "#008000",
        },
      ],

      betTypes: [
        {
          label: "Individual",
          value: "Individual",
        },
        {
          label: "Agent",
          value: "Agent",
        },
      ],
      betType: "Individual",
      customerId: null,
      amount: null,
      selectedBet: null,
      showModalSelect: false,
    };
  }

  continue = async () => {
    try {
      let { amount, selectedBet, betType, customerId } = this.state;

      if (customerId && selectedBet && amount) {
        if (selectedBet == "Bet9ja" && betType) {
          selectedBet =
            betType == "Individual" ? selectedBet : selectedBet + "_Agent";
        }

        let body = {
          customerId: customerId,
          serviceCode: "BEV",
          type: selectedBet,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Bet", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          this.props.navigation.navigate("Bet.Validation", {
            amount: amount,
            customerId: customerId,
            type: selectedBet,
            name: response.name,
            charge: response.charge,
            validationResponse: response,
            logo: this.state.selectedBet,
          });
        } 
        else {
          return Alert.alert("Bet", message.toString());
        }
        
      } else {
        this.setState({ processing: false });

        return Alert.alert("Bet", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("Bet", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View showsVerticalScrollIndicator={false}>
          <Header
            text="Sports"
            backAction={() => this.props.navigation.goBack()}
          />
          <ScrollView>
          <View style={styles.inputWrapper}>
            <ModalSelectBoxWithImage
              inputLabel="Choose a Bet Site"
              selectTitle="Choose a Bet Site"
              items={this.state.bets}
              visible={this.state.showModalSelect}
              selected={this.state.selectedBet}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={(selectedBet) =>
                this.setState({ selectedBet, showModalSelect: false })
              }
              placeholder="Select a bet site"
            />
          </View>

          {this.state.selectedBet === "Bet9ja" && (
            <View style={styles.inputWrapper}>
              <SelectBox
                inputLabel="Type"
                value={this.state.betType}
                onValueChange={(betType) => this.setState({ betType })}
                placeholder={{}}
                items={this.state.betTypes}
                iconColor="#17375e"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(customerId) => this.setState({ customerId })}
              inputValue={this.state.customerId}
              inputLabel="User ID"
              placeholder="Please Enter your Id"
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
              text="Recharge"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.continue()}
            />
          </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
