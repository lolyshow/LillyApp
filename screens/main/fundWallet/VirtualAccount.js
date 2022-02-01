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
  Alert,
} from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/FontAwesome5";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ClipBoardModal from "../../../components/ClipBoardModal";
import WhiteButton from "../../../components/WhiteButton";
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

  instruction: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },
  instructionWrapper: {
    marginBottom: 30,
  },
  box: {
    height: 77,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  account: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
});

export default class VirtualAccount extends Component {
  constructor() {
    super();

    this.state = {
      showClipBoard: false,
      processing: false,
      label: "",
      account: "",
      bank: "",
      processing: true,
    };
  }

  displayClipBoard = () => {
    Clipboard.setString(this.state.account);
    this.setState({ showClipBoard: true });
  };

  getAccount = async () => {
    try {
      let body = {
        serviceCode: "VAC",
        type: "virtualAccount",
        bank: this.props.route.params.name,
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({ message: message, account: response.account });
      } else {
        Alert.alert("Error", "Could not fetch account");
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  componentDidMount() {
    let { label, name } = this.props.route.params;

    this.setState({ label, bank: name });

    this.getAccount();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text={this.state.label}
          backAction={() => this.props.navigation.goBack()}
        />

        {this.state.processing ? (
          <>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#17375e" />
              <Text>Fetching account ...</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.instructionWrapper}>
              <Text style={styles.instruction}>{this.state.message}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.account}>{this.state.account}</Text>
            </View>
            <View style={{ alignSelf: "center", marginBottom: 10 }}>
              <WhiteButton
                onPress={() => this.displayClipBoard()}
                bordered
                text={
                  <Text style={{ flexDirection: "row" }}>
                    <Icon name="copy" size={20} color="#01cf13" solid></Icon>{" "}
                    Copy
                  </Text>
                }
              />
            </View>
          </>
        )}

        <ClipBoardModal
          closModal={() => this.setState({ showClipBoard: false })}
          itemCopied="Linked Account Copied"
          message="You have copied your linked account"
          visible={this.state.showClipBoard}
        />
      </View>
    );
  }
}
