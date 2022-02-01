import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Network from "../../../../../Helpers/Network";
import Header from "../../../../../components/Header";
import Helper from "../../../../../Helpers/Helper";
import Config from "../../../../../Helpers/Config";
import Icon from "react-native-vector-icons/FontAwesome5";
import GreenButton from "../../../../../components/GreenButton";
import InputBox from "../../../../../components/InputBox";
import SelectBox from "../../../../../components/SelectBox";
import { Card } from "react-native-paper";
import ClipBoardModal from "../../../../../components/ClipBoardModal";

import Clipboard from "@react-native-clipboard/clipboard";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputWrapper: {
    flexDirection: "column",
    marginTop: 20,
  },
  box: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#f7f7f7",
    padding: 20,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    color: "#333333",
    textAlign: "left",
    // paddingRight: 10,
  },
});
export default class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      processing: false,
      productIds: [],
      subscriptions: [],
      selectedSubscription: {},
      showClipBoardModal: false,
    };
  }

  subscriptionList = () => {
    let subscriptions = this.state.subscriptions;
    let lists = [];

    subscriptions.forEach((item, index) => {
      lists.push({
        label: `${item.name}: ${item.label} - ${Helper.formattedAmountWithNaira(
          item.amount
        )} `,
        value: item,
        key: index,
      });
    });

    return lists;
  };

  getSubscriptions = async () => {
    try {
      let url = "https://www.lillypayment.com/api/e-commerce";

      let body = {
        action: "getSubscription",
      };

      this.setState({ processing: true });

      let { response, error, errorMessage } = await new Network().post(
        url,
        body
      );

      console.log(response);
      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Product Subscription", errorMessage);
      }

      let { message, status } = response;

      if (status == "200") {
        let subscriptions = response.subscriptions;

        this.setState({ subscriptions });
      } else {
        return Alert.alert("Product Subscription", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Product Subscription", error.toString());
    }
  };

  changeSubscriptions = (subscription) => {
    if (subscription) {
      this.setState({
        selectedSubscription: subscription,
        productIds: Array(subscription.quantity).fill(""),
      });
    } else {
      this.setState({ selectedSubscription: {}, productIds: [] });
    }
  };

  onChangeProductCode = (code, index) => {
    this.setState(
      (prevState) => {
        prevState.productIds[index] = code;
        return {
          productIds: prevState.productIds,
        };
      },
      () => console.log(this.state.productIds)
    );
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    this.setState({ showClipBoardModal: true });
  };
  subscriptionAction = async () => {
    try {
      const { selectedSubscription, productIds } = this.state;

      if (productIds.length == 0) {
        return Alert.alert(
          "Product Subscription",
          "Please select a subscription"
        );
      }
      if (!Helper.propertiesAllSet(productIds)) {
        return Alert.alert(
          "Product Subscription",
          "Please fill up the product code(s)"
        );
      }

      let url = "https://www.lillypayment.com/api/e-commerce";

      let body = {
        action: "subscribeForProduct",
        subscription: selectedSubscription.id,
        product_ids: productIds,
        userId: global.user.id,
      };

      this.setState({ processing: true });

      let { response, error, errorMessage } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Product Subscription", errorMessage);
      }

      let { message, status } = response;

      if (status == "200") {
        this.setState({ selectedSubscription: {}, productIds: [] });

        return Alert.alert("Product Subscription", message.toString());
      } else {
        return Alert.alert("Product Subscription", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Product Subscription", error.toString());
    }
  };

  componentDidMount() {
    this.getProducts();
    this.getSubscriptions();
  }

  getProducts = async () => {
    try {
      let url = "https://www.lillypayment.com/api/e-commerce";

      let body = {
        action: "getMyProduct",
        userId: global.user.id,
      };

      this.setState({ processing: true });

      let { response, error, errorMessage } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Product Subscription", errorMessage);
      }

      let { message, status } = response;

      if (status == "200") {
        this.setState({ products: response.products.data });
      } else {
        return Alert.alert("Product Subscription", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Product Subscription", error.toString());
    }
  };

  updateProduct = async (action, productId) => {
    try {
      let url = "https://www.lillypayment.com/api/e-commerce";

      let body = {
        action: "uploadedProductAction",
        typeAction: action,
        productId: productId,
        userId: global.user.id,
      };

      this.setState({ processing: true });

      let { response, error, errorMessage } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Product Action", errorMessage);
      }

      let { message, status } = response;

      if (status == "200") {
        this.getProducts();
        return Alert.alert("Product Action", message.toString());
      } else {
        return Alert.alert("Product Action", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Product Action", error.toString());
    }
  };

  subscriptionTab = () => (
    <View style={styles.box}>
      {/* <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "#17375e",
            fontWeight: "bold",
          }}
        >
          Subscriptions Tab
        </Text>
      </View> */}

      <View style={styles.inputWrapper}>
        <SelectBox
          items={this.subscriptionList()}
          placeholder={{ label: "Select a subscription", value: null }}
          inputLabel="Subscriptions"
          inputLabelColor={{ color: "#17375e" }}
          value={this.state.selectedSubscription}
          onValueChange={(subscription) =>
            this.changeSubscriptions(subscription)
          }
        />
      </View>

      <View style={styles.inputWrapper}>
        {this.state.productIds.map((e, index) => (
          <View key={index}>
            <InputBox
              placeholder={`Enter product code for product ${index + 1}`}
              keyboardType="numeric"
              inputLabel={`Product ${index + 1}`}
              onChangeText={(code) => this.onChangeProductCode(code, index)}
              value={this.state.productIds[index] ?? ""}
            />
          </View>
        ))}
      </View>

      <View style={styles.inputWrapper}>
        <GreenButton
          text={"Subscribe"}
          onPress={() => this.subscriptionAction()}
          disabled={this.state.processing}
          processing={this.state.processing}
        />
      </View>
    </View>
  );

  renderItem = ({ item, index }) => {
    return (
      <Card
        style={{
          flex: 1,
        }}
      >
        <Card.Content
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 0.4,
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: "https://www.lillypayment.com/" + item.image_path }}
              resizeMode="contain"
              style={{ height: 250 }}
            />
          </View>

          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.displayClipBoard(item.id + "")}
              style={{ marginBottom: 5 }}
            >
              <Text style={styles.infoText}>
                Code: {item.id}{" "}
                <Icon name="copy" solid size={18} color="#17375e" />
              </Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 5 }}>
              <Text style={styles.infoText}>Product: {item.name}</Text>
            </View>

            <View style={{ marginBottom: 5 }}>
              <Text style={styles.infoText}>
                Amount: {Helper.formattedAmountWithNaira(item.amount)}
              </Text>
            </View>

            <View style={{ marginBottom: 5 }}>
              <Text style={styles.infoText}>
                Subscription: {item.sub_name ?? "No Plan"}
              </Text>
            </View>

            <View style={{ marginBottom: 5 }}>
              <Text style={styles.infoText}>
                Status: {item.status == "0" && "Awaiting Approval"}
                {item.status == "1" && "Up for Sale"}
                {item.status == "3" && "Disapproved"}
                {item.status == "2" && "Sold Out"}
              </Text>
              {item.status == "1" && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Product Action",
                      "Are you sure you want to update this product to sold?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => null,
                          style: "cancel",
                        },
                        {
                          text: "YES",
                          onPress: () =>
                            this.updateProduct("sold-product", item.id),
                        },
                      ]
                    );
                  }}
                  disabled={this.state.processing}
                  style={{
                    height: 22,
                    backgroundColor: "#19a886",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ color: "#ffffff" }}>Update to sold?</Text>
                </TouchableOpacity>
              )}

              {["0", "2", "3"].includes(item.status) && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Product Action",
                      "Are you sure you want to delete this product?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => null,
                          style: "cancel",
                        },
                        {
                          text: "YES",
                          onPress: () =>
                            this.updateProduct("delete-product", item.id),
                        },
                      ]
                    );
                  }}
                  disabled={this.state.processing}
                  style={{
                    height: 22,
                    backgroundColor: "#f36952",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ color: "#ffffff" }}>Delete product?</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={{ flexDirection: "row", marginBottom: 5 }}
              onPress={() =>
                this.props.navigation.navigate("EproductDetails", {
                  product_id: item.id,
                })
              }
            >
              <>
                <Text>View Details </Text>
                <Icon name="eye" size={18} color="#17375e" />
              </>
            </TouchableOpacity>

            {item.sub_name && (
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() =>
                  this.props.navigation.navigate(
                    "Ecommerce.MySubscriptionHistory",
                    item
                  )
                }
              >
                <>
                  <Text>View Subscription history </Text>
                  <Icon name="bell" size={18} color="#17375e" />
                </>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  render() {
    const { products, processing } = this.state;

    return (
      <View style={styles.container}>
        <Header
          text="Uploaded Products"
          backAction={() => this.props.navigation.goBack()}
        />

        <FlatList
          ListHeaderComponent={
            <>
              <ClipBoardModal
                closModal={() => this.setState({ showClipBoardModal: false })}
                itemCopied="Product ID Copied"
                message="You have copied the Product ID"
                visible={this.state.showClipBoardModal}
              />
              {this.subscriptionTab()}
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 19,
                  color: "#17375e",
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                My Products
              </Text>
            </>
          }
          keyExtractor={(item, index) => index + item.name}
          refreshing={processing}
          onRefresh={() => this.getProducts()}
          contentContainerStyle={styles.listStyle}
          renderItem={this.renderItem}
          data={products}
          key={"_"}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 5,
              }}
            ></View>
          )}
        />
      </View>
    );
  }
}
