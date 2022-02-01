import React, { Component } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import BorderedBackButton from "../../../../../components/BorderedBackButton";
import { ScrollView } from "react-native-gesture-handler";
import Helper from "../../../../../Helpers/Helper";
// import Helper from "../../../Helpers/Helper";

class ProductPropertyU extends Component {
  state = {
    email: "",
    password: "",
    lga: "",
    address: "",
    state: "",
    number: "",
    images: [],
    dynamicForm: {},
    dynamicFormList: [],
    loading: false,
    registered: false,
  };

  componentDidMount() {
    this.getDynamicFields();
  }

  textRefine = (text) => {
    return text
      .replace(/_/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  };

  getDynamicFields = async () => {
    let body = {
      action: "getUploadFields",
      categoryId: this.props.route.params.category_id,
      subcategoryId: this.props.route.params.subcategoryid,
      userId: Helper.getPropValue(global, "user.id"),
    };

    let dynamicForm = {};

    let url = "https://www.lillypayment.com/api/e-commerce";
    this.setState({ loading: true });
    let response = await axios
      .post(url, body)
      .then((response) => response.data);

    if (response.properties) {
      this.setState({ registered: response.brandRegistered });
      this.setState({ loading: false });
      response.properties.forEach((element) => {
        console.log("elementis", element);
        dynamicForm[element] = "";
      });
      //   Object.keys(this.state.dynamicForm).map(response.properties);
      this.setState({ dynamicForm, dynamicFormList: response.properties });
    } else {
      this.setState({ loading: false });
    }
  };

  setDynamicForm(fieldPath, value) {
    console.log("filePath", fieldPath);
    console.log("Value", value);
    console.log("printData", this.state.dynamicForm);
    this.setState({
      dynamicForm: {
        ...this.state.dynamicForm,
        [fieldPath]: value,
      },
    });
  }

  checkProperties(obj) {
    let message = "";
    Object.entries(obj).map((item, index) => {
      if (item[1] == "" || item[1] == null || item[1] == undefined) {
        message = item[0] + " is required";
      }
    });
    if (message == "") {
      return "true";
    } else {
      return message;
    }
  }

  gotoProductLocationInfo() {
    let dynamicFormList = this.state.dynamicFormList;
    let productProperty = this.state.dynamicForm;
    let formFields = this.state.dynamicForm;
    let resp = this.checkProperties(formFields);
    // let resp = res.toString();
    console.log("ValidateResponseins", resp);
    if (resp == "true") {
      this.props.navigation.navigate(
        this.state.registered == true ? "EProductLocationInfo" : "ECreateBrand",
        {
          userName: "home",
          productProperty: productProperty,
          dynamicFormL: dynamicFormList,
          category_id: this.props.route.params.category_id,
          subcategoryId: this.props.route.params.subcategoryid,
        }
      );
    } else {
      Alert.alert("Missing Field Required", "Please fill all the fields", [
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

  Capitalize2(str) {
    let upperstr = str.charAt(0).toUpperCase() + str.slice(1);
    return upperstr;
  }

  handleEmail = (other, text) => {
    console.log("the text is", text);
    console.log("the other is", other);
    this.setState({ email: text });
  };
  handlePassword = (text) => {
    this.setState({ password: text });
  };
  login = (email, pass) => {
    alert("email: " + email + " password: " + pass);
  };
  render() {
    console.log(
      "category_idProductProperty",
      this.props.route.params.category_id
    );
    console.log(
      "SUBcategory_idProductProperTy",
      this.props.route.params.subcategoryid
    );

    console.log("ProductProsss", productProperty);
    console.log("dynamicFormList", this.state.dynamicFormList);
    console.log("brandRegistered", this.state.registered);
    let dynamicFormList = this.state.dynamicFormList;
    let productProperty = this.state.dynamicForm;
    let loading = this.state.loading;
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{ paddingHorizontal: 5 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{"Product Property"}</Text>
          </View>
        </View>
        {loading ? (
          <View>
            <View
              style={{
                alignSelf: "center",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    alignContent: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator color="#17375e" size="large" />
                  {/* <Text>Loading, Please wait...</Text> */}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: Platform.select({ ios: 150, android: 10 }),
            }}
          >
            {this.state.dynamicFormList.map((item) => (
              <View style={styles.textInputContainer} key={item}>
                {this.Capitalize(item)}
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  keyboardType={item == "amount" ? "numeric" : "default"}
                  inputLabel={() => this.textRefine(item)}
                  placeholder={"Enter " + this.textRefine(item)}
                  inputValue={this.state.dynamicForm[item]}
                  onChangeText={(value) => this.setDynamicForm(item, value)}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.gotoProductLocationInfo()}
            >
              <Text style={styles.submitButtonText}> Next </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      //EProductLocationInfo
    );
  }
}
export default ProductPropertyU;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#eeededa8",
    marginTop: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
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
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 40,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
  textInputContainer: {
    marginTop: 20,
  },
});
