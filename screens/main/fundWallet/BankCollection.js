import axios from "axios";
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

import Icon from "react-native-vector-icons/FontAwesome5";
import BorderedBackButton from "../../../components/BorderedBackButton";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  backWrapper: {
    flexDirection: "row",
    marginBottom: 40,
  },

  product: {},

  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  titleWrapper: {
    marginBottom: 20,
  },

  instruction: {
    fontSize: 11,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  instructionWrapper: {
    marginBottom: 10,
  },
});

export default class BankCollection extends Component {
  constructor() {
    super();

    this.state = {
      processing: true,
      details: {},
    };
  }

  getSteps = async () => {
    try {
      let { account, bank } = this.props.route.params;

      let body = {
        serviceCode: "FBB",
        type: "Shago Steps To Fund with Bank",
        bank: bank,
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

      if (response.status == "200") {
        let details = {
          bank: response.details.bank,
          instructions: response.details.steps,
        };

        this.setState({ details, processing: false });
      } else {
        this.setState({ processing: false });
        Alert.alert("Error", response.message.toString());
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  componentDidMount() {
    this.getSteps();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backWrapper}>
          <BorderedBackButton onPress={() => this.props.navigation.goBack()} />
        </View>

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
              <Text>Fetching bank accounts ...</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{this.state.details.bank}</Text>
            </View>

            <View style={styles.bets}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                data={this.state.details.instructions}
                horizontal={false}
                key={"#"}
                keyExtractor={(item, index) => index + item}
                // extraData={}
                renderItem={({ item, index }) => (
                  <View style={styles.instructionWrapper}>
                    <Text style={styles.instruction}>{item}</Text>
                  </View>
                )}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}
