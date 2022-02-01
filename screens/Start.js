import React, { Component } from "react";

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  StatusBar,
} from "react-native";

import Logo from "../assets/lilly.png";

import displayIconBills from "../assets/Group5921.png";

import displayIconEcommerce from "../assets/ecomerce.png";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

import GreenButton from "../components/GreenButton";

import WhiteButton from "../components/WhiteButton";

import SwipeGestureComponents from "../components/SwipeGestureComponents";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-around"
  },

  logoWrapper: {
    // marginTop:30
  },

  displayIconWrapper: {
    //  marginTop:100
    alignSelf: "center",
  },

  lineWrapper: {
    // marginTop:40,

    flexDirection: "row",
    justifyContent: "space-around",
  },

  line: {
    width: 47,
    height: 0,
    opacity: 0.5,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "gray",
    marginLeft: 20,
  },

  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  IconTextWrapper: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  IconText: {
    width: 198,
    // height: 57,
    // fontFamily: "Gilroy",
    fontSize: 24,
    fontWeight: "600",
    fontStyle: "normal",
    // lineHeight: 28,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    fontStyle: "italic",
  },
});

const DisplayAds = ({ Icon, text }) => {
  return (
    <View>
      <View style={styles.displayIconWrapper}>
        <Image source={Ion} />
      </View>
      <View style={styles.IconTextWrapper}>
        <Text style={styles.IconText}>{text}</Text>
      </View>
    </View>
  );
};

export default class Start extends Component {
  constructor() {
    super();

    this.state = {
      Ads: [
        {
          icon: displayIconBills,
          text: "Bill payment just got easier!",
        },

        {
          icon: displayIconEcommerce,
          text: "E-commerce shop on the go!",
        },
      ],

      currentAdsPosition: 0,
    };
  }

  slideAds = (direction = "right") => {
    let adsLength = this.state.Ads.length - 1;
    let currentAdsPosition = this.state.currentAdsPosition;

    if (direction == "right") {
      if (currentAdsPosition < adsLength) {
        this.setState({ currentAdsPosition: currentAdsPosition + 1 });
      } else {
        this.setState({ currentAdsPosition: 0 });
      }
    } else {
      if (currentAdsPosition > 0) {
        this.setState({ currentAdsPosition: currentAdsPosition - 1 });
      } else {
        this.setState({ currentAdsPosition: adsLength });
      }
    }
  };

  backAction = () => {
    if (!this.props.navigation.isFocused()) {
      // let routeName = this.props.route.name;
      return false;
    }

    Alert.alert("Exit App", "Are you sure you want to exit this App?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this._interval = setInterval(() => this.slideAds(), 2000);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    clearInterval(this._interval);
  }

  onSwipePerformed = (action) => {
    switch (action) {
      case "left": {
        this.slideAds(action);
        break;
      }
      case "right": {
        this.slideAds(action);
        break;
      }
      case "up": {
        console.log("up Swipe performed");
        break;
      }
      case "down": {
        console.log("down Swipe performed");
        break;
      }
      default: {
        console.log("Undeteceted action");
      }
    }
  };

  render() {
    let { currentAdsPosition, Ads } = this.state;

    return (
      <View style={[styles.container]}>
        <StatusBar barStyle="light-content" backgroundColor={"#17375e"} />
        <View style={styles.logoWrapper}>
          <Image resizeMode="contain" style={{ height: 35 }} source={Logo} />
        </View>
        <View>
          {/* <SwipeGestureComponents onSwipePerformed={this.onSwipePerformed}> */}
          <View style={styles.displayIconWrapper}>
            <Image resizeMode="contain" source={Ads[currentAdsPosition].icon} />
          </View>
          <View style={styles.IconTextWrapper}>
            <Text style={styles.IconText}>{Ads[currentAdsPosition].text} </Text>
          </View>
          {/* </SwipeGestureComponents> */}
        </View>

        <View style={styles.lineWrapper}>
          {Ads.map((item, index) => {
            return (
              <Text
                onPress={() => this.setState({ currentAdsPosition: index })}
                key={index}
                style={[
                  styles.line,
                  index == currentAdsPosition ? { borderColor: "#01cf13" } : {},
                ]}
              ></Text>
            );
          })}
        </View>
        <View style={styles.buttonWrapper}>
          <View>
            <GreenButton
              text="Login"
              buttonWidth={120}
              onPress={() => this.props.navigation.navigate("Login")}
            />
          </View>

          <View style={{ marginLeft: 20 }}>
            <WhiteButton
              bordered
              text="Register"
              buttonWidth={120}
              onPress={() => this.props.navigation.navigate("Register")}
            />
          </View>
        </View>


        <View>
          <View>
            <Text style={{fontWeight:'bold', fontSize:40,color:'#676464',textDecorationLine: 'underline',}}>Guest</Text>
          </View>

        </View>
      </View>
    );
  }
}
