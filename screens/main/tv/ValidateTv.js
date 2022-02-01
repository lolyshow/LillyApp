import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import InputBox from "../../../components/InputBox";
import SelectBox from "../../../components/SelectBox";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import Network from "../../../Helpers/Network";
import ModalSelectBox from "../../../components/ModalSelectBox";
import Divider from "../../../components/Divider";
import { Help } from "@material-ui/icons";
import Helper from "../../../Helpers/Helper";
import MultiChoiceList from "./MultiChoiceList";
import { get } from "react-native/Libraries/Utilities/PixelRatio";

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
  },

  tvs: {
    flex: 1,
    marginBottom: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  iconWrapper: {
    width: (screenWidth * 0.75) / 4,
    height: 80,
    borderRadius: 100,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
  },

  iconWrapperSelected: {
    width: (screenWidth * 0.75) / 4,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 1)",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowRadius: 50,
    shadowOpacity: 0.2,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  selectTvProviderWrapper: {
    marginBottom: 20,
  },

  selectTvProvider: {
    width: 135,
    height: 19,
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 10,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },
});

export default class StartScreen extends Component {
  constructor() {
    super();

    this.state = {
      processing: false,
      loadingPackages: false,
      loadingAddon: false,
      tv: [
        {
          type: "DSTV",
          others: false,
          image: require("../../../assets/tv/dstv.png"),
        },
        {
          type: "GOTV",
          others: false,
          image: require("../../../assets/tv/gotv.png"),
        },
        // {
        //   type: "ShowMax",
        //   others: false,
        //   image: require("../../../assets/tv/showmax.jpg"),
        // },
        {
          type: "STARTIMES",
          others: false,
          image: require("../../../assets/tv/startimes.jpg"),
        },
        
        // {
        //   type: "OTHERS",
        //   others: true,
        //   image: require("../../../assets/others.png"),
        // },
      ],
      selected: "DSTV",
      plans: [],
      phone: null,
      smartCard: null,
      currentPlan: null,
      addonPLan: null,
      amount: null,
      box_office_amount: null,
      renewalAmount: null,
      month: null,
      invoicePeriod: null,
      packages: [],
      addon: null,
      showModalSelectPlan: false,
      showModalSelectAddonPlan: false,
      subscriptionType: "CHANGE_SUBSCRIPTION",
      renewalAmountAvailable: false,
      renewalDueDate: "",
      response:{},
      validationResponse: null,
    };
  }

  subscriptionTypes = () => {
    return [
      { label: "New subscription", value: "CHANGE_SUBSCRIPTION" },
      { label: "Renew current subscription", value: "RENEW_SUBSCRIPTION" },
      this.state.selected == "DSTV" && {
        label: "Box Office",
        value: "BOX_OFFICE_SUBSCRIPTION",
      },
    ];
  };

  addonList = () => {
    let plans = [{ label: "Select Addon Plan", value: "" }];

    this.state.addon.forEach((item, index) => {
      plans.push({
        label: `${item.name}  ${
          item.month
        } month(s) - ${Helper.formattedAmountWithNaira(item.price)}`,
        value: {
          code: item.code,
          month: item.month,
          name: item.name,
          period: item.period,
          price: item.price,
        },
        key: index,
      });
    });

    return plans;
  };


  loadAddon = () => {
    let addon = [{}];
    // let selectedTv = this.state.selected;
    // console.log("arrayResponse", this.state.validationResponse.product);
    // return;
        let num = 0;
        this.state.addon.forEach((item, index) => {
          addon.push({
            label: `${item.name}  ${item.month} month(s) - ${item.price}`,
            value: {
              code: item.code,
              month: item.month,
              name: item.name,
              period: item.period,
              price: item.price,
            },
            key: num++,
          });
        });
    return addon;
  };


