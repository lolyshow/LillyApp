import React, { Component } from "react";
import { Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import StartScreen from "./StartScreen";
import SaanaStartScreen from "./SaanaStartScreen";
import SaanaValidationScreen from "./SaanaValidationScreen";

import LCCStartScreen from "./LCCStartScreen";
import LCCValidationScreen from "./LCCValidationScreen";

import LurStartScreen from "./LurStartScreen";
import LurSecondPageScreen from "./LurSecondPageScreen";
import LurValidationScreen from "./LurValidationScreen";



const Stack = createStackNavigator();

export default class OndemandStack extends Component {
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
        <Stack.Screen name="Ondemand" component={StartScreen} />

        <Stack.Screen name="Saana.StartScreen" component={SaanaStartScreen} />
        <Stack.Screen name="Saana.Validation" component={SaanaValidationScreen} />

        
        <Stack.Screen name="LCC.StartScreen" component={LCCStartScreen} />
        <Stack.Screen name="LCC.Validation" component={LCCValidationScreen} />

       
        <Stack.Screen name="LUR.StartScreen" component={LurStartScreen} />
        <Stack.Screen name="LUR.SecondScreen" component={LurSecondPageScreen} />
       <Stack.Screen name="LUR.Validation" component={LurValidationScreen} />
        
      </Stack.Navigator>
    );
  }
}
