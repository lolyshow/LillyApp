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
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";


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
    paddingHorizontal:10,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  icon: {
    // flex:1,
  },

  label: {
    flex:1,
    paddingLeft:10
  },

  labelText: {
  fontSize: 16,
  fontWeight: "500",
  fontStyle: "normal",
  lineHeight: 24,
  letterSpacing: 0,
  textAlign: "left",
  color: "#707070"
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
    };
  }

  goToProduct = (tv) => {
    this.setState({ selected: tv });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.backWrapper}>
            <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Sport Bet & Lottery</Text>
          </View>

          <View style={styles.playBetWrapper}>
            <Text style={styles.playBet}>Play bets and play lottery</Text>
          </View>

          <View style={styles.bets}>
            <TouchableWithoutFeedback  onPress={() => this.props.navigation.navigate('Bet.StartScreen')}>
           
              <View style={[styles.box]}>
                <View style={styles.icon}>
                <Icon   name="futbol" color="#17375e"  size={28} />
                </View>
                <View style={styles.label}>
                  <Text style={styles.labelText}>Sport Betting</Text>
                </View>
                <View style={styles.goto}>
                <Icon   name="chevron-right"  color="#ffffff"  size={15} />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback  onPress={() => this.props.navigation.navigate('Lottery.StartScreen')}>
              <View style={[styles.box]}>
                <View style={styles.icon}>
                <Icon   name="dharmachakra" color="#17375e"  size={28} />
                </View>
                <View style={styles.label}>
                <Text style={styles.labelText}>Lottery</Text>
                </View>
                <View style={styles.goto}>
                  <Icon   name="chevron-right" color="#ffffff"  size={15} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}
