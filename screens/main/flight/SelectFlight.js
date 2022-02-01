import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  SectionList,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Chip } from "react-native-paper";

import Icon from "react-native-vector-icons/FontAwesome5";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import Network from "../../../Helpers/Network";
import WhiteButton from "../../../components/WhiteButton";
import Divider from "../../../components/Divider";
import { compareAsc, format } from "date-fns";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  flightText: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  flightTextHead: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 5,
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "left",
  },

  box: {
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#f7f7f7",
    padding: 20,
    paddingBottom: 40,
    paddingTop: 40,
    marginVertical: 10,
  },
});

export default function SelectFlight(props) {
  const response = props.route.params;
  const [processing, setProcessing] = useState(false);
  const [searchResults, setResults] = useState(response.result);
  const cheapest = searchResults.reduce(function(prev, curr) {
    return prev.FlightCombination.Price.Amount <
      curr.FlightCombination.Price.Amount
      ? prev
      : curr;
  });

  const results = () => {
    let list = [];
    let searchResults = response.result;
    let cheapest = searchResults.reduce(function(prev, curr) {
      return prev.FlightCombination.Price.Amount >
        curr.FlightCombination.Price.Amount
        ? prev
        : curr;
    });

    searchResults.forEach((item, index) => {
      if (JSON.stringify(cheapest) == JSON.stringify(item)) {
        list.push({
          title: "Cheapest flight",
          data: item,
        });
      } else {
        list.push({
          title: "Other Flight Results",
          data: item,
        });
      }
    });

    // setResults(list);
    return list;
  };

  const durationFormat = (duration) => {
    let durationSplit = duration.split(":");

    let hours = durationSplit[0] ?? "0";

    let minutes = durationSplit[1] ?? "0";

    let seconds = durationSplit[2] ?? "0";

    return (
      parseInt(hours) +
      "h " +
      parseInt(minutes) +
      "m " +
      parseInt(seconds) +
      "s"
    );
  };

  useEffect(() => {
    // console.log(response.result);
  }, []);

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
          <Text style={{ color: "#fff", fontSize: 30 }}>
            Selecting Flight..{" "}
          </Text>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <Header
        text={
          <>
            <Text>Select Flight</Text>
          </>
        }
        backAction={() => props.navigation.goBack()}
      />
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.amountText, { textAlign: "center" }]}>
          Flight type : {response.flightSearchType}
        </Text>
        <Text style={[styles.amountText, { textAlign: "center" }]}>
          {response.departure} {"->"} {response.destination}
        </Text>
        <Text
          style={[{ alignSelf: "flex-end", marginTop: 10 }, styles.flightText]}
        >
          Search results : {searchResults.length}
        </Text>
      </View>
      <ScrollView>
        {searchResults.map((item, index) => (
          <View key={"#" + index} style={styles.box}>
            {JSON.stringify(cheapest) === JSON.stringify(item) && (
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: -20,
                  marginBottom: 10,
                }}
              >
                <Chip
                  icon="information"
                  //   onPress={() => console.log("Pressed")}
                  //   style={{ backgroundColor: "#17375e" }}
                  textStyle={{ color: "#000" }}
                >
                  Cheapest
                </Chip>
              </View>
            )}

            <View>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Text style={styles.text}>
                    {item.FlightCombination.FlightModels[0].AirlineName}
                  </Text>

                  <Text style={styles.text}>
                    {item.FlightCombination.FlightModels[0].Name} .{" "}
                    {
                      item.FlightCombination.FlightModels[0].FlightLegs[0]
                        .CabinClass
                    }{" "}
                    .
                    {
                      item.FlightCombination.FlightModels[0].FlightLegs[0]
                        .CabinClassName
                    }
                  </Text>
                </View>
                <Image
                  source={{
                    uri: item.FlightCombination.FlightModels[0].AirlineLogoUrl,
                  }}
                  style={{ width: 50, height: 50 }}
                />
              </View>

              {item.FlightCombination.FlightModels[0].FreeBaggage && (
                <View style={{ marginVertical: 5 }}>
                  <Text style={styles.text}>
                    Free Luggage:{" "}
                    {item.FlightCombination.FlightModels[0].FreeBaggage
                      .BagCount != 0
                      ? item.FlightCombination.FlightModels[0].FreeBaggage
                          .BagCount + " "
                      : ""}
                    {item.FlightCombination.FlightModels[0].FreeBaggage
                      .Weight &&
                    item.FlightCombination.FlightModels[0].FreeBaggage.Weight !=
                      0
                      ? item.FlightCombination.FlightModels[0].FreeBaggage
                          .Weight + " "
                      : ""}
                    {item.FlightCombination.FlightModels[0].FreeBaggage
                      .WeightUnit
                      ? item.FlightCombination.FlightModels[0].FreeBaggage
                          .WeightUnit + " "
                      : ""}
                    Bag
                  </Text>
                </View>
              )}

              <View style={{ marginVertical: 5 }}>
                <Text style={styles.text}>
                  Trip Duration:{" "}
                  {durationFormat(
                    item.FlightCombination.FlightModels[0].TripDuration
                  )}{" "}
                  (
                  {item.FlightCombination.FlightModels[0].Stops == 0
                    ? "Non Stop"
                    : item.FlightCombination.FlightModels[0].Stops + " Stop(s)"}
                  )
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <View style={{ flex: 1 / 3 }}>
                  <Text style={styles.flightTextHead}>Departure</Text>
                  <Text style={styles.text}>{response.departure}</Text>
                  <Text style={styles.text}>
                    {format(
                      new Date(
                        item.FlightCombination.FlightModels[0].DepartureTime
                      ),
                      "yyyy-MM-dd hh:mm:ss a"
                    )}
                  </Text>
                </View>

                <View style={{ flex: 1 / 3 }}>
                  <Text style={styles.flightTextHead}>Arrival</Text>
                  <Text style={styles.text}>{response.destination}</Text>
                  <Text style={styles.text}>
                    {format(
                      new Date(
                        item.FlightCombination.FlightModels[0].ArrivalTime
                      ),
                      "yyyy-MM-dd hh:mm:ss a"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {item.FlightCombination.FlightModels[1] && (
              <>
                <Divider
                  style={{
                    marginVertical: 5,
                    backgroundColor: "#d3d3d3",
                  }}
                />
                <View>
                  <View
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{}}>
                      <Text style={styles.text}>
                        {item.FlightCombination.FlightModels[1].AirlineName}
                      </Text>

                      <Text style={styles.text}>
                        {item.FlightCombination.FlightModels[1].Name} .{" "}
                        {
                          item.FlightCombination.FlightModels[1].FlightLegs[0]
                            .CabinClass
                        }{" "}
                        .
                        {
                          item.FlightCombination.FlightModels[1].FlightLegs[0]
                            .CabinClassName
                        }
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          item.FlightCombination.FlightModels[1].AirlineLogoUrl,
                      }}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>

                  {item.FlightCombination.FlightModels[1].FreeBaggage && (
                    <View style={{ marginVertical: 5 }}>
                      <Text style={styles.text}>
                        Free Luggage:{" "}
                        {item.FlightCombination.FlightModels[1].FreeBaggage
                          .BagCount != 0
                          ? item.FlightCombination.FlightModels[1].FreeBaggage
                              .BagCount + " "
                          : ""}
                        {item.FlightCombination.FlightModels[1].FreeBaggage
                          .Weight &&
                        item.FlightCombination.FlightModels[1].FreeBaggage
                          .Weight != 0
                          ? item.FlightCombination.FlightModels[1].FreeBaggage
                              .Weight + " "
                          : ""}
                        {item.FlightCombination.FlightModels[1].FreeBaggage
                          .WeightUnit
                          ? item.FlightCombination.FlightModels[1].FreeBaggage
                              .WeightUnit + " "
                          : ""}
                        Bag
                      </Text>
                    </View>
                  )}

                  <View style={{ marginVertical: 5 }}>
                    <Text style={styles.text}>
                      Trip Duration:{" "}
                      {durationFormat(
                        item.FlightCombination.FlightModels[1].TripDuration
                      )}{" "}
                      (
                      {item.FlightCombination.FlightModels[1].Stops == 0
                        ? "Non Stop"
                        : item.FlightCombination.FlightModels[1].Stops +
                          " Stop(s)"}
                      )
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 5,
                    }}
                  >
                    <View style={{ flex: 1 / 3 }}>
                      <Text style={styles.flightTextHead}>Departure</Text>
                      <Text style={styles.text}>{response.destination}</Text>
                      <Text style={styles.text}>
                        {format(
                          new Date(
                            item.FlightCombination.FlightModels[1].DepartureTime
                          ),
                          "yyyy-MM-dd hh:mm:ss a"
                        )}
                      </Text>
                    </View>

                    <View style={{ flex: 1 / 3 }}>
                      <Text style={styles.flightTextHead}>Arrival</Text>
                      <Text style={styles.text}>{response.departure}</Text>
                      <Text style={styles.text}>
                        {format(
                          new Date(
                            item.FlightCombination.FlightModels[1].ArrivalTime
                          ),
                          "yyyy-MM-dd hh:mm:ss a"
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
            <Divider
              style={{
                marginVertical: 5,
                backgroundColor: "#d3d3d3",
              }}
            />
            <View
              style={{
                marginVertical: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <WhiteButton
                bordered
                text="View Details"
                onPress={() =>
                  props.navigation.navigate(
                    "FlightBooking.SelectFlightDetails",
                    {
                      item: item,
                      departure: response.departure,
                      destination: response.destination,
                      infants: response.infants,
                      children: response.children,
                      adults: response.adults,
                      requestNo: response.requestNo,
                    }
                  )
                }
              />
              <Text style={styles.amountText}>
                {Helper.formattedAmountWithNaira(
                  item.FlightCombination.Price.Amount
                )}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
