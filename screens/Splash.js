import React, { Component } from "react";

import {
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

import { store } from "../redux/store";

// import logoWatermark from "../assets/logoWatermark.png";

import Logo from "../assets/lilly2.png";

import SwipeGestureComponents from "../components/SwipeGestureComponents";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#431f59",
    justifyContent: "center",
    alignItems: "center",
  },
  StatusBar: {
    color: "#431f59",
  },
});

export default class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.gotToNextScreen();
    }, 2000);
  }

  gotToNextScreen = () => {
    // return this.props.navigation.navigate("Start");

    store.dispatch({
      type: "SHOW_SPLASH_SCREEN",
      payload: false,
    });
  };

  onSwipePerformed = (action) => {
    switch (action) {
      // case "left": {

      //   break;
      // }
      // case "right": {

      //   break;
      // }
      // case "up": {

      //   break;
      // }
      // case "down": {

      //   break;
      // }
      default: {
        this.gotToNextScreen();
      }
    }
  };
  render() {
    return (
      <SwipeGestureComponents
        gestureStyle={{ flex: 1 }}
        onSwipePerformed={this.onSwipePerformed}
      >
        <ImageBackground
          // source={logoWatermark}
          style={styles.container}
          imageStyle={{
            resizeMode: "contain",
            height: "55%",
            top: undefined,
            marginRight: "-25%",
          }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={styles.container.backgroundColor}
          />
          <Image resizeMode="contain" style={{ height: 45, width:200 }} source={Logo} />
        </ImageBackground>
      </SwipeGestureComponents>
    );
  }
}
