import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwes from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/Ionicons";
import SellProduct from "../ecommerce/screens/SellProduct";

import ProductStack from "./screens/myProductsAndSubscription/ProductStack";
import HomeScreen from "./screens/Home";
import BrowseCategory from "./screens/BrowseCategory";

const Tab = createBottomTabNavigator();

export default class MainEcomerceNavigator extends Component {
  render() {
    return (
      <Tab.Navigator
        backBehaviour="initialRoute"
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "History") {
              iconName = focused ? "timer" : "timer-outline";
            } else if (route.name === "Notification") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Account") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#01cf13",
          inactiveTintColor: "#c7c7c7",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />

        <Tab.Screen
          name="BrowseCategory"
          component={BrowseCategory}
          options={{
            tabBarLabel: "Categories",
            tabBarIcon: ({ color }) => (
              <Entypo name="browser" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Sell"
          component={SellProduct}
          options={{
            tabBarLabel: "Sell",
            tabBarIcon: ({ color }) => (
              <Icon name="ios-add-circle-outline" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Subscription"
          component={ProductStack}
          options={{
            tabBarLabel: "My Products",
            tabBarIcon: ({ color }) => (
              <Icon name="notifications-outline" color={color} size={26} />
            ),
          }}
        />

        {/* <Tab.Screen name="Account" component={HomeScreen} /> */}
        {/* <Tab.Screen name="History" component={SettingsScreen} /> */}

        {/* <Tab.Screen name="Bills Pay" component={BillsPayment} 

          options={{
          tabBarLabel: 'BillesPay',
          tabBarIcon: ({ color }) => (
            <MatComIcon name="wallet" color={color} size={26}/>
          ),
        }}
          /> */}
        {/* <Tab.Screen name="TextDynamic" component={A} /> */}
      </Tab.Navigator>
    );
  }
}
