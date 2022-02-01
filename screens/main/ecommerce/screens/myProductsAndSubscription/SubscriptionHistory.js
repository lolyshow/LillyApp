import React, { Component } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Network from "../../../../../Helpers/Network";
import Header from "../../../../../components/Header";
import Helper from "../../../../../Helpers/Helper";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});
export default class SubscriptionHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      subscriptions: [],
    };
  }

  componentDidMount() {
    this.getSubscriptions();
  }

  getSubscriptions = async () => {
    try {
      let url = "https://www.lillypayment.com/api/e-commerce";

      let body = {
        action: "subscribeHistoryDetail",
        userId: global.user.id,
        productId: this.props.route.params.id,
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
        let subscriptions = response.subscriptions ?? [];

        this.setState({ subscriptions });
      } else {
        return Alert.alert("Product Subscription", message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });

      return Alert.alert("Product Subscription", error.toString());
    }
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 0.2 }}>
          <Text>{item.name}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <Text>{Helper.formattedAmountWithNaira(item.amount)}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <Text>{item.validity}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <Text>{item.status == 0 ? "Active" : "Inactive"}</Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <Text>{item.updated_at}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { subscriptions, processing } = this.state;

    return (
      <View style={styles.container}>
        <Header
          text="Product Subscription"
          backAction={() => this.props.navigation.goBack()}
        />
        <FlatList
          refreshing={processing}
          onRefresh={() => this.getProducts()}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index + item.name}
          renderItem={this.renderItem}
          data={subscriptions}
          key={"#"}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 10,
                height: 0.5,
                backgroundColor: "#000",
              }}
            ></View>
          )}
        />
      </View>
    );
  }
}
