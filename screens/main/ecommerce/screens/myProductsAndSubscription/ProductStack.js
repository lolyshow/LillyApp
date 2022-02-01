import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./StartScreen";
import Subscriptions from "./Subscriptions";
import SubscriptionHistory from "./SubscriptionHistory";
import Products from "./Products";

const Stack = createStackNavigator();

export default class SubscriptionStack extends Component {
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
        <Stack.Screen name="Ecommerce.MyStartScreen" component={StartScreen} />
        <Stack.Screen name="Ecommerce.MyProducts" component={Products} />
        {/* <Stack.Screen name="Ecommerce.MySubscription" component={Subscriptions} /> */}
        <Stack.Screen name="Ecommerce.MySubscriptionHistory" component={SubscriptionHistory} />
        
      </Stack.Navigator>
    );
  }
}
