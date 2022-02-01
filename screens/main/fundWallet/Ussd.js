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
  Linking,
  Platform,
  Alert,
} from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/FontAwesome5";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ClipBoardModal from "../../../components/ClipBoardModal";
import Divider from "../../../components/Divider";
import WhiteButton from "../../../components/WhiteButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import axios from "axios";
import Network from "../../../Helpers/Network";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  instruction: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },
  instructionWrapper: {
    marginBottom: 30,
  },
  box: {
    height: 77,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  account: {
    fontSize: 18,
    paddingBottom: 10,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
});

export default class Ussd extends Component {
  constructor() {
    super();

    this.state = {
      copiedText: "",
      showClipBoard: false,
      processing: true,
      account: "*737*50*Amount*445#",
      strings: [],
    };
  }

  getStrings = async () => {
    try {
      let body = {
        serviceCode: "FBB",
        type: "Bank USSD",
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Error", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {

        this.setState({ strings: response.details, processing: false });
      } else {
        
        this.setState({ processing: false });
        Alert.alert("Error", "Could not fetch bank USSD Strings");
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Error", error.toString());
    }
  };

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    
    this.setState({ showClipBoard: true, copiedText: value });
  };

  dialCall = (number) => {
    try {
      let phoneNumber = "";
      if (Platform.OS === "android") {
        phoneNumber = `tel:${number}`;
      } else {
        phoneNumber = `telprompt:${number}`;
      }

      if (Linking.canOpenURL(phoneNumber)) {

        Linking.openURL(phoneNumber);
      }

      else {

        Alert.alert("Error", "Could not open USSD string");
      }
      
    } 
    catch (error) {

      Alert.alert("Error", error.toString());
    }
  };

  componentDidMount() {
    this.getStrings();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text="Instant Funding (USSD)"
          backAction={() => this.props.navigation.goBack()}
        />

        <View style={styles.instructionWrapper}>
          <Text style={styles.instruction}>
            Copy USSD code or dial to your phone
          </Text>
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
              <Text>Fetching bank USSD strings ...</Text>
            </View>
          </>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.state.strings.map((item, index) => (
                <View key={index + item.bank} style={{}}>
                  <View style={styles.box}>
                    <Text
                      style={[
                        styles.account,
                        { fontSize: 16, paddingBottom: 10, paddingTop: 15 },
                      ]}
                    >
                      {item.bank}
                    </Text>
                    <Text style={styles.account}>{item.message}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <WhiteButton
                        onPress={() => this.displayClipBoard(item.message)}
                        bordered
                        text={
                          <Text style={{ flexDirection: "row" }}>
                            <Icon
                              name="copy"
                              size={20}
                              color="#01cf13"
                              solid
                            ></Icon>{" "}
                            Copy Code
                          </Text>
                        }
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => this.dialCall(item.message)}
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Icon name="phone-alt" size={20} color="#01cf13"></Icon>

                      <Text style={styles.instruction}> Dial Code</Text>
                    </TouchableOpacity>
                  </View>

                  <Divider
                    style={{
                      backgroundColor: "#dbdbdb",
                      marginVertical: 20,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <ClipBoardModal
          closModal={() => this.setState({ showClipBoard: false })}
          itemCopied="USSD Copied"
          message="You have copied the USSD"
          visible={this.state.showClipBoard}
        />
      </View>
    );
  }
}
