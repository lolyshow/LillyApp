import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import BorderedBackButton from "../../../../../components/BorderedBackButton";
import { ScrollView } from "react-native-gesture-handler";
import AntDez from "react-native-vector-icons/AntDesign";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import Helper from "../../../../../Helpers/Helper";
import SelectBox from "../../../../../components/SelectBox";
import Result from "../../../../../components/Result";
class CreateBrand extends Component {
  state = {
    email: "",
    password: "",
    photo: null,
    dynamicFormList: [
      "name",
      "phone",
      // "username",
      "address",
    ],
    dynamicForm: {},
    submisData: {},
    states: {},
    selected: "",
    showResult: false,
    userMessage: "",
    transactionStatus: "",
  };

  componentDidMount() {}

  handleEmail = (text) => {
    this.setState({ email: text });
  };
  handlePassword = (text) => {
    this.setState({ password: text });
  };
  login = (email, pass) => {
    alert("email: " + email + " password: " + pass);
  };

  setDynamicForm(fieldPath, value) {
    console.log("filePathLocation", fieldPath);
    console.log("ValueLocation", value);
    console.log("printDataLocation222", this.state.dynamicForm);
    this.setState({
      dynamicForm: {
        ...this.state.dynamicForm,
        [fieldPath]: value,
      },
    });
  }

  textRefine = (text) => {
    return text
      .replace(/_/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  };

  handleStateChange = (params) => {
    console.log("thisisJustATes", params);
    this.setState({ selected: params });
  };

  validateForm(obj) {
    let message = "";
    Object.entries(obj).map((item, index) => {
      console.log("thisiSthemsjsd", item);
      if (item[1] == "" || item[1] == null || item[1] == undefined) {
        message = item[0] + " is required";
        console.log("mymessgeGorsaad", message);
      }
    });
    if (message == "") {
      return "true";
    } else {
      return message;
    }
  }

  submitData() {
    console.log("dyndyndyn", this.state.dynamicForm);
    const object4 = {
      ...this.state.dynamicForm,
      userId: Helper.getPropValue(global, 'user.id'),
      /*global.user.id,*/ username: "this2",
      /*global.user.username,*/ action: "registerBrand",
    };

    let resp = this.validateForm(object4);

    // if(resp == "true"){
    if (
      this.state.name != "" &&
      this.state.phone != "" &&
      this.state.address != ""
    ) {
      console.log("insideCreateBrand", resp);
      fetch("https://www.lillypayment.com/api/e-commerce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "application/json",
          Origin: "*",
        },
        body: JSON.stringify(object4),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("uploadResponse", JSON.stringify(response));
          if (response.status) {
            if (response.status == "200") {
              Alert.alert("Create Brand", "Brand Created Successfully", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => this.props.navigation.navigate("ESellProduct"),
                },
              ]);
            } else {
              Alert.alert("Create Brand", " " + response.message.toString(), [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            }
          }
        })
        .catch((error) => {
          console.log("errormessage", error);
          console.log("error", error);
        });
    } else {
      Alert.alert("Create Brand", "Missing Fields Required", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }
  Capitalize(str) {
    let upperstr = str.charAt(0).toUpperCase() + str.slice(1);
    return <Text>{upperstr}</Text>;
  }

  render() {
    const { photo } = this.state;
    console.log("thisisPhoto", photo);
    const { states } = this.state;
    // let userID = global.user.id;
    // console.log("userIdss",userID)
    console.log(
      "previous state object",
      this.props.route.params.productProperty
    );
    console.log(
      "previous state Dynameobject",
      this.props.route.params.dynamicFormL
    );
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{}}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{"Create Brand"}</Text>
          </View>
        </View>

        <ScrollView style={{ margin: 20 }}>
          <Result
            closModal={() => this.setState({ showResult: false })}
            status={this.state.transactionStatus}
            userMessage={this.state.userMessage}
            visible={this.state.showResult}
          />

          {this.state.dynamicFormList.map((item) => (
            <View style={styles.textInputContainer} key={item}>
              {this.Capitalize(item)}
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                inputLabel={() => this.textRefine(item)}
                keyboardType={item == "phone" ? "numeric" : "default"}
                placeholder={"Enter " + this.textRefine(item)}
                inputValue={this.state.dynamicForm[item]}
                onChangeText={(value) => this.setDynamicForm(item, value)}
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.submitData()}
          >
            <Text style={styles.submitButtonText}>Submit Data </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default CreateBrand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 23,
    backgroundColor: "white",
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#eeededa8",
    marginTop: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  submitButton: {
    backgroundColor: "#3ebd2e",
    padding: 10,
    marginTop: 45,
    height: 50,
    // alignContent:'center',
    justifyContent: "center",
    // alignSelf:'center',
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
    paddingHorizontal: 20,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 28,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "normal",
    // lineHeight: 32,
    // letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
  textInputContainer: {
    marginTop: 20,
  },
  containerss: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    margin: 24,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerStyle: {
    height: 150,
    width: "80%",
    color: "#344953",
    justifyContent: "center",
  },
  uploadBox: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 0,
    margin: 10,
    borderRadius: 5,
    marginBottom: 0,
    height: 130,
    width: 160,
  },
});
