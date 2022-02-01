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
import Input from "react-native-input-style";
import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from "react-native-vector-icons/Octicons";
import FontAwes from "react-native-vector-icons/FontAwesome5";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchIcon from "@material-ui/icons/Search";
import AntDez from "react-native-vector-icons/AntDesign";
// import NumberFormat from 'react-number-format';
class Productcard extends Component {
  constructor(props) {
    super(props);
  }
  // return this.state.array.map((element) => {
  render() {
    var NumberFormat = require("react-number-format");

    // const image = this.props.image && this.props.image.length> 0 ? this.props.image[0].url: "../assets/images/laptop2.jpeg";
    const images =
      this.props.image && this.props.image.length > 0
        ? this.props.image[0].url
        : "../assets/images/laptop2.jpeg";
    let image = { uri: images };
    //console.log('imageIs', image);
    return (
      <View>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            marginLeft: 0,
            margin: 10,
            borderRadius: 10,
            marginBottom: 0,
            height: 150,
            width: 130,
          }}
        >
          <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
            <AntDez style={{ margin: 10 }} name="hearto" size={15} />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableHighlight
              onPress={this.props.onPressButton}
              onLongPress={this._onLongPressButton}
              underlayColor="white"
            >
              <Image source={image} style={{ width: 100, height: 100 }} />
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ maxWidth: 120 }}>
          {
            <NumberFormat
              value={this.props.amount}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₦"}
              color="red"
              renderText={(value) => (
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#07b736",
                  }}
                >
                  {value}
                </Text>
              )}
            />
          }
          <Text style={{ textAlign: "center" }}>{this.props.name} </Text>
        </View>
      </View>
    );
  }
}
export default Productcard;
