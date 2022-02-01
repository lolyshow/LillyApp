import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import Info from "./Info";
import Password from "./Password";
import ConfirmEmail from "./ConfirmEmail";
// import Verification from "../Verification";





const Stack = createStackNavigator();



export default class RegistrationStack extends Component{

  

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
         <Stack.Screen   name="Registration.Info" component={Info} />
          <Stack.Screen  name="Registration.Password" component={Password} />
          <Stack.Screen  name="Registration.ConfirmEmail" component={ConfirmEmail} />
          
          
        </Stack.Navigator>
     
    );

  }
}