  plansList = () => {
    let plans = [{}];
    let selectedTv = this.state.selected;
    // console.log("arrayResponse", this.state.validationResponse.product);
    // return;
    switch (selectedTv) {
      case "DSTV":
      case "GOTV":
        this.state.plans.forEach((item, index) => {
          plans.push({
            label: `${item.name}  ${item.month} month(s) - ${item.price}`,
            value: {
              code: item.code,
              month: item.month,
              name: item.name,
              period: item.period,
              price: item.price,
            },
            key: index,
          });
        });

        break;

      case "STARTIMES":
        this.state.plans.forEach((item, index) => {
          plans.push({
            label: `${item.name}  ${item.duration} - ${item.price}`,
            value: {
              code: item.code,
              month: item.duration,
              name: item.name,
              period: null,
              price: item.price,
            },
            key: index,
          });
        });

        break;
      case "ShowMax":
        this.state.plans.forEach((item, index) => {
          plans.push({
            label: `${item.name}(${item.type})   ${item.subscriptionPeriod} month(s)  - ${item.price}`,
            value: {
              code: null,
              month: item.subscriptionPeriod,
              name: item.name,
              type: item.type,
              period: null,
              price: item.price,
            },
            key: index,
          });
        });

        break;

      default:
        break;
    }

    return plans;
  };

  getPackages = async (tv = "DSTV") => {
    try {
    //   let serviceCode = "MUL";
    let serviceCode = "GDS";

      if (tv == "ShowMax") {
        serviceCode = "SHL";
      }

      let body = {
        serviceCode: serviceCode,
        type: tv,
        alternate: true,
        smartCardNo:this.state.smartCard,
      };

      console.log('body',body);
      let url = Config.app_url;

      this.setState({ loadingPackages: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ loadingPackages: false });
      if (error) {
        return Alert.alert("Tv", errorMessage);
      }

      if (response.packages || response.product) {
        this.setState({ plans: response.packages ?? response.product });
      } else {
        Alert.alert("TV", "Could not fetch products. Please ensure you provide correct smartcard number");
      }
    } catch (error) {
      this.setState({ loadingPackages: false });
      Alert.alert("TV", error.toString());
    }
  };

  getAddon = async (code) => {
    try {
      let body = {
        serviceCode: "ADN",
        type: "DSTV-ADDON",
        product_code: code,
        code: code,
        alternate: true,
      };

      console.log("adonBodyHere",body);
      let url = Config.dstv_addon_url;

      this.setState({ loadingAddon: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ loadingAddon: false });

      if (error) {
        return Alert.alert("Tv", errorMessage);
      }

      if (response.product) {
        this.setState({ addon: response.product });
        return;
      } else {
        Alert.alert("TV","Could not fetch Addon");
      }
    } catch (error) {
      this.setState({ loadingAddon: false });
      Alert.alert("TV", error.toString());
    }
  };

  switchTv = (tv) => {

    if(this.state.smartCard == null){
        Alert.alert("TV", "Please Enter your Smart Card Number");
        return;
    }
    this.setState({
      currentPlan: null,
      addonPLan: null,
      
      selected: tv,
      plans: [],
      addon: null,
      subscriptionType: "CHANGE_SUBSCRIPTION",
      renewalAmountAvailable: false,
      validationResponse: null,
    });
    this.getPackages(tv);
  };

  componentDidMount() {
    // this.getPackages();
  }

  continue = async () => {
    try {
      let { selected } = this.state;

      switch (selected) {
        case "ShowMax":
          return this.continueForShowMax();
          break;

        case "STARTIMES":
          return this.continueStarTimes();
          break;

        default:
          return this.continueMultiChoice();
          break;
      }
    } catch (error) {
      this.setState({ processing: false });
      return Alert.alert("TV", error.toString());
    }
  };

