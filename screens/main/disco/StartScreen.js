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
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ModalSelectBoxWithImage from "../../../components/ModalSelectBoxWithImage";

import ModalSelectLine from "../../../components/ModalSelectLine";
import ModalSelectBox from "../../../components/ModalSelectBox";
import Header from "../../../components/Header";
import axios from "axios";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import Network from "../../../Helpers/Network";

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
      discos: [

        {
          value: "AEDC",
          label: "AEDC",
          image: require("../../../assets/disco/aedc.png"),
          borderColor: "#030875",
        },
        {
          value: "EEDC",
          label: "EEDC",
          image: require("../../../assets/disco/eedc.png"),
          borderColor: "#ff2400",
        },
        {
          value: "EKEDC",
          label: "EKEDC",
          image: require("../../../assets/disco/ekedc.png"),
          borderColor: "#291670",
        },
        {
          value: "IBEDC",
          label: "IBEDC",
          image: require("../../../assets/disco/ibedc.png"),
          borderColor: "#f39502",
        },
        
        {
          value: "IKEDC",
          label: "IKEDC",
          image: require("../../../assets/disco/ikedc.jpg"),
          borderColor: "#ac2f3d",
        },

        {
          value: "JEDC",
          label: "JEDC",
          image: require("../../../assets/disco/jedc.jpg"),
          borderColor: "#fd6202",
        },
        {
          value: "KAEDC",
          label: "KAEDC",
          image: require("../../../assets/disco/kaedc.jpg"),
          borderColor: "#3b8a2b",
        },

        {
          value: "KEDC",
          label: "KEDC",
          image: require("../../../assets/disco/kedc.png"),
          borderColor: "#3e4095",
        },
        
        {
          value: "PHEDC",
          label: "PHEDC",
          image: require("../../../assets/disco/phedc.png"),
          borderColor: "#2b84c8",
        },

        
      ],
      meterTypes: [
        {
          label: "Prepaid",
          value: "PREPAID",
        },
        {
          label: "Postpaid",
          value: "POSTPAID",
        },
      ],
      selectedMeterType: "PREPAID",
      meterNo: null,
      amount: null,
      phone: null,
      selectedDisco: null,
      showModalSelect: false,
    };
  }

  continue = async () => {
    try {
      let {
        meterNo,
        selectedDisco,
        amount,
        phone,
        selectedMeterType,
        discos,
      } = this.state;

      if (meterNo && selectedMeterType && selectedDisco && phone && amount) {
        let url = Config.app_url;

        let body = {
          meterNo: meterNo,
          serviceCode: "AOV",
          disco: selectedDisco,
          type: selectedMeterType,
        };

        this.setState({ processing: true });

        let { response, error, errorMessage } = await new Network().post(
          url,
          body,
          {username:global.username,password:global.password}
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Electricity", errorMessage);
        }

        let { message, status } = response;

        if (status == "200") {
          this.setState({ processing: false });

          return this.props.navigation.navigate("Disco.Validation", {
            meterNo: meterNo,
            disco: selectedDisco,
            meterType: selectedMeterType,
            name: response.customerName,
            address: response.customerAddress,
            validationResponse: response,
            phone: phone,
            amount: amount,
            logo: selectedDisco,
          });
        } else {
          return Alert.alert("Electricity", message.toString());
        }
      } else {
        this.setState({ processing: false });

        return Alert.alert("Electricity", "Please enter details for blank fields");
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Electricity", error.toString());
    }
  };

  validateFields = () => {};

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.select({ ios: 150, android: 10 }),
          }}
          showsVerticalScrollIndicator={false}
        >
          <Header
            text="Electricity Payment"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <ModalSelectBoxWithImage
              inputLabel="Select Company"
              selectTitle="Select Company"
              items={this.state.discos}
              visible={this.state.showModalSelect}
              selected={this.state.selectedDisco}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={(selectedDisco) =>
                this.setState({ selectedDisco, showModalSelect: false })
              }
              placeholder="Select Company "
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


          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(meterNo) => this.setState({ meterNo })}
              inputValue={this.state.meterNo}
              inputLabel="Meter Number"
              placeholder="Enter Meter Number"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Phone"
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="Select Type"
              value={this.state.selectedMeterType}
              onValueChange={(selectedMeterType) =>
                this.setState({ selectedMeterType })
              }
              placeholder={{}}
              items={this.state.meterTypes}
              iconColor="#17375e"
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
