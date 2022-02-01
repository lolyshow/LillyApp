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
  Button,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import MySelectPicker from "../../../../components/SelectLine";

import InputBox from "../../../../components/InputBox";

import SelectBox from "../../../../components/SelectBox";

import GreenButton from "../../../../components/GreenButton";

import BorderedBackButton from "../../../../components/BorderedBackButton";

import ModalSelectBoxWithImage from "../../../../components/ModalSelectBoxWithImage";

// import ModalSelectLine from "../../../../components/ModalSelectLine";

// import ModalSelectBox from "../../../../components/ModalSelectBox";

import DateTimePicker from "@react-native-community/datetimepicker";

import DatePicker from "../../../../components/DatePicker";

import GenderSelect from "../../../../components/GenderSelect";

import WhiteButton from "../../../../components/WhiteButton";
import Header from "../../../../components/Header";
import Helper from "../../../../Helpers/Helper";
import axios from "axios";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";

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

export default class BecomeAgent extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,

      state_of_origin: "",

      state_of_residence: "",

      lg_of_origin: "",

      lg_of_residence: "",

      address_of_origin: "",

      resident_address: "",

      bvn: "",

      nin: "",

      date: "DD/MM/YYYY",

      states: [],

      lgas_origin: [],

      lgas_residence: [],

      showModalSelect: false,

      showDate: false,
    };
  }

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;

    this.setState({ showDate: Platform.OS === "ios", date: currentDate });
  };

  stateList = () => {
    let list = [];

    this.state.states.forEach((item, index) => {
      list.push({ label: item.name, value: item.name, key: item.capital });
    });

    return list;
  };

  lgaOriginList = () => {
    let list = [];

    let state = this.state.state;

    this.state.lgas_origin.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  lgaResidenceList = () => {
    let list = [];

    let state = this.state.state;

    this.state.lgas_residence.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  getStates = async () => {
    const response = await Helper.getStates().then((response) => response);

    if (response.error) {
      Alert.alert("Become An Agent", response.message.toString());

      return;
    }

    this.setState({ states: response.states });
  };

  getLga = async (state, type) => {
    const response = await Helper.getLga(state).then((response) => response);

    if (response.error) {
      Alert.alert("Become An Agent", response.message.toString());
      return;
    }

    if (type == "origin") {
      this.setState({ lgas_origin: response.lga });
    } else {
      this.setState({ lgas_residence: response.lga });
    }
  };

  onChangeStateOfOrigin = (state_of_origin) => {
    this.setState({ state_of_origin, lg_of_origin: "" });

    if (state_of_origin) {
      this.getLga(state_of_origin, "origin");
    }
  };

  onChangeStateOfResidence = (state_of_residence) => {
    this.setState({ state_of_residence, lg_of_residence: "" });

    if (state_of_residence) {
      this.getLga(state_of_residence, "residence");
    }
  };

  componentDidMount() {
    this.getStates();
  }

  submitForm = async () => {
    try {
      let {
        state_of_origin,
        lg_of_origin,
        address_of_origin,
        state_of_residence,
        lg_of_residence,
        resident_address,
        bvn,
        date,
        nin,
      } = this.state;

      if (
        state_of_origin &&
        lg_of_origin &&
        address_of_origin &&
        state_of_residence &&
        lg_of_residence &&
        resident_address &&
        bvn &&
        nin &&
        date &&
        date != "DD/MM/YYYY"
      ) {
        let url = Config.base_url + "/become/agent";

        let body = {
          state_of_origin,
          lg_of_origin,
          address_of_origin,
          state_of_residence,
          lg_of_residence,
          resident_address,
          bvn,
          nin,
          dob: date,
          id: global.user.id,
        };

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Become An Agent", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          Alert.alert("Become An Agent", message.toString());
        } else {
          Alert.alert("Become An Agent", message.toString());
        }
      } else {
        Alert.alert("Become An Agent", "Pleas fill the empty fields");
      }
    } catch (error) {
      this.setState({ processing: false });

      Alert.alert("Become An Agent", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Become An  Agent"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="State of Origin"
              value={this.state.state_of_origin}
              onValueChange={this.onChangeStateOfOrigin}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="L.G.A of Origin"
              value={this.state.lg_of_origin}
              onValueChange={(lg_of_origin) => this.setState({ lg_of_origin })}
              placeholder={{ label: "Select L.G.A", value: null }}
              items={this.lgaOriginList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(address_of_origin) =>
                this.setState({ address_of_origin })
              }
              inputValue={this.state.address_of_origin}
              inputLabel="Address of Origin"
              placeholder="Enter Address"
              multiline={true}
            />
          </View>
          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="State of Residence"
              value={this.state.state_of_residence}
              onValueChange={this.onChangeStateOfResidence}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="L.G.A of Residence"
              value={this.state.lg_of_residence}
              onValueChange={(lg_of_residence) =>
                this.setState({ lg_of_residence })
              }
              placeholder={{ label: "Select L.G.A", value: null }}
              items={this.lgaResidenceList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(resident_address) =>
                this.setState({ resident_address })
              }
              inputValue={this.state.resident_address}
              inputLabel="Address of Residence"
              placeholder="Enter Address"
              multiline={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(bvn) => this.setState({ bvn })}
              inputValue={this.state.bvn}
              inputLabel="BVN"
              placeholder="Enter BVN"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              onChangeText={(nin) => this.setState({ nin })}
              inputValue={this.state.nin}
              inputLabel="NIN"
              placeholder="Enter NIN"
            />
          </View>

          <View style={styles.inputWrapper}>
            <DatePicker
              value={this.state.date}
              onDateChange={this.onChangeDate}
              label="Date of Birth"
              showDate={this.state.showDate}
              showDatePicker={() => this.setState({ showDate: true })}
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Submit"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.submitForm()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
