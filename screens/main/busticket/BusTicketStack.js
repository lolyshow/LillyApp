import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
// import SummaryScreen from "./SummaryScreen";
import ValidationScreen from "./ValidationScreen";
// import TransactionPinScreen from "./TransactionPinScreen";
import BusCompaniesScreen from "./BusCompaniesScreen";
import BoardingFormScreen from "./BoardingForm";
import SelectSeatScreen from "./SelectSeatScreen";
import SelectReturnSeatScreen from "./SelectReturnSeatScreen";
import TicketDownloadScreen from "./TicketDownload";
import BusReturnCompaniesScreen from "./BusReturnCompaniesScreen";
import SearchScreen from "./SearchScreen";

const Stack = createStackNavigator();

export default class BusTicketStack extends Component {

  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          title: null,
          // headerBackTitle :"Back",
          headerBackTitleVisible: false,
          headerShown: false
        }}
      >
        <Stack.Screen name="BusTicket.StartScreen" component={StartScreen} />
        <Stack.Screen name="BusTicket.Validation" component={ValidationScreen} />
        {/* <Stack.Screen name="BusTicket.Summary" component={SummaryScreen} />
        <Stack.Screen name="BusTicket.TransactionPin" component={TransactionPinScreen} /> */}
        <Stack.Screen name="BusTicket.Buscompanies" component={BusCompaniesScreen} />
        <Stack.Screen name="BusTicket.Boardingform" component={BoardingFormScreen} />
        <Stack.Screen name="BusTicket.SelectSeat" component={SelectSeatScreen} />
        <Stack.Screen name="BusTicket.SelectReturnSeat" component={SelectReturnSeatScreen} />
        <Stack.Screen name="BusTicket.TicketDownload" component={TicketDownloadScreen} />
        <Stack.Screen name="BusTicket.ReturnBuses" component={BusReturnCompaniesScreen} />
        <Stack.Screen name="BusTicket.Search" component={SearchScreen} />
      </Stack.Navigator>
    );
  }
}

