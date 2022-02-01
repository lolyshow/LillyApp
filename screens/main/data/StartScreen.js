import React, { useState, useEffect } from "react";
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
  Modal,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import MySelectPicker from "../../../components/SelectLine";
import InputBox from "../../../components/InputBox";
import SubmitInputBox from "../../../components/SubmitInputBox";
import SelectBox from "../../../components/SelectBox";
import Divider from "../../../components/Divider";
import GreenButton from "../../../components/GreenButton";
import BorderedBackButton from "../../../components/BorderedBackButton";
import Network from "../../../Helpers/Network";
import Header from "../../../components/Header";
import Config from "../../../Helpers/Config";
import axios from "axios";
import Helper from "../../../Helpers/Helper";
import RNPickerSelect from 'react-native-picker-select';
import Iconic from 'react-native-vector-icons/Ionicons';
// import AwesomeAlert from 'react-native-awesome-alerts';

const screenWidth = Dimensions.get("window").width;

const currency = "\u20A6";

export default function StartScreen(props) {
  const [pinNo, setPinNo] = useState("1");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedAction, setSelectedAction] = useState("data");
  const [selectedAmount, setAmount] = useState("");
  const [service, setService] = useState(dataTopUp);
  const [bundle, setBundle] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isSpecialData, setIsSpecialData] = useState(false);
  const [phone, setPhone] = useState("");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [dataBundles, setDataBundles] = useState([]);
  const [SPECdataBundles, setSPECDataBundles] = useState([]);
  const [SMILEdataBundles, setSMILEDataBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bundleProp, setBundleProp] = useState({});
  const [ntelBundleProp, setNtelBundleProp] = useState({});
  const [smileBundleProp, setSMILEBundleProp] = useState({});
  const [spectranetProp, setSpectranetProp] = useState({});
  const [itemBody, setItemBody] = useState({});
  const [accountNo, setAccountNumbers] = useState("");
  const [noSmile, setNoSmile] = useState(false);

  // useEffect(() => {
  //   setDataBundles(dataAmount);
  //   checkNetwork();
  // }, []);

  const renderItems = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => switchNetwork(item.type)}>
        <View style={[styles.productWrapper, { marginBottom: 10 }]}>
          <View
            style={
              selectedNetwork == item.type
                ? styles.iconWrapperSelected
                : styles.iconWrapper
            }
          >
            <Image
              source={item.image}
              style={{ width: 50, height: 38, borderRadius: 20 }}
              resizeMode="contain"
            ></Image>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderAmountItems = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => switchAmount(item)}>
        <View style={[styles.productWrapper, { marginBottom: 10 }]}>
          <View
            style={
              selectedAmount == item
                ? styles.iconWrapperSelected
                : styles.iconWrapper
            }
          >
            <Text
              style={
                selectedAmount == item
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" }
              }
            >
              {currency} {item}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderDataItems = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          switchBundle(index);
          setBundleProp(item);
        }}
      >
        <View style={[styles.productWrapper, { marginBottom: 10 }]}>
          <View
            style={
              bundle == index
                ? styles.iconWrapperDataSelected
                : styles.iconWrapperData
            }
          >
            <Text
              style={[
                { fontWeight: "bold", fontSize: 13 },
                bundle == index
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" },
              ]}
            >
              {item.allowance}
            </Text>
            <Text
              style={[
                { fontSize: 12 },
                bundle == index
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" },
              ]}
            >
              {item.validity}
            </Text>
            <Text
              style={[
                { fontWeight: "bold", fontSize: 13 },
                bundle == index
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" },
              ]}
            >
              {currency} {item.price}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderNtelDataItems = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        key={"#" + index}
        onPress={() => {
          switchBundle(index);
          if (selectedNetwork == "NTEL") {
            setNtelBundleProp(item);
          }
        }}
      >
        <View style={[styles.productWrapper, { marginBottom: 10 }]}>
          <View
            style={
              bundle == index
                ? styles.iconWrapperSelectedNtel
                : styles.iconWrapperNtel
            }
          >
            <Text
              style={[
                { fontWeight: "bold", fontSize: 13 },
                bundle == index
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" },
              ]}
            >
              {item.description}
            </Text>

            <Text
              style={[
                { fontWeight: "bold", fontSize: 13 },
                bundle == index
                  ? { color: "#17375e", textAlign: "center" }
                  : { color: "#707070", textAlign: "center" },
              ]}
            >
              {currency} {item.price || 0}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const switchNetwork = (type) => {
    setSelectedNetwork(type);
    setBundleProp({});
    setNtelBundleProp({});
    setSMILEBundleProp({});
    setBundle(null);
    setDataBundles([]);
    setSpectranetProp({});
    setAmount("");

    if (selectedAction == "airtime") {
      setIsSpecialData(false);
      return;
    }

    //to hide the other network and display the container for the special data type

    if (type == "NTEL") {
      getNTELBundle();
      setIsSpecialData(false);
      return;
    }
    if (type == "SPECTRANET") {
      getSpectranetBundle();
      setIsSpecialData(true);
      return;
    }
    if (type == "SMILE") {
      // getSMILEBundle();
      setIsSpecialData(false);
      return;
    }

    if (type == "OTHERS") {
      setIsSpecialData(false);
      return;
    } else {
      // console.log("thisis",type);
      getAllBundle(type);
      setIsSpecialData(false);
      // checkNetwork()
    }
  };

  const checkNetwork = () => {
    if (selectedAction == "airtime") {
      setIsSpecialData(false);
      return;
    }
    if (selectedNetwork == "SPECTRANET" || selectedNetwork == "NTEL") {
      if (selectedNetwork == "NTEL") {
        getNTELBundle();
        setIsSpecialData(false);
      } else {
        setIsSpecialData(true);
      }
    } else {
      if (!selectedNetwork == "SMILE") getAllBundle(selectedNetwork);
      setIsSpecialData(false);
    }
  };

  const switchAmount = (amount) => {
    setAmount(amount);
    selectedAction == "airtime" && setRechargeAmount(amount.toString());
  };

  const switchBundle = (index) => {
    setBundle(index);
  };

  const getNTELBundle = async () => {
    setLoading(true);
    let body = { serviceCode: "NBV" };
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body,{username:global.username,password:global.password});
    setLoading(false);
    if (error) {
      return Alert.alert("Error", errorMessage);
    }

    if (response.status == "200") {
      setDataBundles(response.product);
    } else {
      return Alert.alert("Error", "Could not fetch data plans");
    }
  };

  const getSMILEBundle = async () => {
    if (!accountNo) {
      Alert.alert("Error", "Please enter your smile account number");
      return;
    }

    setLoading(true);
    let body = {
      serviceCode: "SMV",
      account: accountNo,
    };
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body,{username:global.username,password:global.password});
    setLoading(false);
    if (error) {
      return Alert.alert("Error", errorMessage);
    }

    if (response.status == "200") {
      var dataArr = [];
      for (const product of response.product) {
        dataArr.push({
          label: `${product.name} - ${Helper.formattedAmountWithNaira(
            product.price
          )}`,
          value: product,
        });
      }
      setSMILEDataBundles(dataArr);
    } else {
      return Alert.alert("Error", response.message);
    }
  };

  const getSpectranetBundle = async () => {
    setLoading(true);
    let body = {
      serviceCode: "SPV",
      network: "SPECTRANET",
    };
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body,{username:global.username,password:global.password});
    setLoading(false);

    if (error) {
      return Alert.alert("Error", errorMessage);
    }

    if (response.status == "200") {
      if (response.product) {
        var dataArr = [];
        for (const product of response.product) {
          dataArr.push({
            label: currency + " " + product.price,
            value: product,
          });
        }
        setSPECDataBundles(dataArr);
      }
    } else {
      return Alert.alert("Error", "Could not fetch data plans");
    }
  };

  const getAllBundle = async (type) => {

    console.log('insideGetAllBundle');
    setLoading(true);
    let body = {
      serviceCode: "VDA",
      phone: phone,
      network: type,
    };

    if(phone == ""){
      setLoading(false);
      return Alert.alert("Please enter your Phone Number");
      
    }

    console.log("thisIsBody",body);
    let url = Config.app_url;
    let { error, errorMessage, response } = await new Network().post(url, body,{username:global.username,password:global.password});
    setLoading(false);
    console.log("thisIsReturnedBundle", response);
    if (error) {
      return Alert.alert("Error", errorMessage);
    }

    if (response.status == "200") {
      setDataBundles(response.product);
    } else {
      return Alert.alert("Error", "Could not fetch data plans");
    }
  };

  const makePayment = () => {

    console.log("thisIsReactbundleProp",bundleProp);
    // return;
    let body = getBody();

    console.log(body, "body");

    var keys = Object.keys(body);
    for (const key of keys) {
      if (!body[key]) {
        Alert.alert("Error", Helper.textRefine(key) + " is required!");
        return;
      }
    }

    props.navigation.navigate("Data.Validation", {
      logo: selectedNetwork,
      body,
    });



    
  };

  const getBody = () => {
    let body = {};

   
    if (selectedNetwork == "NTEL") {
      body = {
        serviceCode: "NBP",
        amount: Helper.getPropValue(ntelBundleProp, "price"),
        phone: phone,
        code: Helper.getPropValue(ntelBundleProp, "code"),
        description: Helper.getPropValue(ntelBundleProp, "description"),
      };
      return body;
    }

    if (selectedNetwork == "SMILE") {
      var code = Helper.getPropValue(smileBundleProp, "code");
      var amount = Helper.getPropValue(smileBundleProp, "price");
      var bundle = Helper.getPropValue(smileBundleProp, "name");
      body = {
        serviceCode: "SMB",
        account: accountNo,
        bundle: bundle,
        package: bundle,
        type: "SMILE_BUNDLE",
        productsCode: code,
        amount: amount,
        product: `${code}|${amount}|${bundle}`,
      };
      return body;
    }

    if (selectedNetwork == "SPECTRANET") {
      var code = Helper.getPropValue(spectranetProp, "code");
      var amount = Helper.getPropValue(spectranetProp, "price");
      var bundle = Helper.getPropValue(spectranetProp, "name");
      body = {
        serviceCode: "SPB",
        amount: amount,
        type: selectedNetwork,
        pinNo: pinNo,
        total: pinNo * amount,
        product: `${code}|${amount}|${bundle}`,
      };

      return body;
    } else {
      body = {
        serviceCode: "BDA",
        network: selectedNetwork,
        phone: phone,
        bundle: Helper.getPropValue(bundleProp, "allowance"),
        amount: Helper.getPropValue(bundleProp, "price"),
        package: Helper.getPropValue(bundleProp, "code"),
      };

      return body;
    }
  };
  console.log("dataBundleHere".dataBundles)
  return (


   
    <View style={styles.container}>
      {loading ? (
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
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : null}

      <View style={styles.titleWrapper}>
        <BorderedBackButton onPress={() => props.navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{"Data Top Up"}</Text>
        </View>
      </View>
      {/* <ScrollView style={styles.tvs} showsVerticalScrollIndicator={false}> */}
      <FlatList
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        data={service}
        horizontal={false}
        key={"#"}
        numColumns={4}
        keyExtractor={(item, index) => index}
        extraData={selectedNetwork}
        renderItem={({ item }) => renderItems({ item })}
        ListHeaderComponent={
          <>
            <View
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: 10,
                flexDirection: "row",
                marginTop: 30,
                // marginBottom: 10,
                // padding: 5,
                width: "auto",
              }}
            >
              
            </View>
            <Text
              style={{
                color: "#99a6c1",
                fontWeight: "bold",
                fontSize: 17,
                marginVertical: 20,
              }}
            >
              Select Network
            </Text>
          </>
        }
        ListFooterComponent={
          <View
            style={{
              marginBottom: Platform.select({ ios: 150, android: 10 }),
            }}
          >
            {isSpecialData ? (
              <>
                {selectedNetwork == "SPECTRANET" ? (
                  <>
                    <View style={styles.inputWrapper}>
                      <SelectBox
                        inputLabel="Spectranet Data Bundle price"
                        inputLabelStyle={styles.selectDiscProvider}
                        onValueChange={(plan) => setSpectranetProp(plan)}
                        placeholder={{
                          label: "Select from available plan",
                          value: null,
                        }}
                        items={SPECdataBundles}
                        iconColor="#17375e"
                        iconSize={22}
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <InputBox
                        keyboardType="numeric"
                        onChangeText={(pinNo) => setPinNo(pinNo)}
                        inputValue={pinNo}
                        inputLabel="Number of PINS"
                        placeholder="Enter pin"
                      />
                    </View>
                  </>
                ) : null}
              </>
            ) : (
              <>
                {selectedNetwork == "SMILE" ? (
                  <View style={styles.tvs}>
                    <View style={styles.inputWrapper}>
                      <InputBox
                        keyboardType="numeric"
                        onChangeText={(text) => setAccountNumbers(text)}
                        inputValue={accountNo}
                        inputLabel="Smile Account Number"
                        placeholder="Enter Account Number"
                      />
                    </View>
                    <View style={styles.submitButtonWrapper}>
                      <GreenButton
                        text="Available Bundles"
                        buttonWidth={200}
                        disabled={processing}
                        processing={processing}
                        onPress={() => getSMILEBundle()}
                      />
                    </View>

                    <SelectBox
                      inputLabel="Select SMILE data bundle"
                      inputLabelStyle={styles.selectDiscProvider}
                      onValueChange={(item) => setSMILEBundleProp(item)}
                      placeholder={{
                        label: "Select from available data plans",
                        value: null,
                      }}
                      items={SMILEdataBundles}
                      iconColor="#17375e"
                      iconSize={22}
                    />
                  </View>
                ) : (
                  <>
                    <View style={styles.inputWrapper}>
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: 21,
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#707070",
                            marginBottom: 5,
                          }}
                        >
                          Phone Number
                        </Text>
                        <TextInput
                          placeholder="Enter Phone Number"
                          onChangeText={(text) => setPhone(text)}
                          keyboardType="phone-pad"
                          style={{
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: "#f7f7f7",
                            padding: 10,
                            color: "#17375e",
                          }}
                        />
                      </View>

                    
                    </View>
                    
                    
                    <>
                      {/* {selectedNetwork == "NTEL" &&
                      selectedAction != "airtime" ? (
                        dataBundles.map((item, index) =>
                          renderNtelDataItems({ item, index })
                        )
                      ) : (
                        <FlatList
                          contentContainerStyle={styles.listStyle}
                          data={
                            dataBundles
                          }
                          horizontal={false}
                          key={"#"}
                          numColumns={4}
                          keyExtractor={(item, index) => index}
                          extraData={selectedNetwork}
                          renderItem={({ item, index }) =>
                            selectedAction == "airtime"
                              ? renderAmountItems({ item })
                              : selectedNetwork == "NTEL"
                              ? renderNtelDataItems({ item, index })
                              : renderDataItems({ item, index })
                          }
                        />
                      )}
                        */}


                      {dataBundles?(
                        <View style={styles.inputWrapper}>
                          <SelectBox
                            inputLabel="Select BundleS"
                            value={dataBundles}
                            onValueChange={(net) =>{
                                setBundleProp(net)
                                console.log("ItemHere",net)
                              }
                              
                            }
                            placeholder={{}}
                            items={dataBundles.map( (data)=> {
                              return {label: data.allowance+" : "+data.validity+" ("+data.price+")" ,value: data}
                            })}
                            iconColor="#17375e"
                          />
                        </View>
                      ):''}
                      
                    </>
                  </>
                )}
              </>
            )}
            
            



            <View style={styles.submitButtonWrapper}>
              <GreenButton
                text="Purchase"
                disabled={processing}
                processing={processing}
                onPress={() => makePayment()}
              />
            </View>
          </View>
        }
      />
      {/* </ScrollView> */}
    </View>
  );
}


