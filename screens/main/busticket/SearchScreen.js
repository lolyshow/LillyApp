import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  BackHandler,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Dash from "react-native-dash";
import Logo from "../../../assets/shago.png";
import axios from "axios";
import InputBox from "../../../components/InputBox";
import DatePickerInput from "../../../components/DatePickerinput";
import SelectBox from "../../../components/SelectBox";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ReverseBorderedBackButton from "../../../components/ReverseBorderedBackButton";
import { Card, IconButton, Paragraph } from "react-native-paper";
import GreenButton from "../../../components/GreenButton";
import InputLine from "../../../components/InputLine";
import Network from "../../../Helpers/Network";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";

const currency = "\u20A6";

export default function StartScreen(props) {
  const [service, setService] = useState("");
  const [selectedAction, setSeletedAction] = useState("ROUNDTRIP");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [departDate, setDepartDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [passengers, setPassengers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [leavingRoutes, setLeavingRoutes] = useState([]);
  const [departRoutes, setDepartRoutes] = useState([]);

  useEffect(() => {
    getLeavingRoutes();
  }, []);

  const getLeavingRoutes = async () => {
    setLoading(true);
    let body = { serviceCode: "CHA" };
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body);
    setLoading(false);
    if (error) {
      return Alert.alert("Error: ", errorMessage);
    }

    if (response.status == "200") {
      var arr = [];
      for (const data of response.data) {
        arr.push({ label: data.name, value: data.id });
      }
      setLeavingRoutes(arr);
    } else {
      return Alert.alert("Error: ", response.message.toString());
    }
  };

  const getDepartRoutes = async (fromId) => {
    setLoading(true);
    let body = {
      id: fromId,
      serviceCode: "CHD",
    };
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body);
    setLoading(false);
    if (error) {
      return Alert.alert("Error: ", errorMessage);
    }

    if (response.status == "200") {
      var arr = [];
      for (const data of response.data) {
        arr.push({ label: data.name, value: data.id });
      }
      setDepartRoutes(arr);
    } else {
      return Alert.alert("Error: ", response.message.toString());
    }
  };

  const search = () => {
    if (!to) return Alert.alert("Error: ", "To is required!.");
    if (!from) return Alert.alert("Error: ", "From is required!.");
    if (!departDate)
      return Alert.alert("Error: ", "Departure date is required!.");
    if (selectedAction == "ROUNDTRIP" && !arrivalDate)
      return Alert.alert("Error: ", "Arrival date is required!.");
    if (!passengers) return Alert.alert("Error: ", "Passenger is required!.");

    var body = {
      to: to,
      from: from,
      departDate: departDate,
      passengers: passengers,
    };
    if (selectedAction == "ROUNDTRIP" && arrivalDate)
      body.arrivalDate = arrivalDate;

    props.navigation.navigate("BusTicket.Buscompanies", { body });
  };

  return (
    <ScrollView>
      {loading ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <ReverseBorderedBackButton
            onPress={() => props.navigation.goBack()}
          />
        </View>
        <View
          style={{
            backgroundColor: "#17375e",
            flexDirection: "row",
            paddingRight: 50,
            paddingLeft: 40,
            paddingTop: 10,
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              paddingTop: 30,
              paddingRight: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#01cf13",
                padding: 15,
                borderRadius: 100,
              }}
            ></View>
            <Dash
              style={{
                width: 1,
                height: 40,
                flexDirection: "column",
                backgroundColor: "#fff",
              }}
            />
            <View
              style={{
                backgroundColor: "#01cf13",
                padding: 15,
                borderRadius: 100,
              }}
            ></View>
          </View>
          <View style={{ flex: 1 }}>
            <SelectBox
              inputLabel="From"
              inputLabelColor={{ color: "#fff", fontWeight: "bold" }}
              inputLabelStyle={{ fontSize: 13, fontWeight: "bold" }}
              inputWrapperStyle={{ marginTop: 20, marginBottom: 5 }}
              inputBackGround={[
                { backgroundColor: "#17375e" },
                styles.inputLine,
              ]}
              onValueChange={(text) => {
                setFrom(text);
                text && getDepartRoutes(text);
              }}
              placeholder={{ label: "From", value: null }}
              items={leavingRoutes}
              iconColor="#fff"
              iconSize={22}
            />
            <SelectBox
              inputLabel="To"
              inputLabelColor={{ color: "#fff", fontWeight: "bold" }}
              inputLabelStyle={{ fontSize: 13, fontWeight: "bold" }}
              inputWrapperStyle={{
                marginTop: 5,
                marginBottom: 10,
                backgroundColor: "#17375e",
              }}
              inputBackGround={[
                { backgroundColor: "#17375e" },
                styles.inputLine,
              ]}
              onValueChange={(text) => text && setTo(text)}
              placeholder={{ label: "To", value: null }}
              items={departRoutes}
              iconColor="#fff"
              iconSize={22}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#eff6ff",
            borderRadius: 10,
            flexDirection: "row",
            marginTop: -25,
            marginHorizontal: 30,
            marginBottom: 10,
            padding: 5,
            width: "auto",
          }}
        >
          <TouchableOpacity
            style={
              selectedAction == "ONEWAY"
                ? styles.selectedAction
                : styles.unselectedAction
            }
            onPress={() => {
              setSeletedAction("ONEWAY");
              setService("ONEWAY");
            }}
          >
            <Text
              style={
                selectedAction == "ONEWAY"
                  ? { color: "#fff", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" }
              }
            >
              One Way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedAction == "ROUNDTRIP"
                ? styles.selectedAction
                : styles.unselectedAction
            }
            onPress={() => {
              setSeletedAction("ROUNDTRIP");
              setService("ROUNDTRIP");
            }}
          >
            <Text
              style={
                selectedAction == "ROUNDTRIP"
                  ? { color: "#fff", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" }
              }
            >
              Round Trip
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 30,
          }}
        >
          <View style={styles.inputWrapper}>
            <DatePickerInput
              keyboardType="default"
              inputLabel="Daparture Date"
              inputLabelStyle={{ color: "#17375e" }}
              placeholder=""
              inputValue={departDate}
              onChangeText={(text) =>
                setDepartDate(text.toLocaleDateString() || null)
              }
              dateValue={(_date) =>
                setDepartDate(_date.toLocaleDateString() || null)
              }
            />
          </View>
          {service == "ONEWAY" ? (
            <View style={styles.inputWrapper}>
              <InputBox
                keyboardType="default"
                inputLabel="Return Date"
                inputLabelStyle={{ color: "#17375e" }}
                placeholder=""
                editable={false}
              />
            </View>
          ) : (
            <View style={styles.inputWrapper}>
              <DatePickerInput
                keyboardType="default"
                inputLabel="Return Date"
                inputLabelStyle={{ color: "#17375e" }}
                placeholder=""
                inputValue={arrivalDate}
                onChangeText={(text) =>
                  setArrivalDate(text.toLocaleDateString() || null)
                }
                dateValue={(_date) =>
                  setArrivalDate(_date.toLocaleDateString() || null)
                }
              />
            </View>
          )}
          <View style={styles.inputWrapper}>
            <SelectBox
              inputLabel="Passengers"
              inputLabelStyle={styles.selectDiscProvider}
              onValueChange={(_passengers) => setPassengers(_passengers)}
              placeholder={{ label: "Select Passenger", value: null }}
              items={passangers}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>
          <View style={styles.submitButtonWrapper}>
            <GreenButton text="Search" onPress={() => search()} />
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "auto",
              marginBottom: 50,
            }}
          >
            <TouchableOpacity
             onPress={() => props.navigation.navigate("shagoVest")}
             style={styles.fancyButton}>
              <View
                style={{
                  backgroundColor: "lightgreen",
                  borderTopLeftRadius: 5,
                  opacity: 0.5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <IconButton
                  onPress={() => null}
                  size={30}
                  icon="flower"
                  color="green"
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#707070",
                }}
              >
                Lilly Vest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Main")}
              style={styles.fancyButton}
            >
              <View
                style={{
                  backgroundColor: "pink",
                  borderTopLeftRadius: 5,
                  opacity: 0.5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <IconButton
                  onPress={() => null}
                  size={30}
                  icon="credit-card"
                  color="red"
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#707070",
                }}
              >
                Lilly Bill Payment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const passangers = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    // paddingBottom: 30
  },
  inputLine: {
    opacity: 0.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
  },
  verticleLine: {
    height: "100%",
    width: 1,
    borderStyle: "dashed",
    backgroundColor: "#f7f7f7",
  },
  fancyButton: {
    flexDirection: "row",
    flex: 1,
    borderRadius: 5,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f7f7f7",
    // elevation: 5
  },
  selectedAction: {
    backgroundColor: "#17375e",
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  unselectedAction: {
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 0,
    paddingTop: 5,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    backgroundColor: "#17375e",
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperSelected: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.19)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
  },

  productWrapper: {
    flex: 1,
  },

  tvs: {
    marginBottom: 40,
  },

  product: {},

  title: {
    // width: 185,
    height: 28,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "normal",
    // lineHeight: 32,
    // letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },

  listStyle: {
    justifyContent: "space-between",
  },

  productWrapper: {
    flex: 1,
  },

  tvs: {
    marginBottom: 40,
  },

  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperSelected: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.19)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
  },

  selectDiscProviderWrapper: {
    marginBottom: 20,
  },

  selectDiscProvider: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 10,
  },

  Button: {
    width: 317,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#01cf13",
    justifyContent: "center",
    alignItems: "center",
  },

  ButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },
  placeHolder: {
    width: 187,
    height: 19,
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#c7c7c7",
  },
  submitButtonWrapper: {
    marginTop: 10,
    marginBottom: 30,
  },
});
