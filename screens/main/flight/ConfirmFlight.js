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
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  List,
  DataTable,
  Chip,
  Avatar,
  Card,
  Title,
  Checkbox,
} from "react-native-paper";

import Icon from "react-native-vector-icons/FontAwesome5";

import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import Network from "../../../Helpers/Network";
import Divider from "../../../components/Divider";
import { compareAsc, format } from "date-fns";
import TransactionPin from "../../../components/TransactionPin";
import PrintComponents from "../../../components/PrintComponents";
import Result from "../../../components/Result";
import Summary from "../../../components/Summary";

const screenWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingVertical: 40,
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
    padding: 15,
    paddingBottom: 40,
    paddingTop: 40,
    marginVertical: 10,
  },

  messageBox: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#17375e",
    color: "#ffff",
    marginVertical: 5,
  },
  formColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Platform.select({
      ios: 15,
      android: 15,
    }),
  },
});

const LeftContent = (props) => (
  <Avatar.Icon {...props} icon="arrow-right-bold-circle" />
);
const LeftContentReturn = (props) => (
  <Avatar.Icon {...props} icon="arrow-left-bold-circle" />
);

export default function BookFlight(props) {
  const {
    result,
    requestNo,
    bookingId,
    pnrNumber,
    amount,
  } = props.route.params;
  const [processing, setProcessing] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showTransactionPin, setShowTransactionPin] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pin, setPin] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [validationList, setValidationList] = useState([]);
  const [summaryList, setSummaryList] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const tokenLength = Config.tokenLength;

  const passengersDetails =
    result.FlightBookingResult.FlightBookingSummaryModel.TravellerDetails;
  const details =
    result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel
      .FlightCombination.FlightModels;
  const infants =
    result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel
      .FlightCombination.Infants;
  const children =
    result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel
      .FlightCombination.Children;
  const adults =
    result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel
      .FlightCombination.Adults;

  useEffect(() => {
    prepareValidationList();
    prepareSummaryList();
  }, []);

  const prepareSummaryList = () => {
    let list = [
      {
        label: "Base Fare",
        value: Helper.formattedAmountWithNaira(
          result.FlightBookingResult.FlightBookingSummaryModel
            .FlightSummaryModel.FlightCombination.PriceDetails[0].BaseFare
            .Amount
        ),
      },

      {
        label: "Base Fare",
        value: Helper.formattedAmountWithNaira(
          result.FlightBookingResult.FlightBookingSummaryModel
            .FlightSummaryModel.FlightCombination.PriceDetails[0].Tax.Amount
        ),
      },

      {
        label: "Total passenger(s)",
        value: adults + children + infants,
      },
    ];

    setSummaryList(list);
  };
  const prepareValidationList = () => {
    let list = [
      { label: "Flight Name", value: details[0].AirlineName },

      {
        label: "Departure",
        value: details[0].DepartureName + " (" + details[0].DepartureCode + ")",
      },

      {
        label: "Arrival",
        value: details[0].ArrivalName + " (" + details[0].ArrivalCode + ")",
      },

      {
        label: "Departure Time",
        value: format(
          new Date(details[0].DepartureTime),
          "yyyy-MM-dd hh:mm:ss a"
        ),
      },

      {
        label: "Arrival Time",
        value: format(
          new Date(details[0].ArrivalTime),
          "yyyy-MM-dd hh:mm:ss a"
        ),
      },
      {
        label: "Stop(s)",
        value:
          details[0].Stops == 0 ? "Non stop" : details[0].Stops + " Stop(s)",
      },
      {
        label: "Trip Duration",
        value: durationFormat(details[0].TripDuration),
      },

      {
        label: "Ticket Class",
        value: details[0].FlightLegs[0].CabinClassName,
      },

      {
        label: "Total Amount",
        value: Helper.formattedAmountWithNaira(amount),
      },

      { label: "Booking ID", value: bookingId },
      { label: "PNR Number", value: pnrNumber },
    ];

    setValidationList(list);
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

  const showPinModal = () => {
    let checkIfPinEnabled = Helper.checkPinActive();

    if (checkIfPinEnabled) {
      setShowTransactionPin(true);
    } else {
      submit();
    }
  };

  const confirmToken = () => {
    let inputted_pin = pin;
    if (inputted_pin.length == tokenLength) {
      setShowTransactionPin(false);
      setPin("");
      return submit();
    }
  };

  const submit = async () => {
    try {
      let url = Config.app_url;

      let body = {
        serviceCode: "WFB",
        requestNo: requestNo,
        transactionPin: pin,
      };

      setProcessing(true);

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      setProcessing(false);

      if (error) {
        return Alert.alert("Passenger Booking", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        let list = validationList.slice();

        list.push({
          label: "Transaction ID",
          value: Helper.getPropValue(response, "transId"),
        });

        list.push({
          label: "Transaction Status",
          value: "Successful",
        });

        setValidationList(list);
        setShowPrint(true);
      } else if (status == "400") {
        let list = validationList.slice();
        list.push({
          label: "Transaction Status",
          value: "Pending/Processing",
        });
        setValidationList(list);
        setShowPrint(true);
      } else {
        let list = validationList.slice();
        list.push({
          label: "Transaction Status",
          value: "Failed",
        });
        setValidationList(list);
      }

      setUserMessage(message);
      setTransactionStatus(status);
      setShowResult(true);
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
            Confirming Flight..{" "}
          </Text>
          <Icon name="plane-departure" color="#fff" size={30}></Icon>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <Header
        text={
          <>
            <Text>Confirm Flight </Text>
          </>
        }
        backAction={() => props.navigation.goBack()}
      />
      <ScrollView>
        <Text style={{ alignSelf: "flex-end" }}>
          <Chip
            style={{
              backgroundColor: result.FlightBookingResult
                .FlightBookingSummaryModel.FlightSummaryModel.FlightCombination
                .IsRefundable
                ? "#01cf13"
                : "#f36952",
            }}
            textStyle={{ color: "#ffff" }}
          >
            {result.FlightBookingResult.FlightBookingSummaryModel
              .FlightSummaryModel.FlightCombination.IsRefundable
              ? ""
              : "Non"}{" "}
            Refundable
          </Chip>
        </Text>

        <View style={styles.box}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.flightText}>Booking ID : {bookingId}</Text>
            <Text style={styles.flightText}>PNR: {pnrNumber}</Text>
          </View>
          <View style={{}}>
            <Card>
              <Card.Title
                title="Leaving Trip Leg(s)"
                //   subtitle="Card Subtitle"
                left={LeftContent}
              />
              <Card.Content>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{}}>
                    <Text style={styles.text}>
                      {
                        result.FlightBookingResult.FlightBookingSummaryModel
                          .FlightSummaryModel.FlightCombination.FlightModels[0]
                          .AirlineName
                      }
                    </Text>

                    <Text style={styles.text}>
                      {
                        result.FlightBookingResult.FlightBookingSummaryModel
                          .FlightSummaryModel.FlightCombination.FlightModels[0]
                          .Name
                      }{" "}
                      .{" "}
                      {
                        result.FlightBookingResult.FlightBookingSummaryModel
                          .FlightSummaryModel.FlightCombination.FlightModels[0]
                          .FlightLegs[0].CabinClass
                      }{" "}
                      .
                      {
                        result.FlightBookingResult.FlightBookingSummaryModel
                          .FlightSummaryModel.FlightCombination.FlightModels[0]
                          .FlightLegs[0].CabinClassName
                      }
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri:
                        result.FlightBookingResult.FlightBookingSummaryModel
                          .FlightSummaryModel.FlightCombination.FlightModels[0]
                          .AirlineLogoUrl,
                    }}
                    style={{ width: 50, height: 50 }}
                  />
                </View>

                {result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel.FlightCombination.FlightModels[0].FlightLegs.map(
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
            {result.FlightBookingResult.FlightBookingSummaryModel
              .FlightSummaryModel.FlightCombination.FlightModels[1] && (
              <Card>
                <Card.Title
                  title="Return Trip Leg(s)"
                  //   subtitle="Card Subtitle"
                  left={LeftContentReturn}
                />
                <Card.Content>
                  <View
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{}}>
                      <Text style={styles.text}>
                        {
                          result.FlightBookingResult.FlightBookingSummaryModel
                            .FlightSummaryModel.FlightCombination
                            .FlightModels[1].AirlineName
                        }
                      </Text>

                      <Text style={styles.text}>
                        {
                          result.FlightBookingResult.FlightBookingSummaryModel
                            .FlightSummaryModel.FlightCombination
                            .FlightModels[1].Name
                        }{" "}
                        .{" "}
                        {
                          result.FlightBookingResult.FlightBookingSummaryModel
                            .FlightSummaryModel.FlightCombination
                            .FlightModels[1].FlightLegs[0].CabinClass
                        }{" "}
                        .
                        {
                          result.FlightBookingResult.FlightBookingSummaryModel
                            .FlightSummaryModel.FlightCombination
                            .FlightModels[1].FlightLegs[0].CabinClassName
                        }
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          result.FlightBookingResult.FlightBookingSummaryModel
                            .FlightSummaryModel.FlightCombination
                            .FlightModels[1].AirlineLogoUrl,
                      }}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>

                  {result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel.FlightCombination.FlightModels[1].FlightLegs.map(
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
                      result.FlightBookingResult.FlightBookingSummaryModel
                        .FlightSummaryModel.FlightCombination.PriceDetails[0]
                        .BaseFare.Amount
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {Helper.formattedAmountWithNaira(
                      result.FlightBookingResult.FlightBookingSummaryModel
                        .FlightSummaryModel.FlightCombination.PriceDetails[0]
                        .Tax.Amount
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {Helper.formattedAmountWithNaira(
                      result.FlightBookingResult.FlightBookingSummaryModel
                        .FlightSummaryModel.FlightCombination.Price.Amount
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

            <View style={{ marginVertical: 15 }}>
              <Text style={styles.flightTextHead}>Passenger Information</Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>S/N</DataTable.Title>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Phone</DataTable.Title>
                  <DataTable.Title>Email</DataTable.Title>
                  {/* <DataTable.Title>Address</DataTable.Title> */}
                </DataTable.Header>

                {passengersDetails.map((passenger, index) => (
                  <View key={"index" + index}>
                    {index == 0 ? (
                      <DataTable.Row>
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>
                          {passenger.FirstName}
                          {passenger.MiddleName
                            ? " " + passenger.MiddleName
                            : ""}
                          {" "+passenger.LastName}
                        </DataTable.Cell>
                        <DataTable.Cell>{passenger.PhoneNumber}</DataTable.Cell>
                        <DataTable.Cell>{passenger.Email}</DataTable.Cell>
                        {/* <DataTable.Cell>{passenger.Address}</DataTable.Cell> */}
                      </DataTable.Row>
                    ) : (
                      <DataTable.Row>
                        <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>
                          {passenger.FirstName}
                          {passenger.MiddleName
                            ? " " + passenger.MiddleName
                            : ""}
                          {" "+passenger.LastName}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {passenger.PhoneNumber ?? "-"}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {passenger.Email ?? "-"}
                        </DataTable.Cell>
                        {/* <DataTable.Cell>
                          {passenger.Address ?? "-"}
                        </DataTable.Cell> */}
                      </DataTable.Row>
                    )}
                  </View>
                ))}
              </DataTable>
            </View>
          </View>
          <View style={{ marginVertical: 5 }}>
            <List.Accordion title="Fare Rules" expanded={true}>
              {result.FlightBookingResult.FlightBookingSummaryModel.FlightSummaryModel.FlightCombination.FareRules.map(
                (rule, key) => (
                  <View key={"#" + key} style={{ paddingVertical: 10 }}>
                    <Text style={styles.text}>
                      {key + 1}. {rule}
                    </Text>
                  </View>
                )
              )}
            </List.Accordion>
          </View>
        </View>

        {showPrint ? (
          <View style={styles.inputWrapper}>
            <PrintComponents
              showHomeReturn={true}
              showPrintReceipt={true}
              showDownloadPdf={true}
              showExternalPrintReceipt={true}
              printObjectsArray={validationList}
              image={
                result.FlightBookingResult.FlightBookingSummaryModel
                  .FlightSummaryModel.FlightCombination.FlightModels[0]
                  .AirlineLogoUrl
              }
            />
          </View>
        ) : (
          <View style={styles.inputWrapper}>
            <GreenButton
              disabled={processing}
              processing={processing}
              text="Confirm Flight Book"
              onPress={() => setShowSummary(true)}
            />
          </View>
        )}

        <TransactionPin
          tokenLength={tokenLength}
          closModal={() => {
            setShowTransactionPin(false);
            setPin("");
          }}
          value={pin}
          setValue={(pin) => setPin(pin)}
          onPressContinue={() => confirmToken()}
          visible={showTransactionPin}
        />

        <Summary
          closModal={() => setShowSummary(false)}
          visible={showSummary}
          continueButtonText="Make Payment"
          onPressContinue={() => {
            setShowSummary(false);
            showPinModal();
          }}
          details={summaryList}
          total={Helper.formattedAmountWithNaira(amount)}
        />

        <Result
          closModal={() => setShowResult(false)}
          status={transactionStatus}
          userMessage={userMessage}
          visible={showResult}
        />
      </ScrollView>
    </View>
  );
}
