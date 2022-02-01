import React, { useEffect, useState } from "react";
import {
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
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Dash from "react-native-dash";
import Logo from "../../../assets/lilly.png";
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

export default function BoardingFormScreen(props) {
  const [fullName, setFullName] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nextOfKinName, setNextOfkinName] = useState("");
  const [nextOfKinPhone, setNextOfkinPhone] = useState("");
  const [boardingPark, setBoardingPark] = useState("");
  const [dropOffPark, setDropOffPark] = useState("");
  const [params, setParams] = useState({});
  const [fullbody, setFullBody] = useState({});
  const [details, setDetails] = useState({});
  const [genders, setGenders] = useState([]);
  const [relations, setRelationship] = useState("");

  var genderArr = [],
    nameArr = [];

  useEffect(() => {
    if (props.route.params) {
      setParams(props.route.params.transportDetails);
      formatTransportDetails(props.route.params.transportDetails);
    }
  }, []);

  const formatTransportDetails = (transportDetails) => {
    if (transportDetails.returningDate){
      setFullBody({
        serviceCode: "CHB",
        amount: transportDetails.returnamount
          ? +transportDetails.leavingamount + +transportDetails.returnamount
          : +transportDetails.leavingamount,
        leavingRouteId: transportDetails.leavingRouteId,
        leavingDate: transportDetails.leavingDate,
        leavingTime: transportDetails.leavingTime,
        leavingRoute: transportDetails.leavingRoute,
        leavingSeats: transportDetails.leavingSeats,
        returningRouteId: transportDetails.returningRouteId,
        returningSeats: transportDetails.returningSeats,
        returningDate: transportDetails.returningDate,
        returningTime: transportDetails.returningTime,
        returningRoute: transportDetails.returningRoute,
      });
      setDetails(transportDetails)
    }
    else{
      setFullBody({
        serviceCode: "CHB",
        amount: transportDetails.returnamount
          ? +transportDetails.leavingamount + +transportDetails.returnamount
          : +transportDetails.leavingamount,
        leavingRouteId: transportDetails.leavingRouteId,
        leavingDate: transportDetails.leavingDate,
        leavingTime: transportDetails.leavingTime,
        leavingRoute: transportDetails.leavingRoute,
        leavingSeats: transportDetails.leavingSeats,
      });

      setDetails(transportDetails)
    }
  };

  const finalBoarding = () => {
    var body = fullbody;
   
    if (fullName.length < params.passengers)
      return Alert.alert("Kindly fill up all required names or name");
    if (genders.length < params.passengers)
      return Alert.alert("Kindly select a gender or genders for passengers");
    if (email == "") return Alert.alert("Kindly fill up your email address");
    if (phone == "") return Alert.alert("Kindly fill up your Phone");
    if (nextOfKinName == "")
      return Alert.alert("Kindly enter the name of your next-of-kin");
    if (nextOfKinPhone == "")
      return Alert.alert("Kindly enter the phone number of your next-of-kin");
    if (relations == "")
      return Alert.alert("Kindly enter the relationship of your next-of-kin");
    console.log(fullName, "fullName");
    body.name = fullName;
    body.gender = genders;
    body.email = email;
    body.phone = phone;
    body["next-of-kin"] = nextOfKinName;
    body["next-of-kin-phone"] = nextOfKinPhone;
    body.relations = relations;
    props.navigation.navigate("BusTicket.Validation", { body, details });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <BorderedBackButton onPress={() => props.navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{"Boarding Details"}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {params.leavingSeats &&
          params.leavingSeats.map((leavingseats, index) => {
            return (
              <SafeAreaView>
                <Text
                  style={{
                    color: "#17375e",
                    fontWeight: "bold",
                    fontSize: 17,
                    marginBottom: 20,
                  }}
                >
                  Passenger {index + 1} Details
                </Text>
                <ActionInputBox
                  icon="pencil"
                  iconColor="#17375e"
                  keyboardType="default"
                  inputLabel={"Full Name for seat " + leavingseats}
                  placeholder="Enter"
                  iconSize={25}
                  iconOnPress={() => null}
                  iconStyle={{ backgroundColor: "#f7f7f7" }}
                  onChangeText={(text) => {
                    nameArr = fullName;
                    nameArr[index] = text;
                    setFullName(nameArr);
                  }}
                />
                <View style={styles.inputWrapper}>
                  <SelectBox
                    inputLabel={"Gender for seat " + leavingseats}
                    inputLabelStyle={styles.selectDiscProvider}
                    onValueChange={(text) => {
                      genderArr = genders;
                      genderArr[index] = text;
                      setGenders(genderArr);
                    }}
                    placeholder={{ label: "Select Gender", value: null }}
                    items={genderTypes}
                    iconColor="#17375e"
                    iconSize={22}
                  />
                </View>
              </SafeAreaView>
            );
          })}
        <View style={{ height: 1, backgroundColor: "#f7f7f7" }}></View>
        <ActionInputBox
          icon="pencil"
          iconColor="#17375e"
          keyboardType="default"
          inputLabel="Email Address"
          placeholder="Enter email address"
          iconSize={25}
          iconOnPress={() => null}
          iconStyle={{ backgroundColor: "#f7f7f7" }}
          onChangeText={(text) => setEmail(text)}
        />
        <ActionInputBox
          icon="pencil"
          iconColor="#17375e"
          keyboardType="default"
          inputLabelStyle={{ color: "#000" }}
          inputLabel="Phone Number"
          placeholder="Enter phone number"
          iconSize={25}
          iconOnPress={() => null}
          iconStyle={{ backgroundColor: "#f7f7f7" }}
          onChangeText={(text) => setPhone(text)}
        />
        <Text
          style={{
            color: "#17375e",
            fontWeight: "bold",
            fontSize: 17,
            marginBottom: 20,
          }}
        >
          Next of Kins details
        </Text>
        <ActionInputBox
          icon="pencil"
          iconColor="#17375e"
          keyboardType="default"
          inputLabel="Full Name"
          placeholder="Enter full name"
          iconSize={25}
          iconOnPress={() => null}
          iconStyle={{ backgroundColor: "#f7f7f7" }}
          onChangeText={(text) => setNextOfkinName(text)}
        />
        <ActionInputBox
          icon="pencil"
          iconColor="#17375e"
          keyboardType="default"
          inputLabel="Phone Number"
          placeholder="Enter phone number"
          iconSize={25}
          iconOnPress={() => null}
          iconStyle={{ backgroundColor: "#f7f7f7" }}
          onChangeText={(text) => setNextOfkinPhone(text)}
        />
        <ActionInputBox
          icon="pencil"
          iconColor="#17375e"
          keyboardType="default"
          inputLabel="Relationship"
          placeholder=""
          iconSize={25}
          iconOnPress={() => null}
          iconStyle={{ backgroundColor: "#f7f7f7" }}
          onChangeText={(text) => setRelationship(text)}
        />
        <Text
          style={{
            color: "#17375e",
            fontWeight: "bold",
            fontSize: 17,
            marginBottom: 20,
          }}
        >
          Trip Details
        </Text>
        <View style={styles.inputWrapper}>
          <ActionInputBox
            keyboardType="default"
            inputLabel="Boarding Park"
            placeholder="Enter phone number"
            iconSize={25}
            iconOnPress={() => null}
            iconStyle={{ backgroundColor: "#f7f7f7" }}
            inputValue={params.leavingRoute}
            editable={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <ActionInputBox
            keyboardType="default"
            inputLabel="Drop Off Park"
            placeholder="Enter phone number"
            iconSize={25}
            iconOnPress={() => null}
            iconStyle={{ backgroundColor: "#f7f7f7" }}
            inputValue={params.leavingRoute}
            editable={false}
          />
        </View>
        <Text style={{ color: "#707070", fontSize: 15, marginBottom: 15 }}>
          Departure Schedule
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "auto",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity style={[styles.fancyButton, { marginRight: 5 }]}>
            <View
              style={{
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                padding: 5,
              }}
            >
              <Icon name="cloud" size={20} color="grey" />
            </View>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#707070" }}
            >
              {params.leavingDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.fancyButton, { marginLeft: 5 }]}>
            <View
              style={{
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                padding: 5,
              }}
            >
              <Icon name="moon-o" size={20} color="grey" />
            </View>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#707070" }}
            >
              {params.leavingTime}
            </Text>
          </TouchableOpacity>
        </View>
        {params.leavingDate && (
          <>
            <Text style={{ color: "#707070", fontSize: 15, marginBottom: 15 }}>
              Returning Schedule
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "auto",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={[styles.fancyButton, { marginRight: 5 }]}
              >
                <View
                  style={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    padding: 5,
                  }}
                >
                  <Icon name="cloud" size={20} color="grey" />
                </View>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#707070" }}
                >
                  {params.returningDate}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.fancyButton, { marginLeft: 5 }]}>
                <View
                  style={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    padding: 5,
                  }}
                >
                  <Icon name="moon-o" size={20} color="grey" />
                </View>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#707070" }}
                >
                  {params.returningTime}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.submitButtonWrapper}>
          <GreenButton text="Proceed" onPress={() => finalBoarding()} />
        </View>
      </ScrollView>
    </View>
  );
}

const genderTypes = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const styles = StyleSheet.create({
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
    marginBottom: 30,
  },
});
