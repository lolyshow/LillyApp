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
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Helper from "../../../Helpers/Helper";
import Network from "../../../Helpers/Network";
import WhiteButton from "../../../components/WhiteButton";
import Divider from "../../../components/Divider";
import { compareAsc, format } from "date-fns";
import InputBox from "../../../components/InputBox";
import DatePicker from "../../../components/DatePicker";
import ModalSelectBox from "../../../components/ModalSelectBox";
import GenderSelect from "../../../components/GenderSelect";

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

const adultTitles = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
  { label: "Ms", value: "Ms" },
];
const nonAdultTitles = [
  { label: "Mr", value: "Mr" },
  { label: "Ms", value: "Ms" },
];
const genderList = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const arrayElementsAllSet = (array) => {
  let result = true;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == null || array[i] == "") {
      result = false;
      break;
    }
  }
  return result;
};

export default function BookFlight(props) {
  const {
    result,
    requestNo,
    countries,
    isPassportRequired,
    bookingId,
  } = props.route.params;
  const [processing, setProcessing] = useState(false);
  const infants = result.FlightSummaryModel.FlightCombination.Infants;
  const children = result.FlightSummaryModel.FlightCombination.Children;
  const adults = result.FlightSummaryModel.FlightCombination.Adults;
  const messages = result.CustomMessages;
  const [checked, setChecked] = useState(false);

  const fillArrayForAllFields = new Array(adults + children + infants).fill(
    null
  );

  const fillArrayForAllDateFields = new Array(adults + children + infants).fill(
    new Date()
  );

  const visibility = new Array(adults + children + infants).fill(false);

  const passengerType = [
    ...new Array(adults).fill("Adult"),
    ...new Array(children).fill("Child"),
    ...new Array(infants).fill("Infant"),
  ];
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [address, setAddress] = useState(null);
  const [postal, setPostal] = useState(null);
  const [title, setTitle] = useState(fillArrayForAllFields);
  const [firstName, setFirstName] = useState(fillArrayForAllFields);
  const [middleName, setMiddleName] = useState(fillArrayForAllFields);
  const [lastName, setLastName] = useState(fillArrayForAllFields);
  const [gender, setGender] = useState(fillArrayForAllFields);
  const [dateOfBirth, setDateOfBirth] = useState(fillArrayForAllDateFields);
  const [showDateOfBirth, setShowDateOfBirth] = useState(visibility);
  const [passportIssuingAuthority, setPassportIssuingAuthority] = useState(
    fillArrayForAllFields
  );
  const [passportNumber, setPassportNumber] = useState(fillArrayForAllFields);
  const [passportExpiryDate, setPassportExpiryDate] = useState(
    fillArrayForAllDateFields
  );
  const [showPassportExpiryDate, setShowPassportExpiryDate] = useState(
    visibility
  );

  useEffect(() => {
    //
  }, []);

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
  const getCountries = () => {
    let list = [];
    countries.forEach((element) => {
      list.push({
        label: element,
        value: element,
      });
    });

    return list;
  };
  const submit = async () => {
    try {
      if (!checked) {
        return Alert.alert(
          "Error",
          "You need to click on terms and condition to proceed"
        );
      }

      if (!arrayElementsAllSet(title)) {
        return Alert.alert("Error", "Please select all title field");
      }

      if (!arrayElementsAllSet(firstName)) {
        return Alert.alert("Error", "Please enter all first name field");
      }

      if (!arrayElementsAllSet(lastName)) {
        return Alert.alert("Error", "Please enter all last name field");
      }

      if (!arrayElementsAllSet(dateOfBirth)) {
        return Alert.alert("Error", "Please enter all date of birth field");
      }

      if (!arrayElementsAllSet(gender)) {
        return Alert.alert("Error", "Please select all gender field");
      }

      if (isPassportRequired) {
        if (!arrayElementsAllSet(passportIssuingAuthority)) {
          return Alert.alert(
            "Error",
            "Please enter all passport issuing authority field"
          );
        }
        if (!arrayElementsAllSet(passportNumber)) {
          return Alert.alert("Error", "Please enter all passport number field");
        }

        if (!arrayElementsAllSet(passportExpiryDate)) {
          return Alert.alert(
            "Error",
            "Please enter all passport expiry date field"
          );
        }
      }

      if (email && phone && country && city && address && postal) {
        let body = {
          serviceCode: "WPB",
          requestNo: requestNo,
          firstName: firstName,
          lastName: lastName,
          middleName: middleName,
          title: title,
          country: country,
          address: address,
          city: city,
          postalCode: postal,
          passengerType: passengerType,
          dateOfBirth: dateOfBirth,
          phoneNumber: phone,
          gender: gender,
          email: email,
        };

        if (isPassportRequired) {
          body = {
            ...body,
            passportIssuingAuthority: passportIssuingAuthority,
            passportNumber: passportNumber,
            passportExpiryDate: passportExpiryDate,
          };
        }

        let url = Config.app_url;

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
          return props.navigation.navigate(
            "FlightBooking.ConfirmFlight",
            response
          );
        } else {
          return Alert.alert("Passenger Booking", message.toString());
        }
      } else {
        return Alert.alert("Passenger Booking", "Please enter all field");
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
            Booking Flight...{" "}
          </Text>
          <Icon name="plane-departure" color="#fff" size={30}></Icon>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <Header
        text={
          <>
            <Text>Flight Booking</Text>
          </>
        }
        backAction={() => props.navigation.goBack()}
      />
      <ScrollView>
        <Text style={{ alignSelf: "flex-end" }}>
          <Chip
            style={{
              backgroundColor: result.FlightSummaryModel.FlightCombination
                .IsRefundable
                ? "#01cf13"
                : "#f36952",
            }}
            textStyle={{ color: "#ffff" }}
          >
            {result.FlightSummaryModel.FlightCombination.IsRefundable
              ? ""
              : "Non"}{" "}
            Refundable
          </Chip>
        </Text>
        <List.Accordion
          title="Flight Details"
          //   left={(props) => <List.Icon {...props} icon="information" />}
        >
          <View style={styles.box}>
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
                          result.FlightSummaryModel.FlightCombination
                            .FlightModels[0].AirlineName
                        }
                      </Text>

                      <Text style={styles.text}>
                        {
                          result.FlightSummaryModel.FlightCombination
                            .FlightModels[0].Name
                        }{" "}
                        .{" "}
                        {
                          result.FlightSummaryModel.FlightCombination
                            .FlightModels[0].FlightLegs[0].CabinClass
                        }{" "}
                        .
                        {
                          result.FlightSummaryModel.FlightCombination
                            .FlightModels[0].FlightLegs[0].CabinClassName
                        }
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          result.FlightSummaryModel.FlightCombination
                            .FlightModels[0].AirlineLogoUrl,
                      }}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>

                  {result.FlightSummaryModel.FlightCombination.FlightModels[0].FlightLegs.map(
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
              {result.FlightSummaryModel.FlightCombination.FlightModels[1] && (
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
                            result.FlightSummaryModel.FlightCombination
                              .FlightModels[1].AirlineName
                          }
                        </Text>

                        <Text style={styles.text}>
                          {
                            result.FlightSummaryModel.FlightCombination
                              .FlightModels[1].Name
                          }{" "}
                          .{" "}
                          {
                            result.FlightSummaryModel.FlightCombination
                              .FlightModels[1].FlightLegs[0].CabinClass
                          }{" "}
                          .
                          {
                            result.FlightSummaryModel.FlightCombination
                              .FlightModels[1].FlightLegs[0].CabinClassName
                          }
                        </Text>
                      </View>
                      <Image
                        source={{
                          uri:
                            result.FlightSummaryModel.FlightCombination
                              .FlightModels[1].AirlineLogoUrl,
                        }}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>

                    {result.FlightSummaryModel.FlightCombination.FlightModels[1].FlightLegs.map(
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
                              Duration of :
                              {durationFormat(leavingLegs.Duration)}
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
                        result.FlightSummaryModel.FlightCombination
                          .PriceDetails[0].BaseFare.Amount
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {Helper.formattedAmountWithNaira(
                        result.FlightSummaryModel.FlightCombination
                          .PriceDetails[0].Tax.Amount
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {Helper.formattedAmountWithNaira(
                        result.FlightSummaryModel.FlightCombination.Price.Amount
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
            </View>
            <View style={{ marginVertical: 5 }}>
              <List.Accordion title="Fare Rules" expanded={true}>
                {result.FlightSummaryModel.FlightCombination.FareRules.map(
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
        </List.Accordion>

        <List.Accordion
          title="Travel Information"
          //   left={(props) => <List.Icon {...props} icon="information" />}
        >
          <View>
            {messages.map((message, index) => (
              <View key={"#" + index} style={styles.messageBox}>
                <Text style={{ color: "#ffff", fontSize: 13 }}>
                  {" "}
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    <Icon name="info-circle" color="#fff" size={13}></Icon>{" "}
                    {message.Title}
                  </Text>
                  : {message.Message}{" "}
                </Text>
              </View>
            ))}
          </View>
        </List.Accordion>
        <View style={{ marginVertical: 20 }}>
          <View style={[styles.inputWrapper]}>
            <TouchableOpacity
              onPress={() => {
                setChecked(!checked);
              }}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Agree Terms & Condition </Text>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <InputBox
              placeholder="Enter Email Address"
              inputLabel="Email"
              keyboardType="default"
              inputValue={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              placeholder="Enter Phone Number"
              inputLabel="Phone"
              keyboardType="phone-pad"
              inputValue={phone}
              onChangeText={(phone) => setPhone(phone)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text
              style={[styles.flightText, { textAlign: "center", fontSize: 18 }]}
            >
              {adults + children + infants} Passenger(s)
            </Text>
          </View>

          <View>
            {new Array(adults).fill(null).map((item, index) => (
              <View style={[]} key={"adult" + index}>
                <View style={{ marginVertical: 10 }}>
                  <Text style={[styles.flightText, { textAlign: "center" }]}>
                    {index == 0
                      ? "Adult Lead Passenger"
                      : "Adult Passenger " + (index + 1)}
                  </Text>
                </View>
                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Title"
                    value={title[index]}
                    onValueChange={(text) => {
                      var copy = title.slice();
                      copy[index] = text;
                      setTitle(copy);
                    }}
                    placeholder={{ label: "Select title", value: null }}
                    items={adultTitles}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />

                  <InputBox
                    placeholder="Enter First Name"
                    inputLabel="First Name"
                    keyboardType="default"
                    inputValue={firstName[index]}
                    onChangeText={(text) => {
                      var copy = firstName.slice();
                      copy[index] = text;
                      setFirstName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <InputBox
                    placeholder="Enter Last Name"
                    inputLabel="Last Name"
                    keyboardType="default"
                    inputValue={lastName[index]}
                    onChangeText={(text) => {
                      var copy = lastName.slice();
                      copy[index] = text;
                      setLastName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                  <InputBox
                    placeholder="Enter Middle Name"
                    inputLabel="Middle Name"
                    keyboardType="default"
                    inputValue={middleName[index]}
                    onChangeText={(text) => {
                      var copy = middleName.slice();
                      copy[index] = text;
                      setMiddleName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Gender"
                    value={gender[index]}
                    onValueChange={(text) => {
                      var copy = gender.slice();
                      copy[index] = text;
                      setGender(copy);
                    }}
                    placeholder={{ label: "Select Gender", value: null }}
                    items={genderList}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />
                  <DatePicker
                    value={dateOfBirth[index]}
                    onDateChange={(event, selectedDate) => {
                      let currentDate = selectedDate || dateOfBirth[index];
                      var copy = dateOfBirth.slice();
                      var copyShow = showDateOfBirth.slice();
                      copy[index] = currentDate;
                      copyShow[index] = Platform.OS === "ios" && false;
                      setShowDateOfBirth(copyShow);
                      setDateOfBirth(copy);
                    }}
                    label="Date of Birth"
                    showDate={showDateOfBirth[index]}
                    showDatePicker={() => {
                      var copy = showDateOfBirth.slice();
                      copy[index] = true;
                      setShowDateOfBirth(copy);
                    }}
                    maxDate={new Date()}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                {isPassportRequired && (
                  <>
                    <View style={styles.formColumn}>
                      <InputBox
                        placeholder="Enter Passport Issuing Authority"
                        inputLabel="Passport Issuing Authority"
                        keyboardType="default"
                        inputValue={passportIssuingAuthority[index]}
                        onChangeText={(text) => {
                          var copy = passportIssuingAuthority.slice();
                          copy[index] = text;
                          setPassportIssuingAuthority(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                      <InputBox
                        placeholder="Enter Passport Number"
                        inputLabel="Passport Number"
                        keyboardType="default"
                        inputValue={passportNumber[index]}
                        onChangeText={(text) => {
                          var copy = passportNumber.slice();
                          copy[index] = text;
                          setPassportNumber(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>

                    <View style={[styles.inputWrapper]}>
                      <DatePicker
                        value={passportExpiryDate[index]}
                        onDateChange={(event, selectedDate) => {
                          let currentDate =
                            selectedDate || passportExpiryDate[index];
                          var copy = passportExpiryDate.slice();
                          copy[index] = currentDate;
                          //   setShowReturnDatePickerPicker(Platform.OS === "ios");
                          setPassportExpiryDate(copy);
                        }}
                        label="Passport Expiry Date"
                        showDate={showPassportExpiryDate[index]}
                        showDatePicker={() => {
                          var copy = showPassportExpiryDate.slice();
                          copy[index] = true;
                          setShowPassportExpiryDate(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                        maxDate={new Date()}
                      />
                    </View>
                  </>
                )}

                {index === 0 && (
                  <>
                    <View style={styles.formColumn}>
                      <SelectBox
                        inputLabel="Nationality"
                        value={country}
                        onValueChange={(text) => {
                          setCountry(text);
                        }}
                        placeholder={{ label: "Select country", value: null }}
                        items={getCountries()}
                        iconColor="#17375e"
                        inputWidth={screenWidth * 0.43}
                      />
                      <InputBox
                        placeholder="Enter City"
                        inputLabel="City"
                        keyboardType="default"
                        inputValue={city}
                        onChangeText={(text) => {
                          setCity(text);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>

                    <View style={styles.formColumn}>
                      <InputBox
                        placeholder="Enter Address"
                        inputLabel="Address"
                        keyboardType="default"
                        inputValue={address}
                        onChangeText={(text) => {
                          setAddress(text);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                      <InputBox
                        placeholder="Enter Postal Code"
                        inputLabel="Postal Code"
                        keyboardType="default"
                        inputValue={postal}
                        onChangeText={(text) => {
                          setPostal(text);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>
                  </>
                )}
                <Divider
                  style={{
                    marginVertical: 5,
                    backgroundColor: "#d3d3d3",
                  }}
                />
              </View>
            ))}

            {new Array(children).fill(null).map((item, index) => (
              <View style={[]} key={"adult" + index}>
                <View style={{ marginVertical: 10 }}>
                  <Text style={[styles.flightText, { textAlign: "center" }]}>
                    {"Child Passenger " + (index + 1)}
                  </Text>
                </View>
                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Title"
                    value={title[index + adults]}
                    onValueChange={(text) => {
                      var copy = title.slice();
                      copy[index + adults] = text;
                      setTitle(copy);
                    }}
                    placeholder={{ label: "Select title", value: null }}
                    items={nonAdultTitles}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />

                  <InputBox
                    placeholder="Enter First Name"
                    inputLabel="First Name"
                    keyboardType="default"
                    inputValue={firstName[index + adults]}
                    onChangeText={(text) => {
                      var copy = firstName.slice();
                      copy[index + adults] = text;
                      setFirstName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <InputBox
                    placeholder="Enter Last Name"
                    inputLabel="Last Name"
                    keyboardType="default"
                    inputValue={lastName[index + adults]}
                    onChangeText={(text) => {
                      var copy = lastName.slice();
                      copy[index + adults] = text;
                      setLastName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                  <InputBox
                    placeholder="Enter Middle Name"
                    inputLabel="Middle Name"
                    keyboardType="default"
                    inputValue={middleName[index + adults]}
                    onChangeText={(text) => {
                      var copy = middleName.slice();
                      copy[index + adults] = text;
                      setMiddleName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Gender"
                    value={gender[index + adults]}
                    onValueChange={(text) => {
                      var copy = gender.slice();
                      copy[index + adults] = text;
                      setGender(copy);
                    }}
                    placeholder={{ label: "Select Gender", value: null }}
                    items={genderList}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />
                  <DatePicker
                    value={dateOfBirth[index + adults]}
                    onDateChange={(event, selectedDate) => {
                      let currentDate =
                        selectedDate || dateOfBirth[index + adults];
                      var copy = dateOfBirth.slice();
                      copy[index + adults] = currentDate;
                      //   setShowReturnDatePickerPicker(Platform.OS === "ios");
                      setDateOfBirth(copy);
                    }}
                    label="Date of Birth"
                    showDate={showDateOfBirth[index + adults]}
                    showDatePicker={() => {
                      var copy = showDateOfBirth.slice();
                      copy[index + adults] = true;
                      setShowDateOfBirth(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                    maxDate={new Date()}
                  />
                </View>

                {isPassportRequired && (
                  <>
                    <View style={styles.formColumn}>
                      <InputBox
                        placeholder="Enter Passport Issuing Authority"
                        inputLabel="Passport Issuing Authority"
                        keyboardType="default"
                        inputValue={passportIssuingAuthority[index + adults]}
                        onChangeText={(text) => {
                          var copy = passportIssuingAuthority.slice();
                          copy[index + adults] = text;
                          setPassportIssuingAuthority(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                      <InputBox
                        placeholder="Enter Passport Number"
                        inputLabel="Passport Number"
                        keyboardType="default"
                        inputValue={passportNumber[index + adults]}
                        onChangeText={(text) => {
                          var copy = passportNumber.slice();
                          copy[index + adults] = text;
                          setPassportNumber(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>

                    <View style={[styles.inputWrapper]}>
                      <DatePicker
                        value={passportExpiryDate[index + adults]}
                        onDateChange={(event, selectedDate) => {
                          let currentDate =
                            selectedDate || passportExpiryDate[index + adults];
                          var copy = passportExpiryDate.slice();
                          copy[index + adults] = currentDate;
                          //   setShowReturnDatePickerPicker(Platform.OS === "ios");
                          setPassportExpiryDate(copy);
                        }}
                        label="Passport Expiry Date"
                        showDate={showPassportExpiryDate[index + adults]}
                        showDatePicker={() => {
                          var copy = showPassportExpiryDate.slice();
                          copy[index + adults] = true;
                          setShowPassportExpiryDate(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>
                  </>
                )}

                <Divider
                  style={{
                    marginVertical: 5,
                    backgroundColor: "#d3d3d3",
                  }}
                />
              </View>
            ))}

            {new Array(infants).fill(null).map((item, index) => (
              <View style={[]} key={"adult" + index}>
                <View style={{ marginVertical: 10 }}>
                  <Text style={[styles.flightText, { textAlign: "center" }]}>
                    {"Infant Passenger " + (index + 1)}
                  </Text>
                </View>
                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Title"
                    value={title[index + adults + children]}
                    onValueChange={(text) => {
                      var copy = title.slice();
                      copy[index + adults + children] = text;
                      setTitle(copy);
                    }}
                    placeholder={{ label: "Select title", value: null }}
                    items={nonAdultTitles}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />

                  <InputBox
                    placeholder="Enter First Name"
                    inputLabel="First Name"
                    keyboardType="default"
                    inputValue={firstName[index + adults + children]}
                    onChangeText={(text) => {
                      var copy = firstName.slice();
                      copy[index + adults + children] = text;
                      setFirstName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <InputBox
                    placeholder="Enter Last Name"
                    inputLabel="Last Name"
                    keyboardType="default"
                    inputValue={lastName[index + adults + children]}
                    onChangeText={(text) => {
                      var copy = lastName.slice();
                      copy[index + adults + children] = text;
                      setLastName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                  <InputBox
                    placeholder="Enter Middle Name"
                    inputLabel="Middle Name"
                    keyboardType="default"
                    inputValue={middleName[index + adults + children]}
                    onChangeText={(text) => {
                      var copy = middleName.slice();
                      copy[index + adults + children] = text;
                      setMiddleName(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                <View style={styles.formColumn}>
                  <SelectBox
                    inputLabel="Gender"
                    value={gender[index + adults + children]}
                    onValueChange={(text) => {
                      var copy = gender.slice();
                      copy[index + adults + children] = text;
                      setGender(copy);
                    }}
                    placeholder={{ label: "Select Gender", value: null }}
                    items={genderList}
                    iconColor="#17375e"
                    inputWidth={screenWidth * 0.43}
                  />
                  <DatePicker
                    value={dateOfBirth[index + adults + children]}
                    onDateChange={(event, selectedDate) => {
                      let currentDate =
                        selectedDate || dateOfBirth[index + adults + children];
                      var copy = dateOfBirth.slice();
                      copy[index + adults + children] = currentDate;
                      //   setShowReturnDatePickerPicker(Platform.OS === "ios");
                      setDateOfBirth(copy);
                    }}
                    label="Date of Birth"
                    showDate={showDateOfBirth[index + adults + children]}
                    showDatePicker={() => {
                      var copy = showDateOfBirth.slice();
                      copy[index + adults + children] = true;
                      setShowDateOfBirth(copy);
                    }}
                    inputWidth={screenWidth * 0.43}
                  />
                </View>

                {isPassportRequired && (
                  <>
                    <View style={styles.formColumn}>
                      <InputBox
                        placeholder="Enter Passport Issuing Authority"
                        inputLabel="Passport Issuing Authority"
                        keyboardType="default"
                        inputValue={
                          passportIssuingAuthority[index + adults + children]
                        }
                        onChangeText={(text) => {
                          var copy = passportIssuingAuthority.slice();
                          copy[index + adults + children] = text;
                          setPassportIssuingAuthority(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                      <InputBox
                        placeholder="Enter Passport Number"
                        inputLabel="Passport Number"
                        keyboardType="default"
                        inputValue={passportNumber[index + adults + children]}
                        onChangeText={(text) => {
                          var copy = passportNumber.slice();
                          copy[index + adults + children] = text;
                          setPassportNumber(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>

                    <View style={[styles.inputWrapper]}>
                      <DatePicker
                        value={passportExpiryDate[index + adults + children]}
                        onDateChange={(event, selectedDate) => {
                          let currentDate =
                            selectedDate ||
                            passportExpiryDate[index + adults + children];
                          var copy = passportExpiryDate.slice();
                          copy[index + adults + children] = currentDate;
                          //   setShowReturnDatePickerPicker(Platform.OS === "ios");
                          setPassportExpiryDate(copy);
                        }}
                        label="Passport Expiry Date"
                        showDate={
                          showPassportExpiryDate[index + adults + children]
                        }
                        showDatePicker={() => {
                          var copy = showPassportExpiryDate.slice();
                          copy[index + adults + children] = true;
                          setShowPassportExpiryDate(copy);
                        }}
                        inputWidth={screenWidth * 0.43}
                      />
                    </View>
                  </>
                )}

                <Divider
                  style={{
                    marginVertical: 5,
                    backgroundColor: "#d3d3d3",
                  }}
                />
              </View>
            ))}
          </View>
          <View style={[styles.inputWrapper]}>
            <GreenButton
              disabled={processing}
              processing={processing}
              text="Book"
              onPress={submit}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
