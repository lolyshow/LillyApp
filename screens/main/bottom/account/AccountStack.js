import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
 import StartScreen from "./StartScreen";
 import Profile from "./Profile";
 import Contact from "./Contact";
 import Version from "./Version";
import Faq from "./Faq";
import Share from "./Share";
import BecomeAgent from "./BecomeAgent";
import Security from "./Security";
import Reset from "./Reset";
import ChangePin from "./ChangePin";
import CreatePInStart from "./CreatePInStart";
import ActivatePin from "./ActivatePin";
import DisablePin from "./DisablePin";
import SendMessage from "./SendMessage";
import Sales from "./Sales"

const Stack = createStackNavigator();

export default class AccountStack extends Component {

  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          title: null,
          // headerBackTitle :"Back",
          headerBackTitleVisible: false,
          headerShown: false
        }}
      >
        <Stack.Screen name="Account" component={StartScreen} />


        <Stack.Screen name="Account.Sales" component={Sales} />

        <Stack.Screen name="Account.Profile" component={Profile} />

        <Stack.Screen name="Account.Contact" component={Contact} />

        <Stack.Screen name="Account.AppVersion" component={Version} />
      
        <Stack.Screen name="Account.FAQ" component={Faq} />

        <Stack.Screen name="Account.Share" component={Share} />

        <Stack.Screen name="Account.Security" component={Security} />

        <Stack.Screen name="Account.Reset" component={Reset} />

        <Stack.Screen name="Account.CreatePIn" component={CreatePInStart} />

        <Stack.Screen name="Account.ActivatePin" component={ActivatePin} />

        <Stack.Screen name="Account.ChangePin" component={ChangePin} />

        <Stack.Screen name="Account.DisablePin" component={DisablePin} />

        <Stack.Screen name="Account.BecomeAgent" component={BecomeAgent} />

        <Stack.Screen name="Account.SendMessage" component={SendMessage} />
      
      </Stack.Navigator>
    );
  }
}

