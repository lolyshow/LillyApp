import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from "./StartScreen";
import  BankAccounts from "./BankAccounts";
import BankCollection from "./BankCollection";
import VirtualAccount from "./VirtualAccount";
import Ussd from "./Ussd";
import PaymentNotification from "./PaymentNotification";
import Card from "./Card";
import CardFund from "./CardFund";
import CardInitiate from "./CardInitiate";



const Stack = createStackNavigator();

export default class FundWalletStack extends Component {

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
        <Stack.Screen name="FundWallet.StartScreen" component={StartScreen} />
        <Stack.Screen name="FundWallet.BankAccounts" component={BankAccounts} />
        <Stack.Screen name="FundWallet.BankCollection" component={BankCollection} />
        <Stack.Screen name="FundWallet.VirtualAccount" component={VirtualAccount} />
        <Stack.Screen name="FundWallet.USSD" component={Ussd} />
        <Stack.Screen name="FundWallet.PaymentNotification" component={PaymentNotification} />
        <Stack.Screen name="FundWallet.Card" component={Card} />
        <Stack.Screen name="FundWallet.CardFund" component={CardFund} />


        <Stack.Screen name="FundWallet.CardInitiate" component={CardInitiate} />


        {/* <Stack.Screen name="FundWallet.List" component={TransferList} />
        <Stack.Screen name="FundWallet.Validation" component={ValidationScreen} /> */}
      </Stack.Navigator>
    );
  }
}

