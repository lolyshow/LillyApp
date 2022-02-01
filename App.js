import React, { Component } from "react";

import { Platform } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import HomeBottomStack from "./screens/main/HomeBottomStack";

import SplashScreen from "./screens/Splash";

import StartScreen from "./screens/Start";

import Login from "./screens/Login";

import RegisterStack from "./screens/signup/RegistrationStack";

import ForgetPassword from "./screens/ForgetPassword";

import Terms from "./screens/Terms";

import Verification from "./screens/Verification";

import Tv from "./screens/main/tv/TvStack";

import Disco from "./screens/main/disco/DiscoStack";

import BetAndLottery from "./screens/main/bet/BetAndLotteryStack";

import CardlessStack from "./screens/main/cardless/CardlessStack";

import Airtime from "./screens/main/airtime/AirtimeStack";


import Data from "./screens/main/data/DataStack";

import HealthStack from "./screens/main/health/HealthStack";

import OndemandStack from "./screens/main/ondemand/OndemandStack";

import TransferStack from "./screens/main/transfers/TransferStack";

import FundWalletStack from "./screens/main/fundWallet/FundWalletStack";

import EducationStack from "./screens/main/education/EducationStack";

import BusTicketStack from "./screens/main/busticket/BusTicketStack";

import shagoVestStack from "./screens/main/shagoVest/shagoVestStack";

import FlightStack from "./screens/main/flight/FlightStack";

//E-commerce
import EProductProperty from "./screens/main/ecommerce/screens/sellScreens/ProductPropertyU";
import EProductLocationInfo from "./screens/main/ecommerce/screens/sellScreens/ProductLocationInfo";
import EOverview from "./screens/main/ecommerce/screens/sellScreens/Overview";
import CapaImagePicker from "./screens/main/ecommerce/screens/CapaImagePicker";
import EAllProduct from "./screens/main/ecommerce/screens/AllProduct";
import ECreateBrand from "./screens/main/ecommerce/screens/sellScreens/CreateBrand";
import EcomerceScreens from "./screens/main/ecommerce/MainEcomerceNavigator";
import ECategoryDetails from "./screens/main/ecommerce/screens/CategoryDetails";
import EBrowseCategories from "./screens/main/ecommerce/screens/BrowseCategory";
import ESubCategories from "./screens/main/ecommerce/screens/SubCategories";
import EproductDetails from "./screens/main/ecommerce/screens/ProductDetails";
import SellProduct from "./screens/main/ecommerce/screens/SellProduct";
//end of e-commerce

import { Provider, useSelector } from "react-redux";

import { store } from "./redux/store";

export default App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

const Stack = createStackNavigator();

function AppContainer() {
  const { loginStatus, showSplash } = useSelector((state) => state.reducers);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          title: null,
          // headerBackTitle :"Back",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height:50,
            // backgroundColor: "#431f59",
          },
          headerBackTitleVisible: false,
          headerLeft: Platform.select({
            ios: null,
          }),
          headerTitleStyle: {
            // color: "#ffffff",
          },
          headerShown: Platform.select({
            ios: true,
            android: false,
          }),
        }}
      >
        {!loginStatus ? (
          <>
            {showSplash && (
              <Stack.Screen name="Splash" component={SplashScreen}
              options={{
                // title: 'My home',
                headerStyle: {
                  backgroundColor: '#6951b3',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
              
              />
            )}
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{ headerLeft: null, headerStyle: {
                // backgroundColor: '#6951b3',
              },
               gesturesEnabled: false }}
            />

            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="Register" component={RegisterStack} />

            <Stack.Screen name="Verification" component={Verification} />

            <Stack.Screen name="Terms" component={Terms} />

            <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={HomeBottomStack} 
            options={{
              title: 'Home',
              
              headerStyle: {
                height:50,
                backgroundColor: '#42349d',
              },
              // headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
            
            />

            <Stack.Screen name="Tv" component={Tv} />

            <Stack.Screen name="Disco" component={Disco} />

            <Stack.Screen name="BetAndLottery" component={BetAndLottery} />

            <Stack.Screen name="Cardless" component={CardlessStack} />

            <Stack.Screen name="Health" component={HealthStack} />

            <Stack.Screen name="Ondemand" component={OndemandStack} />

            <Stack.Screen name="Education" component={EducationStack} />

            <Stack.Screen name="Airtime" component={Airtime} />

            <Stack.Screen name="Data" component={Data} />

            <Stack.Screen name="Transfers" component={TransferStack} />

            <Stack.Screen name="FundWallet" component={FundWalletStack} />

            <Stack.Screen name="BusTicket" component={BusTicketStack} />

            <Stack.Screen name="shagoVest" component={shagoVestStack} />

            <Stack.Screen name="FlightBooking" component={FlightStack} />

            <Stack.Screen name="Ecommerce" component={EcomerceScreens} />

            {/* /E-commerce */}
            <Stack.Screen
              name="EBrowseCategory"
              component={EBrowseCategories}
              options={{ title: "Browse Categories" }}
            />
            <Stack.Screen
              name="ECategoryDetails"
              component={ECategoryDetails}
              // options={{ title: "Browse Categories" }}
            />
            <Stack.Screen
              name="ESubCategories"
              component={ESubCategories}
              // options={{ title: "Browse Categories" }}
            />
            <Stack.Screen
              name="EproductDetails"
              component={EproductDetails}
              // options={{ title: "Browse Categories" }}
            />
            <Stack.Screen
              name="EProductProperty"
              component={EProductProperty}
              // options={{ title: "Product Property" }}
            />
            <Stack.Screen
              name="EProductLocationInfo"
              component={EProductLocationInfo}
              // options={{ title: "Product Location Property" }}
            />
            <Stack.Screen
              name="EAllProduct"
              component={EAllProduct}
              // options={{ title: "EAllProduct" }}
            />
            <Stack.Screen
              name="EOverview"
              component={EOverview}
              // options={{ title: "EAllProduct" }}
            />
            <Stack.Screen
              name="ECreateBrand"
              component={ECreateBrand}
              // options={{ title: "Create Brand" }}
            />

            <Stack.Screen
              name="ESellProduct"
              component={SellProduct}
              // options={{ title: "Sell Product" }}
            />
            {/* /E-commerce */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
