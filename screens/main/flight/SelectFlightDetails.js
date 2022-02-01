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
import {
  List,
  DataTable,
  Chip,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";

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
    paddingVertical: 40,
    paddingHorizontal: 25,
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
    padding: 10,
    paddingBottom: 40,
    paddingTop: 40,
    marginVertical: 10,
  },
});

export default function SelectFlightDetails(props) {
  const {
    item,
    destination,
    departure,
    adults,
    children,
    infants,
    requestNo,
  } = props.route.params;
  const { SelectData } = item;
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    //
  }, []);
  const LeftContent = (props) => (
    <Avatar.Icon {...props} icon="arrow-right-bold-circle" />
  );
  const LeftContentReturn = (props) => (
    <Avatar.Icon {...props} icon="arrow-left-bold-circle" />
  );

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

  const submit = async () => {
    try {
      let body = {
        serviceCode: "WSF",
        selectData: SelectData,
        requestNo: requestNo,
      };

      let url = Config.app_url;

      setProcessing(true);

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      setProcessing(false);

      if (error) {
        return Alert.alert("Flight Select", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        return props.navigation.navigate("FlightBooking.BookFlight", response);
      } else {
        return Alert.alert("Flight Select", message.toString());
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
          <Text style={{ color: "#fff", fontSize: 30 }}>
            Selecting Flight..{" "}
          </Text>
          <Icon name="plane-departure" color="#fff" size={30}></Icon>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <Header
        text={
          <>
            <Text>Flight Details</Text>
          </>
        }
        backAction={() => props.navigation.goBack()}
      />
      <ScrollView>
        <Text style={{ alignSelf: "flex-end" }}>
          <Chip
            style={{
              backgroundColor: item.FlightCombination.IsRefundable
                ? "#01cf13"
                : "#f36952",
            }}
            textStyle={{ color: "#ffff" }}
          >
            {item.FlightCombination.IsRefundable ? "" : "Non"} Refundable
          </Chip>
        </Text>
        <List.Accordion
          title="Overview"
          //   left={(props) => <List.Icon {...props} icon="information" />}
        >
          <View style={styles.box}>
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
                  <Text style={styles.text}>{departure}</Text>
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
                  <Text style={styles.text}>{destination}</Text>
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
                      <Text style={styles.text}>{destination}</Text>
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
                      <Text style={styles.text}>{departure}</Text>
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
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.amountText}>
                {Helper.formattedAmountWithNaira(
                  item.FlightCombination.Price.Amount
                )}
              </Text>
            </View>
          </View>
        </List.Accordion>
        <View style={{ marginVertical: 5 }}>
          <List.Accordion
            title="Fare Rules"
            //   left={(props) => <List.Icon {...props} icon="information" />}
          >
            {item.FlightCombination.FareRules.map((rule, key) => (
              <View key={"#" + key} style={{ paddingVertical: 10 }}>
                <Text style={styles.text}>
                  {key + 1}. {rule}
                </Text>
              </View>
            ))}
          </List.Accordion>
        </View>
        <View style={{}}>
          <Card>
            <Card.Title
              title="Leaving Trip Leg(s)"
              //   subtitle="Card Subtitle"
              left={LeftContent}
            />
            <Card.Content>
              {item.FlightCombination.FlightModels[0].FlightLegs.map(
                (leavingLegs, key) => (
                  <View key={"#" + key}>
                    <Title>Leg {key + 1}</Title>
                    <View style={{ marginVertical: 5 }}>
                      <Text style={styles.text}>
                        {leavingLegs.DepartureName} [
                        {format(
                          new Date(leavingLegs.StartTime),
                          "yyyy-MM-dd hh:mm:ss a"
                        )}
                        ] ➝ {leavingLegs.DestinationName} [
                        {format(
                          new Date(leavingLegs.EndTime),
                          "yyyy-MM-dd hh:mm:ss a"
                        )}
                        ]
                      </Text>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                      <Text style={styles.text}>
                        Duration of :{durationFormat(leavingLegs.Duration)}
                      </Text>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                      <Text style={styles.text}>
                        Layover: {leavingLegs.Layover}
                        for {durationFormat(leavingLegs.LayoverDuration)}
                      </Text>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                      <Text style={styles.text}>Technical stops:</Text>
                      {leavingLegs.TechnicalStops.map((stop, key) => (
                        <View key={"#" + key} style={{ paddingLeft: 5 }}>
                          <Text style={styles.text}>
                            {key + 1}. arrive by{" "}
                            {format(
                              new Date(stop.ArrivalDate),
                              "yyyy-MM-dd hh:mm:ss a"
                            )}{" "}
                            and depart by{" "}
                            {format(
                              new Date(stop.DepartureDate),
                              "yyyy-MM-dd hh:mm:ss a"
                            )}{" "}
                            (Duration of {durationFormat(stop.Duration)})
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )
              )}
            </Card.Content>
          </Card>
          <Divider
            style={{
              marginVertical: 5,
              backgroundColor: "#d3d3d3",
            }}
          />
          {item.FlightCombination.FlightModels[1] && (
            <Card>
              <Card.Title
                title="Return Trip Leg(s)"
                //   subtitle="Card Subtitle"
                left={LeftContentReturn}
              />
              <Card.Content>
                {item.FlightCombination.FlightModels[1].FlightLegs.map(
                  (leavingLegs, key) => (
                    <View key={"#" + key}>
                      <Title>Leg {key + 1}</Title>
                      <View style={{ marginVertical: 5 }}>
                        <Text style={styles.text}>
                          {leavingLegs.DepartureName} [{" "}
                          {format(
                            new Date(leavingLegs.EndTime),
                            "yyyy-MM-dd hh:mm:ss a"
                          )}
                          ] ➝ {leavingLegs.DestinationName} [
                          {leavingLegs.EndTime}]
                        </Text>
                      </View>

                      <View style={{ marginVertical: 5 }}>
                        <Text style={styles.text}>
                          Duration of :{durationFormat(leavingLegs.Duration)}
                        </Text>
                      </View>

                      <View style={{ marginVertical: 5 }}>
                        <Text style={styles.text}>
                          Layover: {leavingLegs.Layover}
                          for {durationFormat(leavingLegs.LayoverDuration)}
                        </Text>
                      </View>

                      <View style={{ marginVertical: 5 }}>
                        <Text style={styles.text}>Technical stops:</Text>
                        {leavingLegs.TechnicalStops.map((stop, key) => (
                          <View key={"#" + key} style={{ paddingLeft: 5 }}>
                            <Text style={styles.text}>
                              {key + 1}. arrive by{" "}
                              {format(
                                new Date(stop.ArrivalDate),
                                "yyyy-MM-dd hh:mm:ss a"
                              )}{" "}
                              and depart by{" "}
                              {format(
                                new Date(stop.DepartureDate),
                                "yyyy-MM-dd hh:mm:ss a"
                              )}{" "}
                              (Duration of {durationFormat(stop.Duration)})
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )
                )}
              </Card.Content>
            </Card>
          )}

          <View style={{ marginVertical: 15 }}>
            <Text style={styles.flightTextHead}>Fare Details</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Base Fare</DataTable.Title>
                <DataTable.Title>Fees & Tax</DataTable.Title>
                <DataTable.Title>Total</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>
                  {Helper.formattedAmountWithNaira(
                    item.FlightCombination.PriceDetails[0].BaseFare.Amount
                  )}
                </DataTable.Cell>
                <DataTable.Cell>
                  {Helper.formattedAmountWithNaira(
                    item.FlightCombination.PriceDetails[0].Tax.Amount
                  )}
                </DataTable.Cell>
                <DataTable.Cell>
                  {Helper.formattedAmountWithNaira(
                    item.FlightCombination.Price.Amount
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>

          <View style={{ marginVertical: 15 }}>
            <Text style={styles.flightTextHead}>Passenger(s)</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Adults</DataTable.Title>
                <DataTable.Title>Children</DataTable.Title>
                <DataTable.Title>Infants</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>{adults}</DataTable.Cell>
                <DataTable.Cell>{children}</DataTable.Cell>
                <DataTable.Cell>{infants}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>

          <GreenButton
            disabled={processing}
            processing={processing}
            text="Book"
            onPress={submit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