const dataTopUp = [
  {
    value: "MTN",
    type: "MTN",
    others: false,
    image: require("../../../assets/network/mtn.jpg"),
  },
  {
    value: "AIRTEL",
    type: "AIRTEL",
    others: false,
    image: require("../../../assets/network/airtel.jpg"),
  },
  {
    value: "GLO",
    type: "GLO",
    others: true,
    image: require("../../../assets/network/glo.jpg"),
  },
  {
    value: "ETISALAT",
    type: "ETISALAT",
    others: true,
    image: require("../../../assets/network/9mobile.jpg"),
  },
  {
    value: "SPECTRANET",
    type: "SPECTRANET",
    others: true,
    image: require("../../../assets/network/spectranet.jpg"),
  },
  {
    value: "SMILE",
    type: "SMILE",
    others: true,
    image: require("../../../assets/network/smile.jpg"),
  },
  // {
  //   value: "NTEL",
  //   type: "NTEL",
  //   others: true,
  //   image: require("../../../assets/network/ntel.jpg"),
  // },
  // {
  //   value: "OTHERS",
  //   type: "OTHERS",
  //   others: true,
  //   image: require("../../../assets/others.png"),
  // },
];

const amounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  selectedAction: {
    backgroundColor: "#17375e",
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  unselectedAction: {
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
  },
  iconWrapper: {
    width: (screenWidth * 0.75) / 4,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperSelected: {
    width: (screenWidth * 0.75) / 4,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.19)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
  },

  productWrapper: {
    flex: 1,
  },

  tvs: {
    marginBottom: 40,
  },

  product: {},

  title: {
    height: 28,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2699fb",
  },

  listStyle: {
    justifyContent: "space-between",
  },

  productWrapper: {
    flex: 1,
  },

  tvs: {
    marginBottom: 40,
  },

  iconWrapperData: {
    width: (screenWidth * 0.8) / 4,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperDataSelected: {
    width: (screenWidth * 0.8) / 4,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.19)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperNtel: {
    alignSelf: "stretch",
    height: 90,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperSelectedNtel: {
    alignSelf: "stretch",
    height: 90,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.19)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#17375e",
    justifyContent: "center",
    alignItems: "center",
  },

  selectDiscProviderWrapper: {
    marginBottom: 20,
  },

  selectDiscProvider: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "column",
    marginBottom: 10,
  },

  submitButtonWrapper: {
    marginBottom: 30,
  },
  search:{
    marginTop:20,marginBottom:30, height:40, width:300, alignItems:'center',alignItems:'center', borderColor: 'grey', alignSelf:'center', borderBottomWidth: 1, flexDirection:'row',
  },
});
