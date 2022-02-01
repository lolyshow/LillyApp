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
  Platform
} from "react-native";
import BorderedBackButton from "../../../../../components/BorderedBackButton";
import { ScrollView } from "react-native-gesture-handler";
import AntDez from "react-native-vector-icons/AntDesign";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import SelectBox from "../../../../../components/SelectBox";
import Helper from "../../../../../Helpers/Helper";
import InputBox from "../../../../../components/InputBox";
import ImgToBase64 from "react-native-image-base64";
class ProductLocationInfo extends Component {
  state = {
    email: "",
    password: "",
    photo: null,
    photo2: null,
    submisData: {},

    selected: "",
    photoBase64: [],
    states: [],
    lgas: [],
    state: "",
    lga: "",
    address: "",
    number: "",
  };

  componentDidMount() {
    this.loadStates();
  }

  handleEmail = (text) => {
    this.setState({ email: text });
  };
  handlePassword = (text) => {
    this.setState({ password: text });
  };
  login = (email, pass) => {
    alert("email: " + email + " password: " + pass);
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response);
      if (response.uri) {
        ImgToBase64.getBase64String(response.uri)
          .then((base64String) => this.state.photoBase64.push(base64String))

          .catch((err) => console.log(err));

        this.setState({ photo: response });
      }
    });
  };

  handleChoosePhoto2 = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response);
      if (response.uri) {
        ImgToBase64.getBase64String(response.uri)
          .then((base64String) => this.state.photoBase64.push(base64String))

          .catch((err) => console.log(err));

        this.setState({ photo2: response });
      }
    });
  };

  handleChoosePhoto3 = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response);
      if (response.uri) {
        ImgToBase64.getBase64String(response.uri)
          .then(
            (base64String) => this.state.photoBase64.push(base64String),
            console.log("done")
          )
          .catch((err) => console.log(err));

        this.setState({ photo3: response });
      }
    });
  };

  setDynamicForm(fieldPath, value) {
    console.log("filePathLocation", fieldPath);
    console.log("ValueLocation", value);
    console.log("printDataLocation", this.state.dynamicForm);
    this.setState({
      dynamicForm: {
        ...this.state.dynamicForm,
        [fieldPath]: value,
      },
    });
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  submitData() {
    let categoryId = this.props.route.params.category_id.toString();
    let subcategoryId = this.props.route.params.subcategoryId.toString();

    const object3 = {
      ...this.props.route.params.productProperty,
      number: this.state.number,
      address: this.state.address,
      state: this.state.state,
      lg: this.state.lga,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      userId: global.user.id.toString(),
    };

    console.log("filePathLocationnnn111", object3);

    console.log("thisisThePhotoMoving", this.state.photo);
    if (
      this.state.photo == null &&
      this.state.photo2 == null &&
      this.state.photo3 == null
    ) {
      Alert.alert("Missing Field", "please select a Photo", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else if (
      this.state.state == "" ||
      this.state.lga == "" ||
      this.state.number == "" ||
      this.state.address == ""
    ) {
      Alert.alert("Missing Field", "Missed fields are required", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      this.props.navigation.navigate("EOverview", {
        allInputData: object3,
        photo: this.state.photo,
        photo2: this.state.photo2,
        photo3: this.state.photo3,
        photoBase64: this.state.photoBase64,
      });
    }
  }

  handleStateChange = (params) => {
    console.log("thisisJustATes", params);
    this.setState({ selected: params });
  };

  stateList = () => {
    let list = [];

    this.state.states.forEach((item, index) => {
      list.push({ label: item.name, value: item.name, key: item.capital });
    });

    return list;
  };

  lgaList = () => {
    let list = [];

    let state = this.state.state;

    this.state.lgas.forEach((item, index) => {
      list.push({ label: item, value: item, key: item });
    });

    return list;
  };

  getStates = async () => {
    const response = await Helper.getStates().then((response) => response);

    if (response.error) {
      Alert.alert("Health", response.message.toString());

      return;
    }

    this.setState({ states: response.states });
  };

  getLga = async (state) => {
    const response = await Helper.getLga(state).then((response) => response);

    if (response.error) {
      Alert.alert("Health", response.message.toString());
      return;
    }

    this.setState({ lgas: response.lga });
  };

  onChangeState = (state) => {
    this.setState({ state, lga: "" });

    if (state) {
      this.getLga(state);
    }
  };

  loadStates() {
    //this.setState({loading: true});

    fetch("https://www.lillypayment.com/api/get-states", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
        Origin: "*",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ states: response });
        console.log("loadState", response);
        //this.setState({loading: false});
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("error", error);
      });
  }

  render() {
    const { photo } = this.state;
    const { photo2 } = this.state;
    const { photo3 } = this.state;
    console.log("thisisPhoto", photo);
    const { states } = this.state;
    console.log(
      "previous state object",
      this.props.route.params.productProperty
    );
    console.log("previousstateCatId", this.props.route.params.category_id);
    console.log("previousstateSubCatId", this.props.route.params.subcategoryId);

    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{ paddingHorizontal: 5 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{"Product Location Information"}</Text>
            {/* <Text style={styles.title}> Information</Text> */}
          </View>
        </View>

        <ScrollView
          style={{ paddingBottom: Platform.select({ ios: 150, android: 10 }) }}
        >
          <View style={styles.textInputContainer}>
            <Text>Shop Number</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="numeric"
              placeholder="Enter House Number"
              inputValue={this.state.number}
              onChangeText={(number) => this.setState({ number })}
            />
          </View>

          <View style={styles.textInputContainer}>
            <Text>Address</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              placeholder="Enter Address"
              inputValue={this.state.address}
              onChangeText={(address) => this.setState({ address })}
            />
          </View>

          <View>
            <SelectBox
              inputLabel="State of Residence"
              value={this.state.state}
              onValueChange={this.onChangeState}
              placeholder={{ label: "Select State", value: null }}
              items={this.stateList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <View style={{ margin: 10 }}>
            <SelectBox
              inputLabel="L.G.A of Residence"
              value={this.state.lga}
              onValueChange={(lga) => this.setState({ lga })}
              placeholder={{ label: "Select L.G.A", value: null }}
              items={this.lgaList()}
              iconColor="#17375e"
              iconSize={22}
            />
          </View>

          <ScrollView
            horizontal={true}
            style={{ flexDirection: "row", margin: 0 }}
          >
            <View style={styles.uploadBox}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight underlayColor="white">
                  {photo ? (
                    <Image
                      source={{ uri: photo.uri }}
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <MatComIcon
                      onPress={this.handleChoosePhoto}
                      style={{ margin: 10 }}
                      name="folder-upload"
                      size={40}
                    />
                  )}
                </TouchableHighlight>
                <Text style={{ textAlign: "center" }}>
                  Upload Product photo from Gallery
                </Text>
              </View>
            </View>

            <View style={styles.uploadBox}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  onPress={this.handleChoosePhoto2}
                  underlayColor="white"
                >
                  {photo2 ? (
                    <Image
                      source={{ uri: this.state.photo2.uri }}
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <MatComIcon
                      onPress={this.handleChoosePhoto2}
                      style={{ margin: 10 }}
                      name="folder-upload"
                      size={40}
                    />
                  )}
                </TouchableHighlight>
                <Text style={{ textAlign: "center" }}>
                  Upload Product photo from Gallery
                </Text>
              </View>
            </View>

            <View style={styles.uploadBox}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  onPress={this.handleChoosePhoto3}
                  underlayColor="white"
                >
                  {photo3 ? (
                    <Image
                      source={{ uri: photo3.uri }}
                      style={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <MatComIcon
                      onPress={this.handleChoosePhoto3}
                      style={{ margin: 10 }}
                      name="folder-upload"
                      size={40}
                    />
                  )}
                </TouchableHighlight>
                <Text style={{ textAlign: "center" }}>
                  Upload Product photo from Gallery
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={
              () => this.submitData() //this.props.navigation.navigate('EBrowseCategory',{userName: "home"})
              //this.login(this.state.email, this.state.password)
            }
          >
            <Text style={styles.submitButtonText}>Check Overview </Text>
          </TouchableOpacity>

          {/* </View> */}
        </ScrollView>
      </View>
    );
  }
}
export default ProductLocationInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 23,
    backgroundColor: "white",
    padding: 20,
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
    marginTop: 0,
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 70,
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
