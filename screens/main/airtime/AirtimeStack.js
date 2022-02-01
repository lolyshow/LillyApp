import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
// import SummaryScreen from "./SummaryScreen";
import ValidationScreen from "./ValidationScreen";
// import TransactionPinScreen from "./TransactionPinScreen";

const Stack = createStackNavigator();

export default class AirtimeStack extends Component {

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
        <Stack.Screen name="Airtime.StartScreen" component={StartScreen} />
        <Stack.Screen name="Airtime.Validation" component={ValidationScreen} />
        {/* <Stack.Screen name="Airtime.Summary" component={SummaryScreen} /> */}
        {/* <Stack.Screen name="Airtime.TransactionPin" component={TransactionPinScreen} /> */}
      </Stack.Navigator>
    );
  }
}

