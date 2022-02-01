import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Platform,
  BackHandler,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Dash from "react-native-dash";
import Logo from "../../../assets/shago.png";
import axios from "axios";
import InputBox from "../../../components/InputBox";
import ActionInputBox from "../../../components/ActionInputBox";
import DatePickerInput from "../../../components/DatePickerinput";
import SelectBox from "../../../components/SelectBox";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ReverseBorderedBackButton from "../../../components/ReverseBorderedBackButton";
import { Card, IconButton, Paragraph } from "react-native-paper";
import GreenButton from "../../../components/GreenButton";
import InputLine from "../../../components/InputLine";

const currency = "\u20A6";
var seatRightArray = [];
var seatLeftArray = [];

export default function SelectSeatScreen(props) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState(0);
  const [remainingPassengers, setRemainingPassengers] = useState(0);
  const [returning, setReturning] = useState([]);
  const [leaving, setLeaving] = useState([]);
  const [seats, setSeats] = useState([
    {
      seat: 1,
      booked: true,
    },
    {
      seat: 2,
      booked: true,
    },
    {
      seat: 3,
      booked: true,
    },
    {
      seat: 4,
      booked: true,
    },
    {
      seat: 5,
      booked: false,
    },
    {
      seat: 6,
      booked: true,
    },
    {
      seat: 7,
      booked: false,
    },
    {
      seat: 8,
      booked: true,
    },
    {
      seat: 9,
      booked: true,
    },
    {
      seat: 10,
      booked: true,
    },
    {
      seat: 11,
      booked: true,
    },
    {
      seat: 12,
      booked: false,
    },
    {
      seat: 13,
      booked: false,
    },
    {
      seat: 14,
      booked: false,
    },
    {
      seat: 15,
      booked: false,
    },
    {
      seat: 16,
      booked: false,
    },
    {
      seat: 17,
      booked: false,
    },
    {
      seat: 18,
      booked: false,
    },
    {
      seat: 19,
      booked: false,
    },
    {
      seat: 20,
      booked: false,
    },
    {
      seat: 21,
      booked: false,
    },
    {
      seat: 22,
      booked: false,
    },
    {
      seat: 23,
      booked: false,
    },
    {
      seat: 24,
      booked: false,
    },
    {
      seat: 25,
      booked: false,
    },
    {
      seat: 26,
      booked: false,
    },
  ]);
  const [alltransportDetails, setTransportDetails] = useState({});
  const [body, setBody] = useState({});
  const [parameters, setParameter] = useState({});
  const [isReturn, setIsReturn] = useState(false);

  useEffect(() => {
    setSelectedSeats([]);

    if (props.route.params && props.route.params.transportDetails) {
      getBusDetails(props.route.params.transportDetails);
    }
  }, []);

  const getBusDetails = (params) => {
    setPassengers(params.passengers);
    setRemainingPassengers(params.passengers);
    setParameter(params);
    setBody(params);
    setReturning(params.returning);
    setLeaving(params.leaving);
    var seatArr = [];

    for (let num = 1; num <= params.seats.length; num++) {
      if (params.seats.includes(num))
        seatArr.push({ seat: num, booked: false });
      else seatArr.push({ seat: num, booked: false });
    }

    setSeats(seatArr);

    if (params.isReturn) setIsReturn(params.isReturn);

    setTransportDetails(params);
  };

  const selectSeat = (item) => {
    if (item.booked) return;

    if (selectedSeats.includes(item.seat)) {
      setSelectedSeats(selectedSeats.filter((e) => e !== item.seat));
    } else {
      if (selectedSeats.length < passengers)
        setSelectedSeats([...selectedSeats, item.seat]);
    }
  };

  const proceed = () => {
    let transportDetails = alltransportDetails;
    
    if (selectedSeats.length == 0) {
      return Alert.alert("Error", "Please select seat");
    }

    if (selectedSeats.length != passengers) {

      return Alert.alert("Error", passengers+ " seat(s) is required for "+ passengers+ " passengers selected");
    }

    transportDetails.leavingSeats = selectedSeats;

    body.returning && body.returning.length > 0 && isReturn == true
      ? props.navigation.navigate("BusTicket.ReturnBuses", {
          transportDetails,
          returning,
        })
      : props.navigation.navigate("BusTicket.Boardingform", {
          transportDetails,
          returning,
        });
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <BorderedBackButton onPress={() => props.navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{"Select Seat"}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#eff6ff",
            borderRadius: 5,
            padding: 10,
            marginHorizontal: 50,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                height: 5,
                padding: 10,
                borderWidth: 1,
                borderRadius: 5,
                width: 20,
              }}
            ></View>
            <Text style={{ fontSize: 10 }}>empty</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                height: 5,
                backgroundColor: "#01cf13",
                padding: 11,
                borderRadius: 5,
                width: 20,
              }}
            ></View>
            <Text style={{ fontSize: 10 }}>selected</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                height: 5,
                backgroundColor: "#17375e",
                padding: 11,
                borderRadius: 5,
                width: 20,
              }}
            ></View>
            <Text style={{ fontSize: 10 }}>booked</Text>
          </View>
        </View>
        <View
          style={{
            paddingBottom: 20,
            flexDirection: "column",
            borderWidth: 2,
            marginHorizontal: 35,
            marginTop: 20,
            borderColor: "#17375e",
            borderTopRightRadius: 70,
            borderTopLeftRadius: 70,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <View style={{ paddingLeft: 30, paddingTop: 20, paddingBottom: 15 }}>
            <Icon name="steering" color="#17375e" size={40} />
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <FlatList
              style={{ marginRight: 40, marginLeft: 20 }}
              data={seats}
              horizontal={false}
              key={"_left"}
              numColumns={4}
              keyExtractor={(item, index) => index}
              extraData={selectedSeats}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => selectSeat(item)}
                  style={{ flex: 1, alignItems: "center", margin: 5 }}
                >
                  {item.booked ? (
                    <View style={styles.bookedbutton}>
                      <Text style={{ fontSize: 10, color: "#fff" }}>
                        {item.seat}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={
                        selectedSeats.includes(item.seat)
                          ? styles.selectedbutton
                          : styles.emptybutton
                      }
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: selectedSeats.includes(item.seat)
                            ? "#fff"
                            : "#17375e",
                        }}
                      >
                        {item.seat}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.submitButtonWrapper}>
        <GreenButton text="Proceed" onPress={() => proceed()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookedbutton: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#17375e",
    borderRadius: 5,
    width: 22,
    height: 22,
  },
  emptybutton: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 22,
    borderWidth: 1,
    borderRadius: 5,
    width: 22,
  },
  selectedbutton: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 22,
    backgroundColor: "#01cf13",
    borderRadius: 5,
    width: 22,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    // paddingBottom: 30
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
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f7f7f7",
    backgroundColor: "#f7f7f7",
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
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
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
    height: 30,
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
    color: "#707070",
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
    marginBottom: 10,
  },
});
