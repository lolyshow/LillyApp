import React, { useEffect } from "react";
import { Alert, Linking, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./bottom/Settings";
import HistoryStack from "./bottom/History/HistoryStack";
import AccountStack from "./bottom/account/AccountStack";
import PosStack from "./bottom/posPurchase/PosStack";
import Notification from "./bottom/Notification";
import Helper from "../../Helpers/Helper";
const Tab = createBottomTabNavigator();

import { useSelector, useDispatch } from "react-redux";

import {
  getBalance,
  getNotifications,
  setProfilePicture,
  isSignedIn,
} from "../../redux/actions";
import Config from "../../Helpers/Config";

export default function HomeBottomStack() {
  const { notification, loginStatus } = useSelector((state) => state.reducers);

  const sessionTimeout = () => {
    let expiry = global.authTokenExpiry ?? null;
    if (expiry) {
      setTimeout(() => {
        dispatchLoginStatus(false);
        Alert.alert("Session Expired");
      }, expiry * 1000);
    }
  };

  const updateAppNotice = () => {
    try {
      const APP_STORE_LINK = "https://apps.apple.com/us/app/lillypay/id1577171850";
      const PLAY_STORE_LINK =
        "https://play.google.com/store/apps/details?id=com.lillypay";

      let storeName = Platform.select({
        ios: "app store",
        android: "play store",
      });

      Alert.alert(
        "Update Available",
        `There is a new version of LillyPay on ${storeName}, please continue to update`,
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Update Now",
            onPress: () => {
              if (Platform.OS == "ios") {
                Linking.openURL(APP_STORE_LINK).catch((err) =>
                  console.log("An error occurred", err)
                );
              } else {
                Linking.openURL(PLAY_STORE_LINK).catch((err) =>
                  console.log("An error occurred", err)
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const versionUpdate = async () => {
    try {
      let { error, version } = await Helper.getAppVersion().then((res) => res);
      if (error) {
        return false;
      }
      if (Helper.isAppVersionBehindLatest(version) && !Config.isPos) {
        updateAppNotice();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  const fetchNotification = () => {
    dispatch(getNotifications());
  };

  const setPic = (pic) => {
    dispatch(setProfilePicture(pic));
  };

  const dispatchLoginStatus = (status) => {
    dispatch(isSignedIn(status));
  };

  const fetchBalance = () => {
    dispatch(getBalance());
  };

  useEffect(() => {
    setPic(Helper.getPropValue(global, "user.pic") ?? null);
    fetchBalance(Helper.getPropValue(global, "wallet") ?? {});
    // sessionTimeout();
    Promise.all([fetchNotification(), versionUpdate()]);
  }, []);

  const count = Helper.getPropValue(notification, "count");

  const badgeCount = count && count != 0 ? count : null;

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
          } 
          else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          }
           else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "POS") {
            iconName = focused ? "calculator" : "calculator-outline";
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
      <Tab.Screen name="History" component={HistoryStack} />
      {/* <Tab.Screen
        options={{ tabBarBadge: badgeCount }}
        name="Notification"
        component={Notification}
      /> */}
      <Tab.Screen name="Account" component={AccountStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      {Config.isPos && <Tab.Screen name="POS" component={PosStack} />}
    </Tab.Navigator>
  );
}
