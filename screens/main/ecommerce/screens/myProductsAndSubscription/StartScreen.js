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
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import BorderedBackButton from "../../../../../components/BorderedBackButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  backWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },

  product: {},

  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  titleWrapper: {
    marginBottom: 10,
  },

  bets: {
    flexDirection: "column",
  },

  playBetWrapper: {
    marginBottom: 40,
  },

  playBet: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },

  box: {
    height: 63,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dce7f4",
    paddingHorizontal: 10,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  icon: {
    // flex:1,
  },

  label: {
    flex: 1,
    paddingLeft: 10,
  },

  labelText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  goto: {
    // flex:1,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "flex-end",
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      lists: [
        {
          name: "E-commerce Products",
          label: "Products & Subscriptions",
          navigation: "Ecommerce.MyProducts",
        },
        // {
        //   name: "E-commerce Product Subscription",
        //   label: "Product Subscription",
        //   navigation: "Ecommerce.MySubscription",
        // },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bets}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <>
                <View style={styles.backWrapper}>
                  <BorderedBackButton
                    onPress={() => this.props.navigation.navigate("Main")}
                  />
                </View>

                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>My Products & Subscription</Text>
                </View>

                <View style={styles.playBetWrapper}>
                  <Text style={styles.playBet}>
                    Subscribe to optimize product ranking
                  </Text>
                </View>
              </>
            )}
            contentContainerStyle={styles.listStyle}
            data={this.state.lists}
            horizontal={false}
            key={"#"}
            keyExtractor={(item, index) => item.label + index}
            // extraData={}
            renderItem={({ item, index }) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate(item.navigation, item)
                }
              >
                <View style={[styles.box]}>
                  <View style={styles.icon}></View>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>{item.label}</Text>
                  </View>
                  <View style={styles.goto}>
                    <Icon name="chevron-right" color="#ffffff" size={15} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    );
  }
}
