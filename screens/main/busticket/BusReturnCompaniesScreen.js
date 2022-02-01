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
  FlatList,
  Dimensions,
  ScrollView
} from "react-native";
// import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Logo from "../../../assets/lilly.png";
import axios from "axios";
import InputBox from "../../../components/InputBox";
import DatePickerInput from "../../../components/DatePickerinput";
import SelectBox from "../../../components/SelectBox";
import BorderedBackButton from "../../../components/BorderedBackButton";
import { Card, IconButton, Paragraph } from "react-native-paper";
import GreenButton from "../../../components/GreenButton";
import InputLine from "../../../components/InputLine";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Stars from 'react-native-stars';
import Network from "../../../Helpers/Network";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";

const currency = "\u20A6"

export default function BusReturnCompaniesScreen(props) {

  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSeletedAction] = useState("ROUNDTRIP");
  const [selectedId, setSelectedId] = useState(null);
  const [buses, setBuses] = useState([])
  const [leaving, setLeaving] = useState([])
  const [passengers, setPassengers] = useState(0)
  const [body, setBody] = useState({})
  const [alltransportDetails, setTransportDetails] = useState({})

  useEffect(() => {
    if (props.route.params && props.route.params.transportDetails) {
      getBusDetails(props.route.params)
    }
  }, [])

  const getBusDetails = (params) => {
    setBody(params)
    setTransportDetails(params.transportDetails)
    setPassengers(params.transportDetails.passengers)
    setBuses(params.returning)
  }

  const renderCompanies = ({ item }) => {

    var transportDetails = alltransportDetails

    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#f7f7f7",
          borderRadius: 10,
          margin: 10,
          padding: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          setSelectedId(item.id)
          transportDetails.returningDate = item.departureDate
          transportDetails.returningTime = item.departureTime
          transportDetails.returnamount = item.currentFare * passengers
          transportDetails.returningcapacity = item.seatCapacity
          transportDetails.availableSeat = item.availableSeat
          transportDetails.returningRoute = item.routeDescription
          transportDetails.returningRouteId = item.scheduleId
          transportDetails.returningAmountAmountEach= item.currentFare,
          props.navigation.navigate("BusTicket.SelectReturnSeat", { transportDetails })
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#17375e" }}>{item.busType}</Text>
          <Text style={{ color: "#707070", fontSize: 15 }}>Seats Capacity: {item.seatCapacity}</Text>
          <Text style={{ color: "#707070", fontSize: 15 }}>{item.departureTime}</Text>
          <Text style={{ color: "#707070", fontSize: 15 }}>{item.routeDescription}</Text>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#17375e" }}>{currency} {item.currentFare}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading ?
        <View
          style={{
            position: "absolute",
            top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            flex: 1
          }}
        >
          <ActivityIndicator size={50} color="#fff" />
        </View> : null}
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton onPress={() => props.navigation.goBack()} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{'Search Results for Returning'}</Text>
          </View>
        </View>
        <View
          style={{
            padding: 10, paddingBottom: 30
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={buses}
            renderItem={renderCompanies}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
          />
        </View>
      </View>
    </View>
  );
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const styles = StyleSheet.create({
  myStarStyle: {
    color: "#01cf13",
    backgroundColor: 'transparent',
  },
  myEmptyStarStyle: {
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    paddingBottom: 30
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
    paddingTop: 15,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    // backgroundColor: "#17375e",
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
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 7,
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