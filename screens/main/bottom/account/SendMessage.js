import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import ImgToBase64 from "react-native-image-base64";
import Icon from "react-native-vector-icons/Ionicons";
import InputBox from "../../../../components/InputBox";
import GreenButton from "../../../../components/GreenButton";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import WhiteButton from "../../../../components/WhiteButton";
import Header from "../../../../components/Header";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";
import * as ImagePicker from "react-native-image-picker";
import Helper from "../../../../Helpers/Helper";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  inputWrapper: {
    flexDirection: "column",

    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  formRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  rowField: {
    // alignSelf:'stretch'
  },
});

export default class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      firstname: "",
      lastname: "",
      state: "",
      walletId: "",
      lga: "",
      email: "",
      phone: "",
      message: "",
      subject: "",
      photoBase64: "",
      uploadName: "",
      uploading: false,
      uploadInfo: {},
    };
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.file) {
        let size = Math.ceil(response.fileSize / 1000 / 1000);

        if (size > 5) {
          this.setState({ uploading: false });
          return Alert.alert(
            "Upload Picture",
            "Upload size should not be more than 5MB. Your upload size is " +
              size +
              "MB"
          );
        }
      }

      if (response.uri) {
        ImgToBase64.getBase64String(response.uri)

          .then((base64String) => this.setState({ photoBase64: base64String }))

          .catch((err) => console.log(err));

        this.setState({ uploadInfo: response });
      }

      if (response.didCancel) {
        this.setState({ uploading: false });
      }
    });
  };

  componentDidMount() {
    let { firstname, lastname, state, lga, email, phone } = global.user;

    let { code } = global.wallet;

    this.setState({
      firstname,
      lastname,
      state,
      lga,
      email,
      phone,
      walletId: code,
    });
  }

  submit = async () => {
    try {
      let {
        firstname,
        lastname,
        state,
        lga,
        email,
        phone,
        walletId,
        message,
        subject,
        photoBase64,
      } = this.state;

      if (message && subject) {
        let body = {
          serviceCode: "CTU",
          message,
          subject,
          firstname,
          lastname,
          state,
          lga,
          email,
          phone,
          walletId,
          attachment: photoBase64,
        };

        let url = Config.app_url;

        this.setState({ processing: true });

        let { error, errorMessage, response } = await new Network().post(
          url,
          body
        );

        this.setState({ processing: false });

        if (error) {
          return Alert.alert("Contact Us", errorMessage);
        }

        if (response.status == "200") {
          this.setState({
            message: "",
            subject: "",
            photoBase64: null,
            uploadInfo: {},
          });

          Alert.alert("Contact Us", response.message.toString());
        } else {
          Alert.alert("Contact Us", response.message.toString());
        }
      } else {
        Alert.alert("Contact Us", "Please fill in the empty fields");
      }
    } catch (error) {
      this.setState({ processing: false });
      Alert.alert("Contact Us", error.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header
            text="Contact Us"
            backAction={() => this.props.navigation.goBack()}
          />

          {/* <View style={{ marginBottom: 30 }}>
            <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
            />
          </View> */}

          <View style={styles.inputWrapper}>
            <View style={styles.formRow}>
              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(firstname) => this.setState({ firstname })}
                  inputValue={this.state.firstname}
                  inputLabel="First Name"
                  inputWidth={screenWidth * 0.36}
                  placeholder="Enter First Name"
                  editable={false}
                />
              </View>

              <View style={styles.rowField}>
                <InputBox
                  keyboardType="default"
                  onChangeText={(lastname) => this.setState({ lastname })}
                  inputValue={this.state.lastname}
                  inputLabel="Last Name"
                  placeholder="Enter Last Name"
                  inputWidth={screenWidth * 0.36}
                  editable={false}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="email-address"
              onChangeText={(email) => this.setState({ email })}
              inputValue={this.state.email}
              inputLabel="Email Address"
              placeholder="Enter Your Email Address"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="number-pad"
              onChangeText={(phone) => this.setState({ phone })}
              inputValue={this.state.phone}
              inputLabel="Phone"
              placeholder="Enter Phone Number"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(walletId) => this.setState({ walletId })}
              inputValue={this.state.walletId}
              inputLabel="User Wallet ID"
              placeholder="User Wallet ID"
              editable={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(subject) => this.setState({ subject })}
              inputValue={this.state.subject}
              inputLabel="Subject"
              placeholder="Subject"
            />
          </View>

          <View style={styles.inputWrapper}>
            <InputBox
              keyboardType="default"
              onChangeText={(message) => this.setState({ message })}
              inputValue={this.state.message}
              inputLabel="Message"
              placeholder="Message"
              multiline={true}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                  <Icon name="attach-outline" size={40} />
                  <Text>Attach Photo/Screenshot</Text>
                </TouchableOpacity>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text>
                  {Helper.getPropValue(this.state.uploadInfo, "uri") && (
                    <Image
                      source={{ uri: this.state.uploadInfo.uri }}
                      resizeMode="contain"
                      style={{ width: 80, height: 80 }}
                    />
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.submitButtonWrapper}>
            <GreenButton
              text="Send Message"
              disabled={this.state.processing}
              processing={this.state.processing}
              onPress={() => this.submit()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