  continueMultiChoiceBoxOffice = async () => {
    let { currentPlan, addonPLan, smartCard, selected } = this.state;

    if (currentPlan && selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        serviceCode: "MULTICHOICE",
        action: "VALIDATE_SMART_CARD",
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Tv", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        let boxOfficeCheck = await this.validateBoxOffice(
          response.customerNumber
        );

        if (boxOfficeCheck === true) {
          return this.props.navigation.navigate("Tv.Validation", {
            smartCard: smartCard,
            type: selected,
            plan: currentPlan,
            addon: addonPLan,
            name: response.customerName,
            validationResponse: response,
            logo: selected,
            boxOffice: true,
          });
        } else {
          return Alert.alert("TV", boxOfficeCheck);
        }
      } else {
        return Alert.alert("TV", message.toString());
      }
    } else {
      this.setState({ processing: false });
      return Alert.alert("TV", "Fill in the blank fields");
    }
  };

  continueMultiChoiceRenew = async () => {
    let {
      currentPlan,
      addonPLan,
      smartCard,
      selected,
      validationResponse,
    } = this.state;

    if ((currentPlan, selected && smartCard && validationResponse)) {
      currentPlan.period = validationResponse.invoicePeriod;
      currentPlan.price = Math.abs(currentPlan.price);

      return this.props.navigation.navigate("Tv.Validation", {
        smartCard: smartCard,
        type: selected,
        plan: currentPlan,
        addon: addonPLan,
        name: validationResponse.customerName,
        validationResponse,
        logo: selected,
        boxOffice: false,
      });
    } else {
      this.setState({ processing: false });
      return Alert.alert("TV", "Fill in the blank fields");
    }
  };

  renewValidation = async () => {
    let { currentPlan, addonPLan, smartCard, selected } = this.state;

    if (selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        serviceCode: "MULTICHOICE",
        action: "VALIDATE_SMART_CARD",
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Tv", errorMessage);
      }
      let { status, message } = response;

      if (status == "200") {
        this.setState({ validationResponse: response });

        return this.getMultiChoiceRenewAmount(response.customerNumber);
      } else {
        return Alert.alert("TV", message.toString());
      }
    } else {
      this.setState({ processing: false });
      return Alert.alert("TV", "Fill in the blank fields");
    }
  };


  submitMultichoiceValidation = async ()=>{
    let { currentPlan, addonPLan, smartCard,response, selected } = this.state;
    return this.props.navigation.navigate("Tv.Validation", {
          smartCard: smartCard,
          type: selected,
          plan: currentPlan,
          addon: addonPLan,
          name: response.customerName,
          validationResponse: response,
          logo: selected,
          boxOffice: false,
        });
  }


  continueMultiChoiceChangeSubscription = async () => {
    let { currentPlan, addonPLan, smartCard, selected } = this.state;

    // if (currentPlan && selected && smartCard) {
    if (selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        // serviceCode: "MULTICHOICE",
        serviceCode: "GDS",
        action: "VALIDATE_SMART_CARD",
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Tv", errorMessage);
      }

      let { status, message } = response;
      console.log("responseFromValidateMetwoYou",response);
      
      if (status == "200") {
        this.setState({ plans: response.packages ?? response.product });
        this.setState({ response: response });
        this.setState({ validationResponse: response.product });
        // return this.props.navigation.navigate("Tv.Validation", {
        //   smartCard: smartCard,
        //   type: selected,
        //   plan: currentPlan,
        //   addon: addonPLan,
        //   name: response.customerName,
        //   validationResponse: response,
        //   logo: selected,
        //   boxOffice: false,
        // });
      } else {
        return Alert.alert("TV", message.toString());
      }
    } else {
      this.setState({ processing: false });
      return Alert.alert("TV", "Fill in the blank fields");
    }
  };

  validateBoxOffice = async (number = null) => {
    const { currentPlan, selected, smartCard } = this.state;

    if (currentPlan && selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        serviceCode: "MULTICHOICE",
        action: "CHECK_BOX_OFFICE",
        customerNumber: number,
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      console.log(body, response);

      this.setState({ processing: false });

      if (error) {
        return errorMessage;
      }

      let { status, message } = response;

      if (status == "200") {
        return true;
      } else {
        return message ?? "Could not verify box office account";
      }
    } else {
      return "Fill in the empty field(s)";
    }
  };

  getMultiChoiceRenewAmount = async (number = null) => {
    const { selected, smartCard } = this.state;

    if (selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        serviceCode: "MULTICHOICE",
        action: "GET_DUE_DATE_AMOUNT",
        customerNumber: number,
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ processing: false });

      if (error) {
        Alert.alert("TV", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        this.setState({
          renewalAmount: response.amount,
          renewalDueDate: response.dueDate,
          renewalAmountAvailable: true,
        });

        this.onchangeMultiChoiceRenewalAmount(response.amount.toString());
      } else {
        Alert.alert("TV", message);
      }
    } else {
      Alert.alert("TV", "Fill in the empty field(s)");
    }
  };

  continueMultiChoice = async () => {
    let type = this.state.subscriptionType;

    switch (type) {
      case "BOX_OFFICE_SUBSCRIPTION":
        return this.continueMultiChoiceBoxOffice();
        break;

      case "RENEW_SUBSCRIPTION":
        return this.continueMultiChoiceRenew();
        break;

      default:
        return this.continueMultiChoiceChangeSubscription();
        break;
    }
  };

  continueStarTimes = async () => {
    let { currentPlan, addonPLan, smartCard, selected } = this.state;

    if (currentPlan && selected && smartCard) {
      let body = {
        smartCardNo: smartCard,
        serviceCode: "GDS",
        type: selected,
      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body,
        {username:global.username,password:global.password}
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Tv", errorMessage);
      }

      let { status, message } = response;

      if (status == "200") {
        return this.props.navigation.navigate("Tv.Validation", {
          smartCard: smartCard,
          type: selected,
          plan: currentPlan,
          addon: addonPLan,
          name: response.customerName,
          validationResponse: response,
          logo: selected,
          boxOffice: false,
        });
      } else {
        return Alert.alert("TV", message.toString());
      }
    } else {
      this.setState({ processing: false });
      return Alert.alert("TV", "Fill in the blank fields");
    }
  };

  continueForShowMax = async () => {
    try {
      let { currentPlan, phone, selected } = this.state;

      if (currentPlan && selected && phone) {
        let body = {
          serviceCode: "SHP",
          phone: phone,
          amount: currentPlan.price,
          subscriptionType: currentPlan.type,
          subscriptionPeriod: currentPlan.month,
          package: currentPlan.name,
        };

        return this.props.navigation.navigate("Tv.ShowMaxValidation", {
          type: selected,
          plan: currentPlan,
          logo: selected,
          amount: currentPlan.price,
          total: currentPlan.price,
          boxOffice: false,
          validationList: [
            { label: "Package", value: currentPlan.name },
            { label: "Type", value: currentPlan.type },
            {
              label: "Subscription Period",
              value: currentPlan.month + " Month(s)",
            },
            {
              label: "Amount",
              value: Helper.formattedAmountWithNaira(currentPlan.price),
            },
            { label: "Customer Phone Number", value: phone },
          ],
          summaryList: [
            { label: "Package", value: currentPlan.name },
            {
              label: "Amount",
              value: Helper.formattedAmountWithNaira(currentPlan.price),
            },
          ],
          body,
        });
      } else {
        return Alert.alert("TV", "Fill in the blank fields");
      }
    } catch (error) {
      return Alert.alert("TV", error.toString());
    }
  };

  onchangePlan = (currentPlan) => {
    this.setState({ currentPlan, addonPLan: null, addon: null, amount: null });

    if (this.state.selected == "DSTV" && currentPlan) {
        console.log("isTvSelected");
      this.getAddon(currentPlan.code);
    }
  };

  onchangeAmountPlan = (amount) => {
    this.setState({ currentPlan: null, amount, addonPLan: null });

    if (amount) {
      this.setState({
        currentPlan: {
          code: null,
          month: null,
          name: "STARTIMES",
          period: null,
          price: amount,
        },
      });
    }
  };

  onchangeBoxOfficeAmount = (amount) => {
    this.setState({
      currentPlan: null,
      box_office_amount: amount,
      addonPLan: null,
    });

    if (amount) {
      this.setState({
        currentPlan: {
          code: "",
          month: 1,
          name: "BOX OFFICE",
          period: 1,
          price: amount,
        },
      });
    }
  };

  onchangeMultiChoiceRenewalAmount = (amount) => {
    this.setState({
      currentPlan: null,
      renewalAmount: amount,
      addonPLan: null,
    });

    if (amount) {
      this.setState({
        currentPlan: {
          code: "",
          month: 1,
          name: "SUBSCRIPTION RENEWAL",
          period: 1,
          price: amount,
        },
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingPackages || this.state.loadingAddon ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>
              {this.state.loadingAddon
                ? "Wait..fetching package addon"
                : "Fetching packages"}{" "}
            </Text>

            <ActivityIndicator size={50} color="#fff" />
          </View>
        ) : null}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.select({ ios: 150, android: 10 }),
          }}
          showsVerticalScrollIndicator={false}
        >
          <Header
            text="TV Subscription"
            backAction={() => this.props.navigation.goBack()}
          />
          <View style={styles.tvs}>
            {this.state.tv.map((item, index) => (
              <TouchableWithoutFeedback
                style={{ flex: 0.25 }}
                key={index}
                onPress={() => this.switchTv(item.type)}
              >
                <View
                  style={[
                    { marginBottom: 5 },
                    this.state.selected == item.type
                      ? styles.iconWrapperSelected
                      : styles.iconWrapper,
                  ]}
                >
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{ width: (screenWidth * 0.65) / 4, borderRadius:100, height: 70 }}
                  ></Image>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          {/* {["DSTV", "GOTV"].includes(this.state.selected) && (
            <View style={styles.inputWrapper}>
              <SelectBox
                inputLabel="Subscription Type"
                value={this.state.subscriptionType}
                onValueChange={(subscriptionType) =>
                  this.setState({
                    subscriptionType,
                    currentPlan: null,
                    renewalAmountAvailable: false,
                    validationResponse: null,
                    box_office_amount: null,
                    renewalAmount: false,
                  })
                }
                placeholder={{}}
                items={this.subscriptionTypes()}
                iconColor="#17375e"
              />
            </View>
          )} */}
          {this.state.selected == "ShowMax" ? (
            <View style={styles.inputWrapper}>
              <InputBox
                keyboardType="phone-pad"
                onChangeText={(phone) => this.setState({ phone })}
                inputValue={this.state.phone}
                inputLabel="Customer Phone Number"
                placeholder="Enter Customer Phone Number"
              />
            </View>
          ) : (
            <View style={styles.inputWrapper}>
              <InputBox
                keyboardType="numeric"
                onChangeText={(smartCard) =>
                  this.setState({
                    smartCard,
                    renewalAmountAvailable: false,
                    renewalAmount: null,
                  })
                }
                inputValue={this.state.smartCard}
                inputLabel="Smart Card Number"
                placeholder="Please Enter Smart Card Number"
              />
            </View>
          )}
          <View style={styles.inputWrapper}>
           {this.state.plans!= null && this.state.plans.length!= 0?
           (<>
                <ModalSelectBox
                //   inputLabel="TV Plan"
                  items={this.plansList()}
                  selectTitle = "Tv Plans"
                  visible={this.state.showModalSelectPlan}
                  selected={this.state.currentPlan}
                  closModal={() =>
                    this.setState({ showModalSelectPlan: false })
                  }
                  showModal={() => this.setState({ showModalSelectPlan: true })}
                  onSelect={(plan) => {
                    this.onchangePlan(plan);
                    this.setState({ showModalSelectPlan: false });
                  }}
                  placeholder="Select TV plan"
                />
            </>
           ):null
        }

          </View>
          

        {/* dstv addon starts */}
          <View style={styles.inputWrapper}>
            
                    
                    {this.state.addon!=null?(
                    <View style={styles.inputWrapper}>
                      <SelectBox
                        inputLabel="Select Addon"
                        value={this.state.addonPLan}
                        onValueChange={(addonPLan) =>{
                            
                            // this.onchangeAddonPlan(addonPLan);
                            this.setState({addonPLan:addonPLan });
                            // setBundleProp(net)
                            console.log("ItemHere",addonPLan)
                          }
                          
                        }
                        // placeholder={"Select Addon"}
                        items={this.state.addon.map( (data)=> {
                            console.log("myDatatatatatatat",data)
                            // this.loadAddon()
                          return {label: "name:"+data.name+",  Month:"+data.month+" ("+data.price+")" ,value: data}
                        })}
                        iconColor="#17375e"
                      />
                    </View>
                  ):null


                
              }
          </View>

        {/* dstv addon Ends */}

          {this.state.selected == "STARTIMES" && (
            <>
              <View>
                <Divider
                  style={{ marginVertical: 20, backgroundColor: "#eff6ff" }}
                />
                <View
                  style={{
                    marginTop: -40,
                    // marginBottom: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#eff6ff",
                      borderWidth: 1,
                      borderColor: "#17375e",
                      padding: 0,
                      borderRadius: 20,
                      height: 40,
                      width: 150,
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#17375e",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Or
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <InputBox
                  keyboardType="numeric"
                  onChangeText={this.onchangeAmountPlan}
                  inputValue={this.state.amount}
                  inputLabel="Amount"
                  placeholder="Enter amount"
                />
              </View>
            </>
          )}


          



          <View style={styles.submitButtonWrapper}>
            
            {console.log("checkIfNull",this.state.plans.length)}
            {this.state.plans.length== 0? (
                <GreenButton
                    text="Fetch Plans"
                    disabled={this.state.processing}
                    processing={this.state.processing}
                    onPress={() => this.continue()}
                />):
                <GreenButton
                text="Continue"
                disabled={this.state.processing}
                processing={this.state.processing}
                onPress={() => this.submitMultichoiceValidation()}
              />
            }

            {/* <GreenButton
                text="Make Payment"
                disabled={this.state.processing}
                processing={this.state.processing}
                onPress={() => this.continue()}
              /> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}
