import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SearchFlight from "./SearchFlight";
import SelectFlight from "./SelectFlight";
import SelectFlightDetails from "./SelectFlightDetails";
import BookFlight from "./BookFlight";
import ConfirmFlight from "./ConfirmFlight";


const Stack = createStackNavigator();

export default class FlightStack extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          title: null,
          // headerBackTitle :"Back",
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="FlightBooking.SearchFlight"
          component={SearchFlight}
        />
        <Stack.Screen
          name="FlightBooking.SelectFlight"
          component={SelectFlight}
        />
        <Stack.Screen
          name="FlightBooking.SelectFlightDetails"
          component={SelectFlightDetails}
        />
        <Stack.Screen name="FlightBooking.BookFlight" component={BookFlight} />
        <Stack.Screen
          name="FlightBooking.ConfirmFlight"
          component={ConfirmFlight}
        />
      </Stack.Navigator>
    );
  }
}
