import React, { Component } from "react";
import { withNavigation } from '@react-navigation/native';
import { BackHandler } from "react-native";

class HandleBack extends Component {
  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", this.onBack)
    );
  }

  componentDidMount() {
    this.willBlur = this.props.navigation.addListener("willBlur", (payload) =>
      BackHandler.removeEventListener("hardwareBackPress", this.onBack)
    );
  }

  onBack = () => {
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

  componentWillUnmount() {
    this.didFocus.remove();
    this.willBlur.remove();
    BackHandler.removeEventListener("hardwareBackPress", this.onBack);
  }

  render() {
    return this.props.children;
  }
}

export default withNavigation(HandleBack);