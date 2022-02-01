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
import { set } from "react-native-reanimated";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import axios from "axios";
import Network from "../../../Helpers/Network";

import { connect } from "react-redux";

import { getBalance } from "../../../redux/actions";

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
  },

  product: {},

  title: {
    width: 185,
    // height: 28,
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    // lineHeight: 32,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 20,
  },

  balanceBox: {
    height: 62,
    borderRadius: 10,
    backgroundColor: "#fcfcfc",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    padding: 10,
    justifyContent: "center",
  },

  balanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    paddingBottom: 5,
  },

  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  submitButtonWrapper: {
    marginTop: 20,
  },
});

class TransferList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      banks: [],
      transferTypes: [],
      amount: null,
      selectedType: null,
      showModalSelect: false,
      showBankSelect: false,
      walletId: "",
      bank: null,
      bank_account: null,
      narration: null,
    };
  }

  handleSelectChange = (selectedType) => {
    this.setState({ selectedType, showModalSelect: false, amount: null });
  };

  balance = () => (
    <>
      {this.state.selectedType != null && (
        <View style={styles.inputWrapper}>
          <Text style={styles.balanceLabel}>
            {
              this.state.transferTypes.find(
                (item) => item.value == this.state.selectedType
              ).balanceLabel
            }
          </Text>
          <View style={styles.balanceBox}>
            <Text style={styles.balanceText}>
              {Helper.formattedAmountWithNaira(this.balanceToShow())}
            </Text>
          </View>
        </View>
      )}
    </>
  );

  //
  w2w = () => (
    <>
      {this.state.selectedType == "WALLET_TO_WALLET" && (
        <View style={styles.inputWrapper}>
          <InputBox
            keyboardType="numeric"
            inputValue={this.state.walletId}
            onChangeText={(walletId) => this.setState({ walletId })}
            inputLabel="Wallet ID"
            placeholder="Enter Wallet ID"
          />
        </View>
      )}
    </>
  );

  w2b = () => (
    <>
      {this.state.selectedType == "WALLET_TO_BANK" && (
        <View>
          <View style={styles.inputWrapper}>
            <ModalSelectBox
              inputLabel="Banks"
              selectTitle="Select Bank"
              items={this.bankList()}
              visible={this.state.showBankSelect}
              selected={this.state.bank}
              closModal={() => this.setState({ showBankSelect: false })}
              showModal={() => this.setState({ showBankSelect: true })}
              onSelect={(bank) =>
                this.setState({ bank, showBankSelect: false })
              }
              placeholder="Select Bank"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="numeric"
              inputValue={this.state.bank_account}
              onChangeText={(bank_account) => this.setState({ bank_account })}
              inputLabel="Bank Account Number"
              placeholder="Enter Bank Account Number"
            />
          </View>
          <View style={styles.inputWrapper}>
            <InputBox
              inputValue={this.state.narration}
              onChangeText={(narration) => this.setState({ narration })}
              inputLabel="Narration (Optional)"
              placeholder="Enter Narration"
            />
          </View>
        </View>
      )}
    </>
  );

  handleSubmit = () => {
    const type = this.state.selectedType;

    switch (type) {
      case null:
        Alert.alert("Transfer", "Please fill up the empty field(s)");
        break;

      case "WALLET_TO_WALLET":
        this.handleWalletToWallet();
        break;

      case "WALLET_TO_BANK":
        this.handleWalletToBank();
        break;

      default:
        this.handleInterWallet();
        break;
    }
  };

  handleInterWallet = () => {
    try {
      let { amount, selectedType } = this.state;

      if (amount && selectedType) {
        let serviceCode =
          selectedType == "COMMISSION_TO_WALLET"
            ? "CTW"
            : selectedType == "BONUS_TO_WALLET"
            ? "BTW"
            : "PTW";

        this.props.navigation.navigate("Transfers.Validation", {
          requestBody: {
            serviceCode: serviceCode,
            amount: amount,
            id: global.user.id,
          },
          validationList: [
            { label: "Transfer Type", value: Helper.textRefine(selectedType) },
            { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
          ],
          summaryList: [
            { label: "Amount", value: Helper.formattedAmountWithNaira(amount) },
          ],
          amount: amount,
          total: amount,
          validationResponse: {},
        });
      } else {
        return Alert.alert("Transfer", "Fill in th blank fields");
      }
    } catch (error) {
      Alert.alert("Transfer", error.toString());
    }
  };

  handleWalletToWallet = async () => {
    try {
      let { amount, selectedType, walletId } = this.state;

      if (amount && selectedType && walletId) {
        let body = {
          serviceCode: "WWL",
          wallet_id: walletId,
          amount: amount,
          id: global.user.id,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Transfer", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          this.props.navigation.navigate("Transfers.Validation", {
            requestBody: {
              serviceCode: "WWT",
              wallet_id: walletId,
              amount: amount,
              total: response.total,
              id: global.user.id,
            },
            validationList: [
              {
                label: "Transfer Type",
                value: Helper.textRefine(selectedType),
              },
              { label: "Transfer to", value: response.name },
              {
                label: "Amount",
                value: Helper.formattedAmountWithNaira(amount),
              },
              {
                label: "Convenience Fee",
                value: Helper.formattedAmountWithNaira(
                  response.charges.toString()
                ),
              },
            ],
            summaryList: [
              {
                label: "Amount",
                value: Helper.formattedAmountWithNaira(amount),
              },
              {
                label: "Convenience Fee",
                value: Helper.formattedAmountWithNaira(
                  response.charges.toString()
                ),
              },
            ],
            amount: amount,
            total: response.total.toString(),
            validationResponse: response,
          });
        } else {
          return Alert.alert("Transfer", message.toString());
        }
      } else {
        this.setState({ processing: false });

        return Alert.alert("Transfer", "Fill in th blank fields");
      }
    } catch (error) {
      Alert.alert("Transfer", error.toString());
    }
  };

  handleWalletToBank = async () => {
    try {
      let { amount, selectedType, bank, bank_account, narration } = this.state;

      if (amount && selectedType && bank && bank_account) {
        let body = {
          serviceCode: "WBV",
          narration: narration,
          bin: bank.bin,
          bank_name: bank.name,
          bank_account: bank_account,
          amount: amount,
          id: global.user.id,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Transfer", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          this.props.navigation.navigate("Transfers.Validation", {
            requestBody: {
              serviceCode: "WBP",
              reference: response.reference,
              narration: narration,
              id: global.user.id,
            },
            validationList: [
              {
                label: "Transfer Type",
                value: Helper.textRefine(selectedType),
              },
              { label: "Bank", value: bank.name },
              { label: "Bank Account No", value: bank_account },
              { label: "Bank Account Name", value: response.customerName },
              { label: "Narration", value: narration ?? null },
              {
                label: "Amount",
                value: Helper.formattedAmountWithNaira(amount),
              },
              {
                label: "Convenience Fee",
                value: Helper.formattedAmountWithNaira(
                  response.charge.toString()
                ),
              },
            ],

            summaryList: [
              {
                label: "Amount",
                value: Helper.formattedAmountWithNaira(amount),
              },
              {
                label: "Convenience Fee",
                value: Helper.formattedAmountWithNaira(
                  response.charge.toString()
                ),
              },
            ],
            amount: amount,
            total: response.total.toString(),
            validationResponse: response,
          });
        } else {
          return Alert.alert("Transfer", message.toString());
        }
      } else {
        this.setState({ processing: false });
        return Alert.alert("Transfer", "Fill in th blank fields");
      }
    } catch (error) {
      Alert.alert("Transfer", error.toString());
    }
  };

  getBalance = async () => {
    try {
      await this.props.getBalance();
    } catch (error) {
      return Alert.alert("Transfer", error.toString());
    }
  };

  bankList = () => {
    let list = [];

    this.state.banks.forEach((item, index) => {
      list.push({ label: item.name, value: item, key: item.name });
    });

    return list;
  };

  getBanks = async () => {
    try {
      let body = {
        serviceCode: "WBL",
      };

      let url = Config.app_url;

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      if (error) {
        return Alert.alert("Banks", errorMessage);
      }

      if (response) {
        this.setState({ banks: response });
      } else
        return Alert.alert(
          "Transfer",
          "An error occurred while fetching banks"
        );
    } catch (error) {
      return Alert.alert("Transfer", error.toString());
    }
  };

  balanceToShow = () => {
    let { selectedType } = this.state;

    let {
      balance,
      pos_balance,
      commission_balance,
      bonus_balance,
    } = this.props.reducers.balance;

    switch (selectedType) {
      case "WALLET_TO_WALLET":
      case "WALLET_TO_BANK":
        return balance;

      case "COMMISSION_TO_WALLET":
        return commission_balance;

      case "BONUS_TO_WALLET":
        return bonus_balance;

      case "POS_TO_WALLET":
        return pos_balance;

      default:
        return "N/A";
    }
  };

  componentDidMount() {
    this.setTransferList();
    this.getBanks();
    this.getBalance();
  }

  setTransferList = () => {
    const { pos_wallet_status, level } = Helper.getPropValue(global, "user");

    transferTypes = [
      {
        value: "WALLET_TO_WALLET",
        label: "Wallet to Wallet",
        balanceLabel: "Balance",
      },
      {
        value: "WALLET_TO_BANK",
        label: "Wallet to Bank",
        balanceLabel: "Balance",
      },

      {
        value: "BONUS_TO_WALLET",
        label: "Bonus to Wallet",
        balanceLabel: "Bonus Balance",
      },
    ];

    pos_wallet_status == "1" &&
      transferTypes.push({
        value: "POS_TO_WALLET",
        label: "POS to Wallet",
        balanceLabel: "POS Balance",
      });

    level == "agent" &&
      transferTypes.push({
        value: "COMMISSION_TO_WALLET",
        label: "Commission to Wallet",
        balanceLabel: "Commission Balance",
      });

    this.setState({ transferTypes });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Transfer"
            backAction={() => this.props.navigation.goBack()}
          />

          <View style={styles.inputWrapper}>
            <ModalSelectBox
              inputLabel="Transfer Type"
              selectTitle="Select a Transfer Type"
              items={this.state.transferTypes}
              visible={this.state.showModalSelect}
              selected={this.state.selectedType}
              closModal={() => this.setState({ showModalSelect: false })}
              showModal={() => this.setState({ showModalSelect: true })}
              onSelect={this.handleSelectChange}
              placeholder="Select a Transfer Type"
            />
          </View>

          {this.balance()}

          {this.w2w()}

          {this.w2b()}

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
              disabled={this.state.selectedType == null}
              processing={this.state.processing}
              onPress={() => this.handleSubmit()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { reducers: state.reducers };
};

const mapDispatchToProps = {
  getBalance,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferList);
