import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import Header from "../../../../components/Header";
import Config from "../../../../Helpers/Config";
import Helper from "../../../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  container2: {
    // flex:5,
    // justifyContent: "space-around",
    // alignItems:'center'
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },

  blueText: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  row: {
    flexDirection: "row",
  },

  buttonWrapper: {
    alignSelf: "stretch",
    marginTop: 20,
  },
});

export default class Version extends Component {
  constructor(props) {
    super(props);

    this.state = {
      version: Config.appVersion,
    };
  }


  render() {
    return (
      <View style={styles.container}>
        {/* <StatusBar backgroundColor={styles.container.backgroundColor} /> */}

        <Header
          text="App Version"
          backAction={() => this.props.navigation.goBack()}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15%",
          }}
        >
          <Text style={styles.greyText}>Your Current App Version</Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <Text style={styles.blueText}>Version {this.state.version}</Text>
        </View>
      </View>
    );
  }
}
