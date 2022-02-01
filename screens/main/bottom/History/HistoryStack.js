import React, { Component } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
 import History from "./History";
 import ViewMore from "./ViewMore";

const Stack = createStackNavigator();

export default class HistoryStack extends Component {

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
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="History.ViewMore" component={ViewMore} />
      </Stack.Navigator>
    );
  }
}

