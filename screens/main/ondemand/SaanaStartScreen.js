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
import ModalSelectBox from "../../../components/ModalSelectBox";
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

  titleWrapper: {
    flexDirection: "row",
    marginBottom: 40,
    alignItems: "center",
  },

  product: {},

  title: {
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: "15%",
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
      payTypes: [
        {
          value: "SAANA",
          label: "Saana Pay",
        },
        {
          value: "KANO_COLLECTION",
          label: "Kano State IRS",
        },
      ],

      reference: null,
      selectedPay: null,
      showModalSelect: false,
    };
  }
  continue = async () => {
    try {
      let { selectedPay, reference } = this.state;

      if (selectedPay && reference) {
        let body = {
          serviceCode: "ODV",
          transNo: reference,
          type: selectedPay,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Saana", errorMessage);
        }

        let { status, message } = response;

        // console.log(response)

        if (status == "200") {
          this.setState({ processing: false });

          let item =  this.props.route.params; 

          this.props.navigation.navigate("Saana.Validation", {
            reference: reference,
            type: selectedPay,
            validationResponse: response,
            amount: response.amount,
            name: response.customerName,
            product: response.product,
            logo: item.image
          });
        } else {
          this.setState({ processing: false });

          return Alert.alert("Saana", message.toString());
        }
      } else {
        this.setState({ processing: false });
        return Alert.alert("Saana", "Fill in the blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("Saana", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Saana Pay"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <ModalSelectBox
              inputLabel="Select a Pay Type"
              selectTitle="Select a Pay Type"
              items={this.state.payTypes}
              visible={this.state.showModalSelect}
              selected={this.state.selectedPay}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={(selectedPay) =>
                this.setState({ selectedPay, showModalSelect: false })
              }
              placeholder="Select a Pay Type"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(reference) => this.setState({ reference })}
              inputValue={this.state.reference}
              inputLabel="Transaction Reference"
              placeholder="Enter Transaction Reference"
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
