import axios from "axios";
import React, { Component } from "react";
import { Text, TextInput, View, Alert } from "react-native";

import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
// import Helper from "../../../../Helpers/InputBox";

export default class A extends Component {
  constructor() {
    super();

    this.state = {
      lga: "",
      address: "",
      state: "",
      number: "",
      images: [],
      dynamicForm: {},
      dynamicFormList: [],
    };
  }

  setDynamicForm(fieldPath, value) {
      console.log("filePath",fieldPath)
      console.log("Value",value)
      console.log("printData",this.state.dynamicForm)
    this.setState({
      dynamicForm: {
        ...this.state.dynamicForm,
        [fieldPath]: value,
      },
    });
  }

  getDynamicFields = async () => {
    let body = {
      action: "getUploadFields",
      categoryId: 1,
      subcategoryId: 4,
      userId: 62,
    };

    let dynamicForm = {};

    let url = "https://www.lillypayment.com/api/e-commerce";

    let response = await axios
      .post(url, body)
      .then((response) => response.data);

    if (response.properties) {
      response.properties.forEach((element) => {
        console.log("elementis",element)
        dynamicForm[element] = "";
      });
    //   Object.keys(this.state.dynamicForm).map(response.properties);
      this.setState({ dynamicForm, dynamicFormList: response.properties });
    }
  };

  validateDynamicForm = (form) => {
    let validate = Helper.propertiesAllSet(form);

    if (validate) {
      return true;
    } else {
      return false;
    }
  };

  submit = () => {
    let { lga, address, state, number, images, dynamicForm } = this.state;


    console.log(this.state)

    //validation static

    if (lga && address && state && number & images) {
      //validate dynamic
      let dynamicFormStatus = this.validateDynamicForm(dynamicForm);

      if (dynamicFormStatus) {
        //merge form here

        dynamicForm.lga = lga;
        dynamicForm.address = address;
        dynamicForm.state = state;
        dynamicForm.number = number;
        dynamicForm.images = images;

        // send form  afterwards
      } else {
        Alert.alert("Error", "Please fill in the empty fields");
      }
    } else {
      Alert.alert("Error", "Please fill in the empty fields");
    }
  };

  componentDidMount() {
    this.getDynamicFields();
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 30, backgroundColor: "#ffff" }}>
        {/* ---------------Static Form  ---------------------------------------------------------------*/}

        <View style={{ marginTop: 20 }}>
          <InputBox
            inputLabel="Address"
            placeholder="Enter Address"
            inputValue={this.state.address}
            onChangeText={(address) => {
              this.setState({ address });
            }}
          />
        </View>

        {/* ---------------End of  Form ------------------------------------------------------------------ */}

        {/* ---------------Dynamic Form ------------------------------------------------------------------- */}

         {this.state.dynamicFormList.map((item) => (
          <View style={{ marginTop: 20 }} key={item}>
            <InputBox
              inputLabel={item}
              placeholder={"Enter " + item}
              inputValue={this.state.dynamicForm[item]}
              onChangeText={(value) => this.setDynamicForm(item, value)}
            />
          </View>
        ))} 

       
        {/* ------------------End of dynamic Form  */}

        <View style={{ marginTop: 20 }}>
          <GreenButton text="Submit" onPress={() => this.submit()} />
        </View>
      </View>
    );
  }
}