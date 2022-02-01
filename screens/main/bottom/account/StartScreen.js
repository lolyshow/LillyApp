import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";

import { store } from "../../../../redux/store";

import Logo from "../../../../assets/log_trsp.png";
import GreenButton from "../../../../components/GreenButton";
import WhiteButton from "../../../../components/WhiteButton";
import Helper from "../../../../Helpers/Helper";
import * as ImagePicker from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";
import { connect } from "react-redux";
import { getBalance, setProfilePicture } from "../../../../redux/actions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 40,
  },

  headerContainer: {
    backgroundColor: "#f7faff",
    paddingHorizontal: 30,
    paddingVertical: 30,

    marginBottom: 30,
  },

  accountText: {
    fontSize: 19,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  amountText: {
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    paddingTop: 5,
  },

  logo: {
    width: 45,
    height: 35,
  },

  headerFirstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerSecondRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  headerThirdRow: {
    alignItems: "center",
    marginBottom: 20,
  },

  headerFourth: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  headerFifth: {
    paddingHorizontal: "5%",
    marginBottom: 20,
  },
  headerSixth: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  profilePicRoundBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,

    borderWidth: 5,
    borderColor: "#dbefff",
    paddingRight: 0,
    marginRight: 0,
  },
  penShadow: {
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "#ffffff",
    shadowRadius: 30,
    shadowOpacity: 1,

    borderWidth: 5,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    marginLeft: -20,
    marginTop: -10,
    paddingLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  profilePic: {
    justifyContent: "center",
    alignItems: "center",
  },

  shagoBlue: {
    color: "#17375e",
  },

  labelGrey: {
    color: "#acacac",
  },

  accountType: {
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
  },

  line: {
    height: 0,

    borderWidth: 1,
    borderColor: "#dce7f4",
  },

  footerWrapper: {
    paddingVertical: 50,
    paddingHorizontal: 30,
  },

  buttonWrapper: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DATA: [
        {
          label: "Profile",
          route: "Account.Profile",
        },

        {
          label: "Account Sales",
          route: "Account.Sales",
        },
        {
          label: "Security",
          route: "Account.Security",
        },
        {
          label: "Contact Us",
          route: "Account.Contact",
        },

        {
          label: "Share With A Friend",
          route: "Account.Share",
        },

        {
          label: "FAQ",
          route: "Account.FAQ",
        },

        {
          label: "App Version",
          route: "Account.AppVersion",
        },
      ],
      fetchingBalance: false,
      uploadPic: null,
      photoBase64: null,
      uploading: false,
      uploadInprogress: false,
      signingOut: false,
      wallet: Helper.getPropValue(global, "wallet.code") ?? "",
      name: "",
      level: "",
      pos_wallet_status: "",
    };
  }

  getBalance = async () => {
    try {
      this.setState({ fetchingBalance: true });

      await this.props.getBalance();

      this.setState({ fetchingBalance: false });
    } catch (error) {
      return Alert.alert("Error", error.toString());
    }
  };

  componentDidMount() {
    let { firstname, lastname, level, pos_wallet_status } = global.user;

    this.setState({
      name: firstname + " " + lastname,
      level: level,
      pos_wallet_status: pos_wallet_status,
    });

    this.getBalance();
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response);

      if (response.fileSize) {
        let size = Math.ceil(response.fileSize / 1000 / 1000);

        if (size > 5) {
          this.setState({ uploading: false });
          return Alert.alert(
            "Profile Picture",
            "Upload size should not be more than 5MB. Your upload size is " +
              size +
              "MB"
          );
        }
      }

      if (response.uri) {
        ImgToBase64.getBase64String(response.uri)
          .then((base64String) =>
            this.setState(
              { photoBase64: base64String, uploadPic: response },
              () => this.uploadProfilePic()
            )
          )

          .catch((err) => console.log(err));
      }

      if (response.didCancel) {
        this.setState({ uploading: false });
      }
    });
  };

  uploadProfilePic = async () => {
    try {
      let pic = this.state.photoBase64;
      let uploadPicUri =
        Helper.getPropValue(this.state.uploadPic, "pic") ?? null;
      let url = Config.app_url;

      if (!pic) {
        return Alert.alert("Profile Picture", "Please select a picture");
      }

      let body = {
        serviceCode: "PIC_UPDATE",
        image: pic,
      };

      this.setState({ uploadInprogress: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ uploadInprogress: false });

      if (error) {
        return Alert.alert("Profile Picture", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({
          uploading: false,
          photoBase64: null,
        });

        global.user.pic = response.pic;

        this.props.setProfilePicture(response.pic);

        Alert.alert("Profile Picture", message.toString());
      } else {
        Alert.alert("Profile Picture", message.toString());
      }
    } catch (error) {
      this.setState({ uploadInprogress: false, uploading: false });

      Alert.alert("Profile Picture", error.toString());
    }
  };

  logout = async () => {
    try {
      let url = Config.app_url;

      let body = { serviceCode: "LOGOUT" };

      this.setState({ signingOut: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ signingOut: false });

      if (error) {
        return Alert.alert("Sign Out", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        store.dispatch({
          type: "IS_SIGNED_IN",
          payload: false,
        });
        // this.props.navigation.navigate("Start");
      } else {
        // Alert.alert("Sign Out", message.toString());
      }
    } catch (error) {
      
      this.setState({ signingOut: false });

      // Alert.alert("Sign Out", error.toString());

      store.dispatch({
        type: "IS_SIGNED_IN",
        payload: false,
      });
    }
  };

  Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerFirstRow}>
        <View>
          <Text style={styles.accountText}>My Account</Text>
        </View>

        <View>
          <Image resizeMode="contain" source={Logo} style={styles.logo} />
        </View>
      </View>

      {/* ----------------------------------------------------- */}

      <View style={styles.headerSecondRow}>
        <Image
          source={{
            uri: !this.state.uploading
              ? this.props.reducers.pic
              : Helper.getPropValue(this.state.uploadPic, "uri") ?? null,
          }}
          style={styles.profilePicRoundBox}
        />

        <TouchableOpacity
          onPress={() => {
            this.setState({ uploading: true });
            this.handleChoosePhoto();
          }}
        >
          <View style={styles.penShadow}>
            <Icon name="pen" size={13} color="#17375e"></Icon>
          </View>
        </TouchableOpacity>
      </View>

      {this.state.uploadInprogress ? (
        <TouchableOpacity style={{ alignSelf: "flex-end" }}>
          <>
            <Text>Uploading</Text>
            <ActivityIndicator color="#17375e" />
          </>
        </TouchableOpacity>
      ) : (
        <>
          {/* <TouchableOpacity
          onPress={this.uploadProfilePic}
          style={{ alignSelf: "flex-end" }}
        >
          <Icon name="upload" size={30} color="#17375e"></Icon>
        </TouchableOpacity> */}
        </>
      )}

      {/* ----------------------------------------------------- */}

      <View style={styles.headerThirdRow}>
        <Text style={styles.accountText}>{this.state.name}</Text>
      </View>

      {/* ----------------------------------------------------- */}

      <View style={styles.headerFourth}>
        <Text style={[styles.accountType, styles.labelGrey]}>
          Account type:
        </Text>
        <Text style={[styles.accountType, styles.shagoBlue]}>
          {" "}
          {this.state.level.toUpperCase()}{" "}
        </Text>
        <Text style={[styles.accountType, styles.labelGrey]}>
          {"  "}|{"  "}
        </Text>
        <Text style={[styles.accountType, styles.labelGrey]}>Wallet ID:</Text>
        <Text style={[styles.accountType, styles.shagoBlue]}>
          {" "}
          {this.state.wallet}{" "}
        </Text>
      </View>

      {/* ----------------------------------------------------- */}
      <View style={styles.headerFifth}>
        <View style={styles.line}></View>
      </View>

      {/* ----------------------------------------------------- */}

      <View style={styles.headerSixth}>
        <View>
          <Text style={styles.labelGrey}>Bonus</Text>
          <Text style={styles.amountText}>
            {Helper.formattedAmountWithNaira(
              this.props.reducers.balance.bonus_balance
            )}
          </Text>
        </View>

        {this.state.level == "agent" && (
          <View>
            <Text style={styles.labelGrey}>Commission</Text>
            <Text style={styles.amountText}>
              {Helper.formattedAmountWithNaira(
                this.props.reducers.balance.commission_balance
              )}
            </Text>
          </View>
        )}

        {this.state.pos_wallet_status == "1" && (
          <View>
            <Text style={styles.labelGrey}>POS</Text>
            <Text style={styles.amountText}>
              {Helper.formattedAmountWithNaira(
                this.props.reducers.balance.pos_balance
              )}
            </Text>
          </View>
        )}

        {/* ----------------------------------------------------- */}
        <View style={{ justifyContent: "flex-end" }}>
          {this.state.fetchingBalance ? (
            <ActivityIndicator color="#17375e" />
          ) : (
            <Icon
              name="sync-alt"
              size={20}
              color="#17375e"
              onPress={() => this.getBalance()}
              solid
            />
          )}
        </View>
        {/* ----------------------------------------------------- */}
      </View>
    </View>
  );

  Footer = () => (
    <View style={styles.footerWrapper}>
      {this.state.level == "individual" && (
        <View style={styles.buttonWrapper}>
          <GreenButton
            text="Become an Agent"
            onPress={() =>
              this.props.navigation.navigate("Account.BecomeAgent")
            }
          />
        </View>
      )}

      <View style={styles.buttonWrapper}>
        <WhiteButton
          text="Logout"
          onPress={() => this.logout()}
          bordered
          processing={this.state.signingOut}
          signingOut={this.state.signingOut}
        />
      </View>
    </View>
  );

  BodyRender = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate(item.route)}
    >
      <View style={{ paddingHorizontal: 30 }}>
        <View style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>

          <Icon name="chevron-right" size={16} color="#17375e" />
        </View>

        <View style={{ paddingTop: 20 }}>
          <View style={[styles.line, { borderColor: "#f7f7f7" }]}></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        {/* <StatusBar backgroundColor={styles.headerContainer.backgroundColor}/> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.DATA}
          extraData={null}
          renderItem={this.BodyRender}
          keyExtractor={(item, index) => item.label + index}
          //   ItemSeparatorComponent= {this.ItemSeparatorComponent}
          ListHeaderComponent={this.Header}
          //  ListHeaderComponentStyle={{}}
          ListFooterComponent={this.Footer}
          //    ListFooterComponentStyle={}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { reducers: state.reducers };
};

const mapDispatchToProps = {
  getBalance,
  setProfilePicture,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
