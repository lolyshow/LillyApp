import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
// import ValidationScreen from "./ValidationScreen";
import ValidationScreens from "./ValidateScreens";
import ValidateTv from "./ValidateTv";
import ShowMaxValidation from "./ShowMaxValidation";




const Stack = createStackNavigator();



export default class TvStack extends Component{

  

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
          <Stack.Screen   name="Tv.validate" component={ValidateTv} /> 
         <Stack.Screen   name="Tv.StartScreen" component={StartScreen} /> 
         <Stack.Screen   name="Tv.Validation" component={ValidationScreens} />
         {/* <Stack.Screen   name="Tv.Validation" component={ValidationScreen} /> */}
         <Stack.Screen   name="Tv.ShowMaxValidation" component={ShowMaxValidation} /> 
        </Stack.Navigator>
     
    );

  }
}

