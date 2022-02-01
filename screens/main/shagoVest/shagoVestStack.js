import React, { Component } from "react";
import { Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import StartScreen from "./StartScreen";

const Stack = createStackNavigator();

export default class shagoVestStack extends Component {
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
        <Stack.Screen name="shagoVest.StartScreen" component={StartScreen} />
      </Stack.Navigator>
    );
  }
}
