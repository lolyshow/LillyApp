import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ProgressBar, Colors, RadioButton } from "react-native-paper";

import Icon from "react-native-vector-icons/FontAwesome5";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import Network from "../../../Helpers/Network";
import WhiteButton from "../../../components/WhiteButton";
import Divider from "../../../components/Divider";
import LiveSearch from "../../../components/LiveSearch";
import DatePicker from "../../../components/DatePicker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  passengers: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    marginBottom: 20,
  },
});

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const flightUrl = Config.base_url + "/flight/search";

export default function SearchFlight(props) {
  const [flightSearchType, setFlightSearchType] = useState("Oneway");

  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [children, setChildren] = useState(0);

  const passengers = adults + children + infants;

  const [ticketClass, setTicketClass] = useState(null);

  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [showReturnDate, setShowReturnDate] = useState(false);

  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");

  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePickerPicker] = useState(false);
  const [processing, setProcessing] = useState(false);

  const ticketClasses = [
    {
      label: "Economy",
      value: "Y",
    },
    {
      label: "Premium Economy",
      value: "W",
    },

    {
      label: "Business",
      value: "C",
    },
    {
      label: "First Class",
      value: "F",
    },
  ];
  const passengerTypes = [
    {
      type: "Adults",

      info: "> 12 years",
      value: adults,
    },

    {
      type: "Children",
      info: "2 - 12 years",
      value: children,
    },

    {
      type: "Infants",
      info: "< 2 years",
      value: infants,
    },
  ];

  const flightTypeAction = (value) => {
    if (value === "Return") {
      setShowReturnDate(true);
      setFlightSearchType(value);
    } else {
      setShowReturnDate(false);
      setFlightSearchType(value);
    }

    setFlightSearchType(value);
  };
  const setPassengerCount = (operation, passengerType) => {
    switch (passengerType) {
      case "Adults":
        if (operation == "decrement") {
          if (adults > 1) {
            setAdults(adults - 1);
          }
        } else {
          setAdults(adults + 1);
        }
        break;

      case "Children":
        if (operation == "decrement") {
          if (children > 0) {
            setChildren(children - 1);
          }
        } else {
          setChildren(children + 1);
        }

        break;

      case "Infants":
        if (operation == "decrement") {
          if (infants > 0) {
            setInfants(infants - 1);
          }
        } else {
          setInfants(infants + 1);
        }

        break;

      default:
        break;
    }
  };

  const onChangeDepartureDate = (event, selectedDate) => {
    let currentDate = selectedDate || departureDate;
    setShowDepartureDatePicker(Platform.OS === "ios");
    setDepartureDate(currentDate);
  };

  const onChangeReturnDate = (event, selectedDate) => {
    let currentDate = selectedDate || returnDate;
    setShowReturnDatePickerPicker(Platform.OS === "ios");
    setReturnDate(currentDate);
  };
  const submit = async () => {
    try {
      if (departure && destination && ticketClass && departureDate) {
        if (showReturnDate) {
          if (!returnDate) {
            return Alert.alert(
              "Error",
              "Please enter return date for a round trip"
            );
          }
        }
        let body = {
          serviceCode: "WFS",
          flightSearchType: flightSearchType,
          adults: adults,
          infants: infants,
          children: children,
          ticketClass: ticketClass,
          departureDate: departureDate,
          returnDate: flightSearchType == "Return" ? returnDate : null,
          departure: departure,
          destination: destination,
        };

        let url = Config.app_url;

        setProcessing(true);

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        setProcessing(false);

        if (error) {
          return Alert.alert("Flight Search", errorMessage);
        }

        let { status, message } = response;

        if (status == "200") {
          return props.navigation.navigate(
            "FlightBooking.SelectFlight",
            response
          );
        } else {
          return Alert.alert("Flight Search", message.toString());
        }
      } else {
        return Alert.alert("Error", "Please enter all fields");
      }
    } catch (error) {
      setProcessing(false);
      return Alert.alert("Error", error.toString());
    }
  };

  return (
    <View style={styles.container}>
      {processing ? (
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
          <Text style={{ color: "#fff", fontSize: 30 }}>Searching Flight </Text>
          <Icon name="plane-departure" color="#fff" size={30}></Icon>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <Header
        text={
          <>
            <Text>
              Search Flight
              {"     "}
              <Icon name="plane-departure" size={30}></Icon>
            </Text>
          </>
        }
        backAction={() => props.navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.inputWrapper,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <View>
            <Text onPress={() => flightTypeAction("Return")}>Roundtrip</Text>
            <RadioButton
              value="Return"
              status={flightSearchType === "Return" ? "checked" : "unchecked"}
              onPress={() => flightTypeAction("Return")}
            />
          </View>

          <View>
            <Text onPress={() => flightTypeAction("Oneway")}>One way</Text>
            <RadioButton
              value="Oneway"
              status={flightSearchType === "Oneway" ? "checked" : "unchecked"}
              onPress={() => flightTypeAction("Oneway")}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <SelectBox
            inputLabel="Travel Class"
            value={ticketClass}
            onValueChange={(ticketClass) => setTicketClass(ticketClass)}
            placeholder={{ label: "Select travel class", value: null }}
            items={ticketClasses}
            iconColor="#17375e"
          />
        </View>

        <View style={[styles.inputWrapper]}>
          <LiveSearch
            url={flightUrl}
            searchWord="airport"
            titleKey="AirportName"
            descriptionKey="CityCountry"
            nameKey="AirportCode"
            onValueChange={(value) => setDeparture(value)}
            searchInputLabel="Flying From"
            searchInputPlaceholder="Enter where you're flying from (departure)"
          />
        </View>

        <View style={[styles.inputWrapper]}>
          <LiveSearch
            url={flightUrl}
            searchWord="airport"
            titleKey="AirportName"
            descriptionKey="CityCountry"
            nameKey="AirportCode"
            onValueChange={(value) => setDestination(value)}
            searchInputLabel="Flying To"
            searchInputPlaceholder="Enter where you're flying to (destination)"
          />
        </View>

        <View style={[styles.inputWrapper]}>
          <DatePicker
            value={departureDate}
            onDateChange={onChangeDepartureDate}
            label="Departure Date"
            showDate={showDepartureDatePicker}
            showDatePicker={() => setShowDepartureDatePicker(true)}
            minDate={today}
            maxDate={null}
          />
        </View>

        {showReturnDate && (
          <View style={[styles.inputWrapper]}>
            <DatePicker
              value={returnDate}
              onDateChange={onChangeReturnDate}
              label="Return Date"
              showDate={showReturnDatePicker}
              showDatePicker={() => setShowReturnDatePickerPicker(true)}
              minDate={today}
              maxDate={null}
            />
          </View>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              padding: 20,
              borderWidth: 1,
              borderRadius: 15,
              borderColor: "#eff6ff",
            },
          ]}
        >
          <Text style={styles.passengers}>{passengers} Passenger(s)</Text>

          {passengerTypes.map((item) => (
            <View key={item.type}>
              <View
                style={[
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <View>
                  <Text>{item.type}</Text>
                  <Text> {item.info} </Text>
                </View>

                <View
                  style={[
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  ]}
                >
                  <WhiteButton
                    text="-"
                    bordered
                    buttonWidth={40}
                    onPress={() => {
                      setPassengerCount("decrement", item.type);
                    }}
                  />
                  <Text>
                    {"  "} {item.value} {"  "}
                  </Text>
                  <WhiteButton
                    text="+"
                    bordered
                    buttonWidth={40}
                    onPress={() => {
                      setPassengerCount("increment", item.type);
                    }}
                  />
                </View>
              </View>

              <Divider
                style={{
                  marginVertical: 20,
                  backgroundColor: "#eff6ff",
                }}
              />
            </View>
          ))}
        </View>

        <View style={[styles.inputWrapper]}>
          <GreenButton
            onPress={submit}
            processing={processing}
            disabled={processing}
            text={
              <>
                <Text>
                  Search Flight
                  {"     "}
                  <Icon name="plane-departure" size={30}></Icon>
                </Text>
              </>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
