import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import BetStartScreen from "./BetStartScreen";
import LotteryStartScreen from "./LotteryStartScreen";
 import BetValidationScreen from "./BetValidationScreen";




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
         {/* <Stack.Screen   name="BetAndLottery" component={StartScreen} />  */}
         <Stack.Screen   name="Bet.StartScreen" component={BetStartScreen} /> 
         <Stack.Screen   name="Lottery.StartScreen" component={LotteryStartScreen} /> 
         <Stack.Screen   name="Bet.Validation" component={BetValidationScreen} /> 
        </Stack.Navigator>
     
    );

  }
}

