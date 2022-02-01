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

import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/Ionicons";
import WhiteButton from "../../../components/WhiteButton";

import Result from "../../../components/Result";
import ClipBoardModal from "../../../components/ClipBoardModal";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
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
    marginBottom: 10,
  },

  title: {
    // width: 185,
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: 40,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  withdrawal: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  referenceCode: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },
  instruction: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },
  referenceCodeWrapper: {
    flexDirection: "column",
    alignItems: "center",
    // marginTop: 5,
  },

  codeList: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 25,
  },

  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bankWrapper: {
    flexDirection: "column",
  },
  bank: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  bankLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#acacac",
  },
  line: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default class BankAccounts extends Component {
  constructor() {
    super();

    this.state = {
      bankList: [],
      showResult: false,
      showClipBoard: false,
      transactionStatus: "200",
      userMessage: "Your Reference Code",
      referenceCode: 789,
      processing: true,
    };
  }

  confirmToken = () => {
    this.setState({ ShowTransactionPin: false, pin: null });
    this.showResult();
  };

  showResult = () => {
    this.setState({ showResult: true });
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    this.setState({ showResult: false, showClipBoard: true });
  };

  viewSteps = (item) => {
    this.props.navigation.navigate("FundWallet.BankCollection", item);
  };

  bankLists = () => {
    let list = [];

    this.state.bankList.forEach((item, index) => {
      list.push({ bank: item.name, account: item.account });
    });

    return list;
  };

  getBanks = async () => {
    try {
      let body = {
        serviceCode: "FBB",
        type: "Lilly Bank Account",
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      if (response) {
        this.setState({ bankList: response, processing: false });
      } else {
        this.setState({ processing: false });
        Alert.alert("Error", "Could not fetch account");
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  componentDidMount() {
    this.getBanks();
  }

  render() {
    const {
      processing,
      showResult,
      showClipBoard,
      transactionStatus,
      userMessage,
      referenceCode,
      amount,
      bankList,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Bank Transfer"
            backAction={() => this.props.navigation.goBack()}
          />

          {processing ? (
            <>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#17375e" />
                <Text>Fetching bank accounts ...</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.referenceCodeWrapper}>
                <Text style={styles.instruction}>
                  Copy bank details from the list below and fill details in{" "}
                  <Text style={{ color: "#17375e", fontWeight: "bold" }}>
                    “Payment Notification”
                  </Text>
                </Text>
              </View>

              <View style={styles.codeList}>
                {this.bankLists().map((item, index) => (
                  <View key={index}>
                    <View style={styles.codeRow}>
                      <View
                        style={[
                          styles.bankWrapper,
                          { justifyContent: "center", flex: 0.1 },
                        ]}
                      >
                        <TouchableOpacity onPress={() => this.viewSteps(item)}>
                          <Icon name="eye" size={20} color="#17375e" />
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.bankWrapper, { flex: 0.35 }]}>
                        <Text style={styles.bankLabel}>Bank</Text>
                        <Text style={styles.bank}>{item.bank}</Text>
                      </View>

                      <View style={[styles.bankWrapper, { flex: 0.4 }]}>
                        <Text style={styles.bankLabel}>Account Number</Text>
                        <Text style={styles.bank}>{item.account}</Text>
                      </View>

                      <View
                        style={[
                          styles.bankWrapper,
                          {
                            flex: 0.1,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          },
                        ]}
                      >
                        <TouchableWithoutFeedback
                          onPress={() => this.displayClipBoard(item.account)}
                        >
                          <Icon name="copy" size={30} color="#01cf13"></Icon>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>

                    <View style={styles.line}></View>
                  </View>
                ))}
              </View>
            </>
          )}

          <Result
            closModal={() => this.setState({ showResult: false })}
            status={transactionStatus}
            userMessage={userMessage}
            visible={showResult}
            children={
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#222222",
                    marginTop: 5,
                  }}
                >
                  {referenceCode}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 10,
                    marginTop: 15,
                  }}
                >
                  <View>
                    <WhiteButton
                      text="Continue"
                      bordered
                      onPress={() => this.setState({ showResult: false })}
                    />
                  </View>

                  <TouchableWithoutFeedback
                    onPress={() => this.displayClipBoard()}
                  >
                    <Icon name="copy" size={40} color="#01cf13"></Icon>
                  </TouchableWithoutFeedback>

                  <View style={{ alignSelf: "center" }}>
                    <TouchableWithoutFeedback
                      onPress={() => this.displayClipBoard()}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          fontStyle: "normal",
                          letterSpacing: 0,
                          // textAlign: "left",
                          color: "#707070",
                        }}
                      >
                        {" "}
                        Copy Code
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            }
          />

          <ClipBoardModal
            closModal={() => this.setState({ showClipBoard: false })}
            itemCopied="Lilly Bank Account Copied"
            message="You have copied the bank account"
            visible={showClipBoard}
          />
        </ScrollView>
      </View>
    );
  }
}
