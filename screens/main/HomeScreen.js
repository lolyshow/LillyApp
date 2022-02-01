import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  BackHandler,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import Icon1 from "react-native-vector-icons/FontAwesome5";

import { Card, IconButton, Paragraph } from "react-native-paper";

// import Logo from "../../assets/shago.png";

// import HeaderImage from "../../assets/header_backg.png"
import HeaderImage from "../../assets/header.png";
import Logo from "../../assets/lilly.png"


import GreenButton from "../../components/GreenButton";

import WhiteButton from "../../components/WhiteButton";

import BorderedBackButton from "../../components/BorderedBackButton";

import ClipBoardModal from "../../components/ClipBoardModal";

import Helper from "../../Helpers/Helper";

import Clipboard from "@react-native-clipboard/clipboard";

import { connect } from "react-redux";

import { getBalance } from "../../redux/actions";
// import { white } from "react-native-paper/lib/typescript/styles/colors";
// import { white } from "react-native-paper/lib/typescript/styles/colors";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const IconPerRow = 3;

const adsList = [];

const iconFontSize =
  Math.ceil(screenWidth * 0.02) >= 12 ? Math.ceil(screenWidth * 0.02) : 12;

const product = [
  {
    iconName: "wallet",
    iconSize: 25,
    iconColor: "#4c7edb",
    backgroundColor: "#fff1dd",
    title: ["Fund Wallet"],
    navigation: "FundWallet",
    
  },

  {
    iconName: "mobile-alt",
    iconSize: 25,
    iconColor: "#6c6cfc",
    backgroundColor: "#fcddd8",
    title: ["Data"],
    navigation: "Data",
  },
  {
    iconName: "phone-square",
    iconSize: 25,
    iconColor: "#ff684e",
    backgroundColor: "#fcddd8",
    title: ["Airtime"],
    navigation: "Airtime",
  },

  {
    iconName: "lightbulb",
    iconSize: 25,
    iconColor: "#4dd3b3",
    backgroundColor: "#dbe7fd",
    title: ["Electricity Bills"],
    navigation: "Disco",
  },

  {
    iconName: "tv",
    iconSize: 25,
    iconColor: "#b642ef",
    backgroundColor: "#e3e3ff",
    title: ["Tv Sub"],
    navigation: "Tv",
  },

 

  // {
  //   iconName: "calculator",
  //   iconSize: 25,
  //   iconColor: "#18d1a6",
  //   backgroundColor: "#d0fff4",
  //   title: ["Cardless POS"],
  //   navigation: "Cardless",
  // },
  // {
  //   iconName: "bus",
  //   iconSize: 25,
  //   iconColor: "#a13fd5",
  //   backgroundColor: "#f3dffd",
  //   title: ["Shago Bus Ticketing"],
  //   navigation: "BusTicket",
  // },
  // {
  //   iconName: "heartbeat",
  //   iconSize: 25,
  //   iconColor: "#cb1515",
  //   backgroundColor: "#ffdddd",
  //   title: ["Shago Health"],
  //   navigation: "Health",
  // },
  // {
  //   iconName: "money-bill-alt",
  //   iconSize: 25,
  //   iconColor: "#88ca89",
  //   backgroundColor: "#e2ffe2",
  //   title: ["Shago Vest"],
  //   navigation: "sh-agoVest",
  // },

  {
    iconName: "futbol",
    iconSize: 25,
    iconColor: "#3535c",
    backgroundColor: "#e3e3fe",
    title: ["Sport Bet"],
    navigation: "BetAndLottery",
  },
  // {
  //   iconName: "boxes",
  //   iconSize: 25,
  //   iconColor: "#19a886",
  //   backgroundColor: "#d0fff4",
  //   title: ["Ondemand"],
  //   navigation: "Ondemand",
  // },

  {
    iconName: "graduation-cap",
    iconSize: 27,
    iconColor: "#17375e",
    backgroundColor: "#e3e3fe",
    title: ["Education"],
    navigation: "Education",
  },

  // {
  //   iconName: "plane-departure",
  //   iconSize: 27,
  //   iconColor: "#68BBE3",
  //   backgroundColor: "#dbe7fd",
  //   title: ["Flight Booking"],
  //   navigation: "FlightBooking",
  // },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom:50,
    // paddingBottom: "1%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height:300,
  },

  upperContainer: {
    backgroundColor: "#17375e",
    paddingHorizontal: "5%",
    paddingTop: "7%",
    paddingBottom: "10%",
  },

  upperFirstRow: {
    // marginTop:0,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  upperThirdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  upperSecondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor:'red'
  },

  salutation: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    color: "#ffffff",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "left",
    color: "#ffffff",
  },
  logo: {
    height: 35,
    width: 100,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  userWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  ruler: {
    borderWidth: 1,
    borderColor: "#22446e",
    height: 0,
    marginVertical: 15,
  },

  userContent_wrappwe: { flexDirection: "column" },
  wallet_balanceWrapper: { flexDirection: "column" },
  balanceText: { color: "#ffffff", fontWeight: "bold" },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#ffffff",
  },
  walletIdWrapper: {
    opacity: 0.6,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 7,
  },
  walletId: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 20,
    letterSpacing: 0,
    textAlign: "left",
  },
  refresh_wallet_visibility_wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },

  eyeIcon: { marginRight: "5%" },

  listStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignContent:'center',
    borderRadius: 25,
    paddingRight:15,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    // margin:50,
    // marginHorizontal: "2.5%",
    // paddingVertical: "5%",
    // paddingLeft: "4.5%",
  },

  productWrapper: {
    flex: 1,
    flexDirection: "column",
    margin:20,
  },
  iconWrapper: {
    height: (screenWidth * 0.7) / IconPerRow,
    width: (screenWidth * 0.7) / IconPerRow,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 8.5,
  },
  textWrapper: {
    fontSize: iconFontSize,
    fontStyle: "normal",
    textAlign: "center",
    fontWeight: Platform.select({ ios: "600", android: "700" }),
    color: "#707070",
    width: (screenWidth * 0.8) / IconPerRow,
    flexWrap: "wrap",
  },

  adsCard: {
    backgroundColor: "#ffe4e0",
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 10,
    marginBottom: 8,
    height: 70,
    width: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  profilePicRoundBox: {
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,

    borderWidth: 1,
    borderColor: "#dbefff",
    paddingRight: 0,
    marginRight: 0,
  },
  textColor:{
      color:"white",
  }
});

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewBalance: true,
      fetchingBalance: false,
      salutation: "Good Day",
      name: Helper.getPropValue(global, "user.firstname") ?? "N/A",
      walletId: Helper.getPropValue(global, "wallet.code") ?? "N/A",
      pic: Helper.getPropValue(global, "user.pic") ?? null,
      showClipBoardModal: false,
    };
  }

  getBalance = async () => {
    try {
      this.setState({ fetchingBalance: true });

      await this.props.getBalance();

      this.setState({ fetchingBalance: false });
    } catch (error) {
      this.setState({ fetchingBalance: false });

      Alert.alert("Message", error.toString());
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

  greetings = () => {
    const date = new Date();
    const hrs = date.getHours();
    let salutation;
    if (hrs < 12) salutation = "Good Morning";
    else if (hrs >= 12 && hrs <= 17) salutation = "Good Afternoon";
    else if (hrs >= 17 && hrs <= 24) salutation = "Good Evening";
    this.setState({ salutation });
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this.greetings();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  displayClipBoard = (value) => {
    Clipboard.setString(value);
    this.setState({ showClipBoardModal: true });
  };

  topScreen = () => {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.upperContainer.backgroundColor}
        />
        <ImageBackground source={HeaderImage} resizeMode="cover" style={styles.image}>

          

          <View style={styles.upperFirstRow}>

            
            <View style={styles.userWrapper}>
                

              <BorderedBackButton
              onPress={() => this.props.navigation.goBack()}
              col = "white"
              />
            </View>

            <View style={styles.logoWrapper}>
              

                <View>
                {this.state.fetchingBalance ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Icon
                    name="refresh-outline"
                    size={50}
                    color="#ffffff"
                    onPress={() => this.getBalance()}
                  />
                )}
              </View>
            </View>
          </View>

          {/* <View style={styles.ruler}></View> */}

         
          <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{}}>
              

              <Image
                source={require("../../assets/lilly.png")}
                resizeMode="contain"
                style={{ width: 100, height: 100 }}
              />
            </View>

            <View style={{}}>
              
            
              <View style ={{  padding:20}}>
                  <Text style={{fontSize:25,color:'white'}}>Welcome</Text>
                  <View style={{flexDirection:'row'}}>
                  <Icon1
                  style ={{margin:2}}
                    name="user"
                    size={25}
                    color="#ffffff"
                  />
                    <Text style ={{marginTop:0,fontSize:25, color:'white', marginLeft:4}}>{"Phillip "}</Text>
                  </View>
                  
              </View>
            </View>

            
          </View>
                  
          


          {/* <View style={styles.upperSecondRow}>
            <View style={styles.userContent_wrappwe}>
              <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{backgroundColor:'yellow'}}>
                  

                  <Image
                    source={require("../../assets/lilly.png")}
                    resizeMode="contain"
                    style={{ width: 100, height: 100 }}
                  />
                </View>

                
              </View>

              <View>
                <Text style={styles.balanceAmount}>
                  {this.state.viewBalance
                    ? Helper.formattedAmountWithNaira(
                        this.props.reducers.balance.balance
                      )
                    : "N-XXXXXX"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.walletIdWrapper}
                onPress={() => this.displayClipBoard(this.state.walletId)}
              >
                <Text style={styles.walletId}>
                  Wallet ID : {this.state.walletId}{" "}
                  <Icon name="copy" color="#22446e" />
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.refresh_wallet_visibility_wrapper}>
              <View style={styles.eyeIcon}>
                <Icon
                  onPress={() =>
                    this.setState({ viewBalance: !this.state.viewBalance })
                  }
                  name={
                    this.state.viewBalance ? "eye-outline" : "eye-off-outline"
                  }
                  size={22}
                  color="#ffffff"
                />
              </View>
              <View>
                {this.state.fetchingBalance ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Icon
                    name="refresh-outline"
                    size={22}
                    color="#ffffff"
                    onPress={() => this.getBalance()}
                  />
                )}
              </View>
            </View>
          </View> */}
          

          
          {/* <View style={styles.ruler}></View> */}

          <View style={{justifyContent:'space-between',flexDirection:'row'}}>

            <View style= {{backgroundColor:'#c988e2', justifyContent:'center', height:85, width:120, margin:20, borderRadius:10,padding:10}}>
              <Text style={[styles.textColor]}>Wallet Balance</Text>
              {/* <Text style={{textAlign:'center',color:'white'}}>Wallet</Text> */}
              <View style={{ flexDirection:'row'}}>
                {this.state.fetchingBalance ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Icon
                      name="refresh-outline"
                      size={22}
                      color="#ffffff"
                      onPress={() => this.getBalance()}
                    />
                  )}
                  <Text style={{textAlign:'center',marginTop:3, color:'white'}}>{this.state.viewBalance
                      ? Helper.formattedAmountWithNaira(
                          this.props.reducers.balance.balance
                        )
                      : "N-XXXXXX"}</Text> 

              </View>
            </View>


            <View style= {{backgroundColor:'#ff9d8d',height:85,width:120, justifyContent:'center', margin:20,borderRadius:10,padding:10}}>
               <Text style={{textAlign:'center',color:'white'}}>Wallet Id</Text>
              <Text style={{textAlign:'center',color:'white'}}>{this.state.walletId}{" "}</Text>
            </View>
          </View>

           <View style={styles.ruler}></View>

          {/* <View style={styles.upperThirdRow}>
            <GreenButton
              text={
                <Text>
                  <Icon name="wallet" size={23} solid />
                  Fund Wallet
                </Text>
              }
              onPress={() => this.props.navigation.navigate("FundWallet")}
            />

            <Text> </Text>

            <WhiteButton
              text={
                <Text>
                  <Icon name="swap-vertical-outline" size={23} solid />
                  Transfers & Bank
                </Text>
              }
              onPress={() => this.props.navigation.navigate("Transfers")}
            />
          </View> */}
        </ImageBackground>
      </>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.navigate(item.navigation)}
        key={"#_" + index}
        style={{ flex: 1, }}
      >
        <View style={styles.productWrapper}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: 'white', shadowColor: '#470000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.2,
              elevation: 1 },
            ]}
          >
            <Icon1
              name={item.iconName}
              color={item.iconColor}
              size={(screenWidth * 0.26) / IconPerRow}
              solid
            />



            <View style={{marginTop:10}}>
            {item.title.map((text, textIndex) => {
              return (
                <Text key={text + "_" + textIndex} style={[styles.textWrapper]}>
                  {text}
                </Text>
              );
            })}
            </View>
          </View>

          
        </View>
      </TouchableWithoutFeedback>
    );
  };

  productList = () => {
    return (
      <View style={{ flex: 1.5, /*marginTop: "-5%"*/ }}>
        <FlatList
          contentContainerStyle={styles.listStyle}
          renderItem={this.renderItem}
          data={product}
          horizontal={false}
          key={"_"}
          numColumns={IconPerRow}
          ItemSeparatorComponent={() => (
            <View style={{ /*marginVertical: 10, paddingHorizontal: 10 */}}></View>
          )}
          keyExtractor={(item, index) => "#" + index}
        />
      </View>
    );
  };

  mappedProductList = () => {
    <ScrollView style={[style.listStyle, { marginTop: "-5%" }]}>
      {product.map((item, index) => this.renderItem({ item, index }))}
    </ScrollView>;
  };

  render() {
    
    return (
      <View style={styles.container}>
        {this.topScreen()}

        {this.productList()}

        <ClipBoardModal
          closModal={() => this.setState({ showClipBoardModal: false })}
          itemCopied="Wallet ID Copied"
          message="You have copied your wallet ID"
          visible={this.state.showClipBoardModal}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
