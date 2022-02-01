import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import Icon1 from "react-native-vector-icons/Ionicons";

import WhiteButton from "../../../../components/WhiteButton";
import GreenButton from "../../../../components/GreenButton";
import ClipBoardModal from "../../../../components/ClipBoardModal";
import Header from "../../../../components/Header";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";
import Clipboard from "@react-native-clipboard/clipboard";
import Helper from "../../../../Helpers/Helper";
import PrintComponents from "../../../../components/PrintComponents";
import ProvidersLogo from "../../../../Helpers/ProvidersLogo";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  rectangle3116: {
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    padding: 20,
    paddingBottom: 60,
    // paddingTop: 20,
  },

  transactionValidation: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
  transactionValidationWrapper: {},
  summaryWrapper: {},
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#333333",
    paddingRight: 10,
  },

  summaryText_: {
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "right",
    color: "#333333",
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dce7f4",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "stretch",
  },

  transactionHistoryIconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#e3e3ff",
    justifyContent: "center",
    alignItems: "center",
  },

  productText: {
    fontSize: 15,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
});

export default class ViewMore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: {},
      loading: true,
      loaded: false,
      showClipBoard: false,
      logo: null,
    };
  }

  componentDidMount() {
    this.loadDetails();
    this.setPrintLogo();
  }

  setPrintLogo = () => {
    const { item } = this.props.route.params;
    const productName = item.name
      .toUpperCase()
      .replace("_POSTPAID", "")
      .replace("_PREPAID", "")
      .replace("_VTU", "")
      .replace("_BUNDLE", "");

    let baseUrl = "https://www.lillypayment.com//storage/";

    const logo = ProvidersLogo.find(
      (e) =>
        productName == e.value.toUpperCase() ||
        (e.category != "discos" && productName.includes(e.value.toUpperCase()))
    );

    let fullPath = Helper.getPropValue(logo, "image")
      ? baseUrl + logo.imagePath
      : null;

    this.setState({ logo: fullPath });
  };

  detailsList = () => {
    let list = [];

    Object.entries(this.state.details).forEach((item, key) => {
      if (item[1] != null) {
        let label = Helper.textRefine(item[0]);
        let value = this.possiblePriceField(item)
          ? Helper.formattedAmountWithNaira(item[1])
          : item[1];

        list.push({ label, value, key: item });
      }
    });

    return list;
  };

  loadDetails = async () => {
    try {
      const { item } = this.props.route.params;

      let formBody = {
        serviceCode: "MTD",
        description: item.description,
        reference: item.request_id,
      };

      let url =Config.base_url + "/app/info";

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody
      );

      this.setState({ loading: false });

      if (error) {
        return Alert.alert(" History View More", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({ details: response.data[0], loaded: true });
      }
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(" History View More", error.toString());
    }
  };

  transactionStatusColor = (status) => {
    let obj = {};

    switch (status.toLowerCase()) {
      case "successful":
        obj = { color: "#01cf13", fontWeight: "bold" };

        break;

      case "failed":
        obj = { color: "#f36952", fontWeight: "bold" };

        break;

      default:
        obj = { color: "#17375e", fontWeight: "bold" };

        break;
    }

    return obj;
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    this.setState({ showClipBoard: true });
  };

  possiblePriceField = (field) => {
    let expectedList = [
      "amount",
      "price",
      "total",
      "fee",
      "charge",
      "convenient fee",
      "discount",
      "commission",
      "vat",
      "tax",
    ];

    return !isNaN(field[1]) && expectedList.includes(field[0].toLowerCase())
      ? true
      : false;
  };

  showTransactionIdWithCopy = () => {
    let transID = this.detailsList().find(
      (item) => item.label == "TransactionID"
    );

    return (
      <>
        {transID && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={styles.summaryText}>Copy Transaction ID</Text>

            <TouchableWithoutFeedback
              onPress={() => this.displayClipBoard(transID.value)}
            >
              <Icon1 name="copy" size={30} color="#01cf13" solid></Icon1>
            </TouchableWithoutFeedback>
          </View>
        )}
      </>
    );
  };

  showProductIcon = () => {
    const { item } = this.props.route.params;

    return (
      item.icon && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <View
            style={[
              styles.transactionHistoryIconWrapper,
              item.icon.backgroundColor && {
                backgroundColor: item.icon.backgroundColor,
              },
            ]}
          >
            <Icon
              name={item.icon.iconName}
              color={item.icon.iconColor}
              size={20}
              solid
            />
          </View>

          <Text style={styles.productText}>
            {" "}
            {"  " + item.description.toUpperCase()}{" "}
          </Text>
        </View>
      )
    );
  };

  render() {
    const { params } = this.props.route;

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text={params.tab + " details"}
            backAction={() => this.props.navigation.goBack()}
          />

          {this.state.loading && (
            <ActivityIndicator size="large" color="#17375e" />
          )}

          {this.state.loaded && (
            <>
              <View style={styles.rectangle3116}>
                {this.showProductIcon()}
                <View style={styles.summaryWrapper}>
                  {this.detailsList().map((item, index) => (
                    <View style={styles.summaryRow} key={index}>
                      <Text style={styles.summaryText}>{item.label}</Text>
                      <TouchableOpacity
                        onPress={() => Clipboard.setString(item.value)}
                      >
                        <Text
                          style={[
                            styles.summaryText_,
                            item.label === "Transaction Status" &&
                              this.transactionStatusColor(item.value),
                          ]}
                        >
                          {item.value}
                          {"  "}

                          {/* <Icon1 name="copy-outline" size={10} solid></Icon1> */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <Text style={styles.line37}></Text>
                  {this.showTransactionIdWithCopy()}
                </View>
              </View>

              <View style={styles.submitButtonWrapper}>
                <PrintComponents
                  showHomeReturn={true}
                  showPrintReceipt={true}
                  showDownloadPdf={true}
                  showExternalPrintReceipt={true}
                  printObjectsArray={this.detailsList()}
                  image={this.state.logo}
                />
              </View>
            </>
          )}

          <ClipBoardModal
            closModal={() => this.setState({ showClipBoard: false })}
            itemCopied="Transaction ID Copied"
            message="You have copied the transaction"
            visible={this.state.showClipBoard}
          />
        </ScrollView>
      </View>
    );
  }
}
