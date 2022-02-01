import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import ValidationScreen from "./ValidationScreen";




const Stack = createStackNavigator();



export default class DiscoStack extends Component{

  

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
         <Stack.Screen   name="Disco.StartScreen" component={StartScreen} /> 
         <Stack.Screen   name="Disco.Validation" component={ValidationScreen} /> 
  
        </Stack.Navigator>
     
    );

  }
}

