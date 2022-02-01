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
import InputBox from "../../../components/InputBox";
import GreenButton from "../../../components/GreenButton";

import WhiteButton from "../../../components/WhiteButton";

import BorderedBackButton from "../../../components/BorderedBackButton";

import Summary from "../../../components/Summary";
import TransactionPin from "../../../components/TransactionPin";

import Result from "../../../components/Result";
import ClipBoardModal from "../../../components/ClipBoardModal";
import Header from "../../../components/Header";
import Helper from "../../../Helpers/Helper";

import Clipboard from "@react-native-clipboard/clipboard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  titleWrapper: {
    flexDirection: "row",
    marginBottom: 20,
  },

  title: {
    // width: 185,
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
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
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
  },
  instruction: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
    marginTop: 10,
  },
  referenceCodeWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
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
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  bankLabel: {
    fontSize: 16,
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

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      bankList: [],
      amount: "",
      total: "",
      processing: false,
      showResult: true,
      showClipBoard: false,
      transactionStatus: "200",
      userMessage: "Your Reference Code",
      referenceCode: "",
      info: "",
    };
  }

  componentDidMount() {
    let {
      fee,
      total,
      amount,
      referenceCode,
      info,
      details,
      validationResponse,
    } = this.props.route.params;

    this.setState({
      amount,
      info,
      referenceCode,
      bankList: details,
    });
  }

  showResult = () => {
    this.setState({ showResult: true });
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    this.setState({ showResult: false, showClipBoard: true });
  };

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
      info,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text={"CGate Cardless POS"}
            backAction={() => this.props.navigation.goBack()}
          />

          <View>
            <Text style={styles.withdrawal}>
              {Helper.formattedAmountWithNaira(amount)}
            </Text>
          </View>

          <View style={styles.referenceCodeWrapper}>
            <Text style={styles.referenceCode}>Ref Code: {referenceCode}</Text>

            <Text style={styles.instruction}>{info}</Text>
          </View>

          <View style={styles.codeList}>
            {bankList.map((item, index) => (
              <View key={index}>
                <View style={styles.codeRow}>
                  <View style={[styles.bankWrapper, { flex: 0.4 }]}>
                    <Text style={styles.bankLabel}>Bank</Text>
                    <Text style={styles.bank}>{item.bank}</Text>
                  </View>

                  <View style={[styles.bankWrapper, { flex: 0.5 }]}>
                    <Text style={styles.bankLabel}>USSD String</Text>
                    <Text style={styles.bank}>{item.string}</Text>
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
                      onPress={() => this.displayClipBoard(item.string)}
                    >
                      <Icon name="copy" size={30} color="#01cf13"></Icon>
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                <View style={styles.line}></View>
              </View>
            ))}
          </View>

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
                    onPress={() => this.displayClipBoard(referenceCode)}
                  >
                    <Icon name="copy" size={40} color="#01cf13"></Icon>
                  </TouchableWithoutFeedback>

                  <View style={{ alignSelf: "center" }}>
                    <TouchableWithoutFeedback
                      onPress={() => this.displayClipBoard(referenceCode)}
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
            itemCopied="USSD Copied"
            message="You have copied the USSD"
            visible={showClipBoard}
          />
        </ScrollView>
      </View>
    );
  }
}
