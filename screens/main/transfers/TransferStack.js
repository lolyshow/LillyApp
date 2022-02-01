import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import TransferList from "./TransferList";
import ValidationScreen from "./ValidationScreen";


const Stack = createStackNavigator();

export default class TransferStack extends Component {

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
        <Stack.Screen name="Transfers.StartScreen" component={StartScreen} />
        <Stack.Screen name="Transfers.List" component={TransferList} />
        <Stack.Screen name="Transfers.Validation" component={ValidationScreen} />
      </Stack.Navigator>
    );
  }
}

