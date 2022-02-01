import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ModalSelectBoxWithImage from "../../../components/ModalSelectBoxWithImage";

import VisaLogo from "../../../assets/visa.png";
import MasterLogo from "../../../assets/master.png";
import AddCardImage from "../../../assets/add.png";

import { TouchableOpacity } from "react-native-gesture-handler";
import Helper from "../../../Helpers/Helper";
import Storage from "../../../Helpers/Storage";

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
    marginBottom: 40,

    alignItems: "center",

    justifyContent: "space-between",
  },

  title: {
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    // lineHeight: 32,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    // marginLeft: 40,
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
      cards: [
        {
          value: "Add New Card",
          label: "Add New Card",
          image: AddCardImage,
          borderColor: "#17375e",
          cardInfo: {
            cvc: null,
            cardNo: null,
            expiry: null,
          },
        },
      ],
      amount: null,
      selectedCard: null,
      showModalSelect: false,
    };
  }

  getSavedCard = async () => {
    let list = this.state.cards;

    let logo;

    let borderColor;

    let { error, errorMessage, data } = await Storage.getObjectData(
      "creditCards"
    );

    if (!error) {
      if (data != null) {
        data.forEach((item, index) => {
          if (item.cardType == "master") {
            borderColor = "#ffbc4f";
            logo = MasterLogo;
          } else {
            borderColor = "#293688";
            logo = VisaLogo;
          }

          list.unshift({
            value: "#" + index,
            label: Helper.maskCreditCard(item.cardNo),
            image: logo,
            borderColor,
            cardInfo: {
              cvc: item.cvc,
              cardNo: item.cardNo,
              expiry: item.expiry,
            },
          });
        });

        this.setState({ cards: list });
      }
    } else {
      Alert.alert("Error", errorMessage);
    }
  };

  onChangeCard = (selectedCard) => {
    if (selectedCard === "Add New Card") {
      this.setState({ showModalSelect: false });

      return this.newCard();
    } else {
      this.setState({ selectedCard, showModalSelect: false });
    }
  };

  newCard = () => {
    this.props.navigation.navigate("FundWallet.CardInitiate", {
      provider: this.props.route.params,
      amount: this.state.amount,
      newCard: true,
      cardInfo: {
        cvc: null,
        cardNo: null,
        expiry: null,
      },
    });
  };

  continue = () => {
    let { amount, selectedCard } = this.state;

    if (selectedCard && amount) {
      const cardInfo = this.state.cards.find(
        (item) => item.value === this.state.selectedCard
      ).cardInfo;

      this.props.navigation.navigate("FundWallet.CardInitiate", {
        provider: this.props.route.params,
        amount: this.state.amount,
        newCard: false,
        cardInfo: cardInfo,
      });
    } else {
      Alert.alert("Card", "Please, fill in empty fields");
    }
  };

  componentDidMount() {
    this.getSavedCard();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleWrapper}>
            <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
            />

            <Text style={styles.title}>Card</Text>

            <TouchableOpacity onPress={() => this.newCard()}>
              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: "500",
                    fontStyle: "normal",
                    // lineHeight: 32,
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#17375e",
                  },
                ]}
              >
                {" "}
                <Icon
                  name="add-circle"
                  color={styles.title.color}
                  size={20}
                />{" "}
                Add New Card{" "}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <ModalSelectBoxWithImage
              inputLabel=""
              selectTitle="Choose Card"
              items={this.state.cards}
              visible={this.state.showModalSelect}
              selected={this.state.selectedCard}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={this.onChangeCard}
              placeholder="Chose Card"
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
