import React, { Component } from "react";
import { Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./StartScreen";
import Waec from "./Waec";
import Jamb from  "./Jamb"
import EducationValidationScreen from "./EducationValidationScreen";


const Stack = createStackNavigator();

export default class EducationStack extends Component {
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
        <Stack.Screen name="Education" component={StartScreen} />

        <Stack.Screen name="Education.Waec" component={Waec} />
        <Stack.Screen name="Education.Jamb" component={Jamb} />
        <Stack.Screen name="Education.Validation" component={EducationValidationScreen} />
       
 
        
      </Stack.Navigator>
    );
  }
}
