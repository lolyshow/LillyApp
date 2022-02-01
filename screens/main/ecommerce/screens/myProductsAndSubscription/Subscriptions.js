import React, { Component } from "react";
import { Text, View, StyleSheet, Alert , ScrollView} from "react-native";
import GreenButton from "../../../../../components/GreenButton";
import Header from "../../../../../components/Header";
import InputBox from "../../../../../components/InputBox";
import SelectBox from "../../../../../components/SelectBox";
import Helper from "../../../../../Helpers/Helper";
import Network from "../../../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputWrapper: {
    flexDirection: "column",
    marginBottom: 20,
  },
});

export default class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productIds: [],
      subscriptions: [],
      selectedSubscription: {},
      processing: false,
    };
  }

  componentDidMount() {
    this.getSubscriptions();
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
        userId : global.user.id
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          text="Product Subscription"
          backAction={() => this.props.navigation.goBack()}
        />

        <ScrollView>
        <View style={styles.inputWrapper}>
          <SelectBox
            items={this.subscriptionList()}
            placeholder={{ label: "Select a subscription", value: null }}
            inputLabel="Subscriptions"
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

        </ScrollView>     
      </View>
    );
  }
}
