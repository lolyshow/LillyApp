import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import StartScreen from "./StartScreen";

const Stack = createStackNavigator();

export default class DiscoStack extends Component {
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
        <Stack.Screen name="POS.StartScreen" component={StartScreen} />
      </Stack.Navigator>
    );
  }
}
