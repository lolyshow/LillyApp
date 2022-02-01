import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import BankStartScreen from "./BankStartScreen";
import CgateStartScreen from "./CgateStartScreen";
 import BankValidationScreen from "./BankValidationScreen";
 import CgateGeneratedReference from "./CgateGeneratedReference";




const Stack = createStackNavigator();



export default class BetStack extends Component{

  

  render(){
    return (
      
        <Stack.Navigator
            screenOptions={{
                title: null,
                // headerBackTitle :"Back",
                headerBackTitleVisible:false,
                headerShown: false
        }}
        >
         <Stack.Screen   name="BetAndLottery" component={StartScreen} /> 
         <Stack.Screen   name="BankCardless.StartScreen" component={BankStartScreen} /> 
         <Stack.Screen   name="Cgate.StartScreen" component={CgateStartScreen} /> 
         <Stack.Screen   name="BankCardless.Validation" component={BankValidationScreen} /> 
         <Stack.Screen   name="CgateGeneratedReference" component={CgateGeneratedReference} /> 
        </Stack.Navigator>
     
    );

  }
}

