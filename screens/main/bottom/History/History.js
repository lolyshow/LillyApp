import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SectionList,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import ProcessingComponent from "./ProcessingComponent";
import TransactionComponent from "./TransactionComponent";
import WalletComponent from "./WalletComponent";
import SearchInput, { createFilter } from "react-native-search-filter";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import DatePicker from "../../../../components/DatePicker";
import WhiteButton from "../../../../components/WhiteButton";
import DateRange from "./DateRange";
import { timing } from "react-native-reanimated";
import ConfirmationComponent from "../../../../components/ConfirmationComponent";
import Config from "../../../../Helpers/Config";
import axios from "axios";
import Network from "../../../../Helpers/Network";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const productIcon = (desc) => {
  if (desc == "Purchase of electricity") {
    return {
      iconName: "plug",
      iconColor: "#1f6dff",
      backgroundColor: "#dbe7fd",
    };
  }

  if (
    desc == "Purchase of AIRTIME" ||
    desc == "Purchase of NTEL VTU" ||
    desc == "Purchase of DATA" ||
    desc == "Purchase of NTEL BUNDLE" ||
    desc == "Purchase of Smile Bundle" ||
    desc == "Purchase of Spectranet Pin"
  ) {
    return {
      iconName: "mobile-alt",
      iconColor: "#ff684e",
      backgroundColor: "#fcddd8",
    };
  }

  if (
    desc == "SAANA PAY-IMS Payment" ||
    desc == "Kano State IRS" ||
    desc == "Toll Payment" ||
    desc == "LAW UNION AND ROCK INSURANCE"
  ) {
    return {
      iconName: "boxes",
      iconColor: "#19a886",
      backgroundColor: "#d0fff4",
    };
  }

  if (desc == "Purchase of Pay TV") {
    return { iconName: "tv", iconColor: "#3535c6", backgroundColor: "#e3e3ff" };
  }

  if (
    desc == "Fund transferred from wallet to bank" ||
    desc == "Fund transferred from wallet to bank"
  ) {
    return {
      iconName: "exchange-alt",
      iconColor: "#3535c6",
      backgroundColor: "#e3e3fe",
    };
  }

  if (desc == "POS Purchase") {
    return {
      iconName: "calculator",
      iconColor: "#18d1a6",
      backgroundColor: "#d0fff4",
    };
  }
  if (desc == "Bet Collection") {
    return {
      iconName: "futbol",
      iconColor: "#3535c6",
      backgroundColor: "#e3e3fe",
    };
  }

  if (desc == "WellaHealth Subscription") {
    return {
      iconName: "heartbeat",
      iconColor: "#cb1515",
      backgroundColor: "#ffdddd",
    };
  }

  if (desc == "Purchase of WAEC Pin" || desc == "Purchase of JAMB Pin") {
    return {
      iconName: "graduation-cap",
      iconColor: "#17375e",
      backgroundColor: "#e3e3fe",
    };
  } else {
    return {
      iconName: "exchange-alt",
      iconColor: "#3535c6",
      backgroundColor: "#e3e3fe",
    };
  }
};

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionHistory: [],

      walletHistory: [],
      currentItem: null,
      tabs: ["Transaction", "Wallet"],
      selectedTab: "Transaction",
      search: null,
      processing: true,
      dateFrom: new Date(),
      dateTo: new Date(),
      showDateRangeModal: false,
      showDateFrom: false,
      showDateTo: false,
      showViewMoreConfirmation: false,
    };
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  transactionHistoryList = () => {
    let list = [];
    let itemList = [];
    let itemObject = {};

    let transaction = this.state.transactionHistory;

    const search = this.state.search;

    const KEYS_TO_FILTERS = [
      "name",
      "description",
      "amount",
      "created_at",
      "request_id",
      "destination"
    ];

    if (search) {
      transaction = transaction.filter(createFilter(search, KEYS_TO_FILTERS));
    }

      transaction.forEach((item, index) => {
      itemObject = item;
      itemObject.icon = productIcon(item.description);
      itemList.push(itemObject);
    });

    list.push({
      title: "History",
      data: itemList,
    });

    return list;
  };

  walletHistoryList = () => {
    let list = [];

    let walletHistory = this.state.walletHistory;

    const search = this.state.search;

    const KEYS_TO_FILTERS = [
      "description",
      "amount",
      "created_at",
      "type",
      "reference",
    ];

    if (search) {
      walletHistory = walletHistory.filter(
        createFilter(search, KEYS_TO_FILTERS)
      );
    }

    list.push({
      title: "History",
      data: walletHistory,
    });

    return list;
  };

  loadTransactions = async (dateRange = null) => {
    try {
      let formBody;

      if (dateRange) {
        formBody = {
          serviceCode: "VTF",
          from: dateRange[0],
          to: dateRange[1],
        };
      } else {
        formBody = {
          serviceCode: "VTH",
        };
      }

      let url = Config.base_url + "/app/info";

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody,
        {username:global.username,password:global.password}
      );

      if (error) {
        return Alert.alert("History", errorMessage);
      }

      let { status, message } = response;
      console.log("myHistoryResponse",response);

      if (status == "200") {
        this.setState({ transactionHistory: response.transaction });
      }
    } catch (error) {
      Alert.alert("History", error.toString());
    }
  };

  loadWalletHistory = async (dateRange = null) => {
    try {
      let formBody;

      if (dateRange) {
        formBody = {
          serviceCode: "VWF",
          from: dateRange[0],
          to: dateRange[1],
        };
      } else {
        formBody = {
          serviceCode: "VWH",
        };
      }

      let url = Config.base_url + "/app/info";

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody
      );

      if (error) {
        return Alert.alert("History", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({ walletHistory: response.walletHistory });
      }
    } catch (error) {
      Alert.alert("History", error.toString());
    }
  };

  getHistory = async (type = null, dateRange = null) => {
    try {
      this.setState({ processing: true });

      if (type == "Transaction") {
        await this.loadTransactions(dateRange);
      } else if (type == "Wallet") {
        await this.loadWalletHistory(dateRange);
      } else {
        await Promise.all([this.loadTransactions(), this.loadWalletHistory()]);
      }

      this.setState({ processing: false });
    } catch (error) {
      this.setState({ processing: false });
    }
  };

  onChangeDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.dateFrom;

    this.setState({
      showDateFrom: Platform.OS === "ios",
      dateFrom: currentDate,
    });
  };

  onChangeDateTo = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.dateTo;

    this.setState({ showDateTo: Platform.OS === "ios", dateTo: currentDate });
  };

  componentDidMount() {
    this.getHistory();
  }

  ViewMore = (item) => {
    this.setState({ showViewMoreConfirmation: true, currentItem: item });
  };

  GotoViewMore = (response) => {
    const tab = this.state.selectedTab;
    const item = this.state.currentItem;

    this.setState({ showViewMoreConfirmation: false });

    if (response == true) {
      this.props.navigation.navigate("History.ViewMore", { tab, item });
    }
  };

  onSearchDate = () => {
    let { dateFrom, dateTo, selectedTab } = this.state;

    this.setState({ showDateRangeModal: false });

    if (dateFrom && dateTo) {
      let dateRange = [dateFrom, dateTo];

      this.getHistory(selectedTab, dateRange);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Text style={styles.settingsText}>
            {this.state.selectedTab} History
          </Text>
        </View>

        <View style={styles.lowerContainer}>
          <View style={styles.historySwitch}>
            {this.state.tabs.map((item, index) => (
              <TouchableOpacity
                key={item + index}
                onPress={() => this.setState({ selectedTab: item })}
              >
                <View
                  style={
                    this.state.selectedTab === item
                      ? styles.historyWrapperActive
                      : styles.historyWrapper
                  }
                >
                  <Text
                    style={
                      this.state.selectedTab === item
                        ? styles.historyActive
                        : styles.history
                    }
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterWrapper}>
            <View>
              <View style={styles.searchSection}>
                <Icon
                  style={styles.searchIcon}
                  name="search"
                  size={20}
                  color="#c7c7c7"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search Transaction"
                  onChangeText={(search) => {
                    this.setState({ search });
                  }}
                  value={this.state.search}
                />
              </View>
            </View>

            <View style={styles.iconActionWrapper}>
              <View>
                <DateRange
                  closModal={() => this.setState({ showDateRangeModal: false })}
                  visible={this.state.showDateRangeModal}
                  dateFrom={this.state.dateFrom}
                  dateTo={this.state.dateTo}
                  changeDateFrom={this.onChangeDateFrom}
                  changeDateTo={this.onChangeDateTo}
                  showDateTo={this.state.showDateTo}
                  setShowDateTo={() => this.setState({ showDateTo: true })}
                  showDateFrom={this.state.showDateFrom}
                  setShowDateFrom={() => this.setState({ showDateFrom: true })}
                  onSearch={() => this.onSearchDate()}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ showDateRangeModal: true })}
              >
                <Icon name="calendar-alt" size={22} color="#17375e" />
              </TouchableOpacity>
            </View>

            <View style={styles.iconActionWrapper}>
              <TouchableOpacity
                onPress={() => this.getHistory(this.state.selectedTab)}
              >
                <Icon name="sync" color="#17375e" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.selectedTab === "Transaction" ? (
            <TransactionComponent
              sectionData={this.transactionHistoryList()}
              onPress={this.ViewMore}
              loading={this.state.processing}
              refresh={() => this.getHistory("Transaction")}
            />
          ) : (
            <WalletComponent
              sectionData={this.walletHistoryList()}
              onPress={this.ViewMore}
              loading={this.state.processing}
              refresh={() => this.getHistory("Wallet")}
            />
          )}
        </View>

        <ConfirmationComponent
          visible={this.state.showViewMoreConfirmation}
          closModal={() => this.setState({ showViewMoreConfirmation: false })}
          iconColor="#01cf13"
          //  iconName=""
          message="You are about to view details about this transaction. Do you want to proceed?"
          response={this.GotoViewMore}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  upperContainer: {
    backgroundColor: "#17375e",
    flex: 0.1,
    padding: 20,
    justifyContent: "flex-end",
  },

  lowerContainer: {
    flex: 0.9,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  settingsText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  inputWrapper: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  buttonWrapper: {
    paddingHorizontal: 25,
    marginTop: 45,
  },

  ListHeaderComponentStyle: {
    marginTop: 20,
    marginBottom: 30,
  },

  historySwitch: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  history: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
  },
  historyActive: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },
  historyWrapper: {
    height: 36,
    // width: 145,
    width: screenWidth * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },

  historyWrapperActive: {
    height: 36,
    // width: 145,
    width: screenWidth * 0.4,
    borderRadius: 10,
    backgroundColor: "#17375e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  filterWrapper: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderColor: "#f7f7f7",
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
  },

  input: {
    color: "#17375e",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    height: 45,
    width: screenWidth * 0.45,
    // width: 145,
  },

  iconActionWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
