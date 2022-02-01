import React, { useEffect, useState, useRef } from "react";
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
  PermissionsAndroid,
  Dimensions,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Dash from 'react-native-dash';
import Logo from "../../../assets/shago.png";
import axios from "axios";
import InputBox from "../../../components/InputBox";
import DatePickerInput from "../../../components/DatePickerinput";
import SelectBox from "../../../components/SelectBox";
import BorderedBackButton from "../../../components/BorderedBackButton";
import ReverseBorderedBackButton from "../../../components/ReverseBorderedBackButton";
import { Card, IconButton, Paragraph } from "react-native-paper";
import GreenButton from "../../../components/GreenButton";
import WhiteButton from "../../../components/WhiteButton";
import InputLine from "../../../components/InputLine";
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

const currency = "\u20A6"

export default function TicketScreen(props) {

  const [service, setService] = useState("");
  const [selectedAction, setSeletedAction] = useState("ROUNDTRIP");
  const [ticketInfo, setTicketInfo] = useState({})
  const [direction, setDirection] = useState([])
  const [time, setTime] = useState("")
  const [names, setNames] = useState([])
  const [amount, setAmount] = useState(0)
  const [DnoOfSeats, setDNoOfSeats] = useState(0)
  const [Dseats, setDSeats] = useState([])
  const [rnoOfSeats, setRNoOfSeats] = useState(0)
  const [Rseats, setRSeats] = useState([])
  const viewRef = useRef();

  useEffect(() => {
    if (props.route.params) {
      getTicketDetails(props.route.params.body)
    }
  }, [])

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false },
      );
    } catch (err) {
      // handle error as you please
      console.log('err', err);
    }
  };

  // download image
  const downloadImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      if (Platform.OS === 'android') {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }

      // cameraroll saves image
      const image = CameraRoll.save(uri, 'photo');
      if (image) {
        Alert.alert(
          '',
          'Ticket downloaded successfully.',
          [{ text: 'OK', onPress: () => { } }],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getTicketDetails = (params) => {
    setTicketInfo(params)
    setDirection(params.leavingRoute.split("=>"))
    setTime(params.leavingTime)
    setNames(params.name)
    setAmount(params.amount)
    setDNoOfSeats(params.leavingSeats.length)
    setDSeats(params.leavingSeats)
    if (params.returningDate) {
      setRNoOfSeats(params.returningSeats.length)
      setRSeats(params.returningSeats)
    }
  }

  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: "#17375e",
          flexDirection: "column",
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Text style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          marginVertical: 15
        }}>Travel Ticket</Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 30
        }}
      >
        <View ref={viewRef} style={{
          borderRadius: 15,
          shadowColor: "rgba(0,0,0,0.6)",
          marginTop: 20,
          marginHorizontal: 10,
          marginVertical: 20,
          backgroundColor: "#fff",
          flexDirection: "column",
          paddingHorizontal: 15
          // alignContent: "center",
          // alignItems: "center"
        }}>
          <Image
            source={require("../../../assets/network/chisco.png")}
            style={{ width: 100, height: 70, alignSelf: "center" }}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: "column",
              padding: 10
            }}
          >
            <Text style={{ color: "#17375e", fontWeight: "bold", fontSize: 20, marginBottom: 20, textAlign: "left" }}>
              {ticketInfo.leavingDate}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 15
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "grey" }}>From</Text>
                <Text style={{ fontWeight: "bold" }}>{direction[0]}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                <Text style={{ color: "grey" }}>Depart</Text>
                <Text style={{ fontWeight: "bold" }}>{time}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "grey" }}>To</Text>
                <Text style={{ fontWeight: "bold" }}>{direction[1]}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                <Text style={{ color: "grey" }}>Arrive</Text>
                <Text></Text>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: "#f7f7f7", marginVertical: 10 }}></View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 15
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "grey" }}>Passengers</Text>
                <Text style={{ fontWeight: "bold" }}>{names && names.map(name => name + ",")}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                <Text style={{ color: "grey" }}>Price</Text>
                <Text style={{ fontWeight: "bold" }}>{currency + " " + amount}</Text>
              </View>
            </View>
            <Text style={{ color: "#17375e", fontWeight: "bold", fontSize: 15, marginBottom: 20, textAlign: "left" }}>
              Departure
              </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 15
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "grey" }}>No. Of Seats</Text>
                <Text style={{ fontWeight: "bold" }}>{DnoOfSeats}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                <Text style={{ color: "grey" }}>Seat Numbers</Text>
                <Text style={{ fontWeight: "bold" }}>{Dseats && Dseats.map(seat => seat + ",")}</Text>
              </View>
            </View>
            {rnoOfSeats > 0 && <>
              <Text style={{ color: "#17375e", fontWeight: "bold", fontSize: 15, marginBottom: 20, textAlign: "left" }}>
                Arrival
                </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 15
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "grey" }}>No. Of Seats</Text>
                  <Text style={{ fontWeight: "bold" }}>{rnoOfSeats}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                  <Text style={{ color: "grey" }}>Seat Numbers</Text>
                  <Text style={{ fontWeight: "bold" }}>{Rseats && Rseats.map(seat => seat + ",")}</Text>
                </View>
              </View>
            </>}
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <GreenButton
            text={"Download"}
            onPress={downloadImage}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <WhiteButton bordered text="Home" onPress={() => props.navigation.navigate("Home")} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    // paddingBottom: 30
  },
  buttonWrapper: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  verticleLine: {
    height: '100%',
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
    padding: 10
  },
  unselectedAction: {
    borderRadius: 10,
    flex: 1,
    padding: 10
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
    marginBottom: 30
  },
});