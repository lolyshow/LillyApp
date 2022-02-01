import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import ValidationScreen from "./ValidationScreen";




const Stack = createStackNavigator();



export default class HealthStack extends Component{

  

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
         <Stack.Screen   name="Health.StartScreen" component={StartScreen} /> 
         <Stack.Screen   name="Health.Validation" component={ValidationScreen} /> 
        </Stack.Navigator>
     
    );

  }
}

