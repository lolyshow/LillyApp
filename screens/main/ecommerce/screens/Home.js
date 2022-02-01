import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Input from "react-native-input-style";
import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from "react-native-vector-icons/Octicons";
import FontAwes from "react-native-vector-icons/FontAwesome5";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Iconic from "react-native-vector-icons/Ionicons";
//Ionicons
import SearchIcon from "@material-ui/icons/Search";
import AntDez from "react-native-vector-icons/AntDesign";
import ProductCard from "../components/ProductCard";

export default class Home extends React.Component {
  // function Home(props){

  constructor(props) {
    super(props);
    this.state = {
      array: [
        {
          key: "1",
          name: "Lenovo",
          amount: "#500,000",
          image: require("../assets/images/laptop2.jpeg"),
        },
      ],
      searchString: "",
      showModal: false,
      currentData: {},
      products: [],
      initialresp: {},
      gold: [],
      silver: [],
      diamond: [],
      details: {},
      searchQuery: "",
      loading: false,
      loadingGold: false,
      silverloading: false,
      diamondloading: false,
      setLoading: false,
      searchText: "",
    };
  }

  componentDidMount() {
    this.setStateDiamond();
    // this.setStateGold();
    // this.checkState();
  }

  gotoTestStackScreen = () => {
    // alert('You tapped the button!');
    this.props.navigation.navigate("EBrowseCategory", { userName: "home" });
  };

  gotoProducts = () => {
    //props.navigation.navigate('ProductDetails');
    this.props.navigation.navigate("ProductDetails", { title: "WHATEVER" });
  };

  gotoProductCategories = (id, name) => {
    //props.navigation.navigate('ProductDetails');
    //   this.props.navigation.navigate('SubCat', {title: 'WHATEVER'})
    // console.log("thisismyCategoryId",id)
    this.props.navigation.navigate("ESubCategories", {
      userName: "username",
      sell: "fal",
      category_name: name,
      category_id: id,
      nav: "ECategoryDetails",
    });
  };

  onPressButton = (item) => {
    this.props.navigation.navigate("EproductDetails", {
      userName: "username",
      product_id: item,
    });
  };

  _onLongPressButton = () => {
    alert("You long-pressed the button!");
  };

  gotoCategoryDetails = () => {
    console.log("thisIsPhillip");
    this.props.navigation.navigate("EAllProduct", {
      userName: "home",
      search: false,
    });
  };

  handleSearch = (text) => {
    this.setState({ searchQuery: text });
  };
  setStateDiamond() {
    console.log("responsefrominitial");
    this.setState({ diamondloading: true });
    fetch("https://www.lillypayment.com/api/e-commerce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
        Origin: "*",
      },
      body: JSON.stringify({
        action: "initialDisplayProducts",
        // subscriptionUnit: 3,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("responsefrominitial", JSON.stringify(response));
        this.setState({ initialresp: response.products });
        this.setState({ diamond: response.products.data });

        this.setState({ diamondloading: false });
      })
      .catch((error) => {
        console.log("errormessage", error);
        this.setState({ diamondloading: false });
        console.log("error", error);
      });
  }

  renderProduct2 = () => {
    let i = 0;
    return this.state.array.map((element) => {
      return (
        <ProductCard
          key={element.key}
          name={element.name}
          amount={element.amount}
          image={element.image}
        />
      );
    });
  };

  renderProduct = () => {
    let i = 0;
    return this.state.diamond.map((element) => {
      return (
        <ProductCard
          key={element.id}
          name={element.name}
          onPressButton={this.onPressButton.bind(this, element.id)}
          amount={element.amount}
          image={element.images}
        />
      );
    });
  };

  render() {
    let loading = this.state.diamondloading;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Iconic
            onPress={() => this.props.navigation.navigate("Main")}
            name="chevron-back-outline"
            size={20}
            color="#ffff"
          />
          <Text style={styles.welcomText}> Hi, {global.user.username}</Text>
          <Text style={styles.text}> What are you looking for today?</Text>
          {/* <Icon style={styles.searchIcon} name="rocket" size={20} color="#000"/> */}
          <View style={styles.search}>
            <View style={{ width: Dimensions.get("window").width * 0.8 }}>
              <TextInput
                style={{}}
                // style={styles.search}
                value={this.state.searchQuery}
                // onChangeText={(searchString) => {this.setState({searchString})}}
                onChangeText={this.handleSearch}
                underlineColorAndroid="transparent"
                placeholder="Search for a Product"
              />
            </View>
            <View style={{ width: 60 }}>
              <Iconic
                onPress={() =>
                  this.props.navigation.navigate("EAllProduct", {
                    userName: "home",
                    search: true,
                    searchQuery: this.state.searchQuery,
                  })
                }
                style={styles.searchIcon}
                name="ios-search"
                size={20}
                color="#424242"
              />
            </View>
          </View>
        </View>

        <ScrollView style={styles.footer}>
          <View style={{ flex: 1, margin: 5, marginTop: 3 }}>
            <View style={{ height: 20,justifyContent: "space-between", flexDirection: "row",}}>
              {/* <Text style = {{color:'#17375e'}}> Categories</Text> */}
              <View style={{ justifyContent: "center",alignItems: "center",height: 30,width: 100,}}>
                <Text style={{ color: "#17375e", fontWeight: "bold" }}>
                  {" "}
                  Categories
                </Text>
              </View>
              <View style={styles.productTitle}>
                <View>
                  <Text title="Go to test stack screen" style={{ color: "#17375e",fontSize: 14, fontWeight: "bold",backgroundColor: "#eff6ff",}}
                    onPress={this.gotoTestStackScreen}> View All </Text>
                </View>
                <View>
                  <AntDez
                    name="right"
                    style={{ marginTop: 1 }}
                    color="#17375e"
                    size={14}
                  />
                </View>
              </View>
            </View>

            <View
              style={{ marginTop: 20, marginLeft: 20, flexDirection: "row" }}
            >
              <View
                style={{
                  flex: 1,
                  height: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <TouchableHighlight
                  style={{
                    borderRadius:
                      Math.round(
                        Dimensions.get("window").width +
                          Dimensions.get("window").height
                      ) / 2,
                    width: Dimensions.get("window").width * 0.14,
                    height: Dimensions.get("window").width * 0.14,
                    // margin:0,
                    backgroundColor: "#f36952",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  underlayColor="#ccc"
                  onPress={() => this.gotoProductCategories(4, "Electronics")}
                >
                  <MatComIcon
                    name="television-classic"
                    size={30}
                    color="#fff"
                  />
                </TouchableHighlight>
                <View style={{}}>
                  <Text style={{ fontSize: 10 }}> Electronics </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <TouchableHighlight
                  style={{
                    borderRadius:
                      Math.round(
                        Dimensions.get("window").width +
                          Dimensions.get("window").height
                      ) / 2,
                    width: Dimensions.get("window").width * 0.14,
                    height: Dimensions.get("window").width * 0.14,
                    // margin:10,
                    backgroundColor: "#ffb64f",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  underlayColor="#ccc"
                  // onPress = {this.props.navigation.navigate('Example') }
                  onPress={() => this.gotoProductCategories(7, "Fashion")}
                >
                  <FontAwes name="tshirt" size={30} color="#fff" />
                </TouchableHighlight>
                <Text style={{ fontSize: 10 }}> Clothings </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  height: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <TouchableHighlight
                  style={{
                    borderRadius:
                      Math.round(
                        Dimensions.get("window").width +
                          Dimensions.get("window").height
                      ) / 2,
                    width: Dimensions.get("window").width * 0.14,
                    height: Dimensions.get("window").width * 0.14,
                    // margin:10,
                    backgroundColor: "#67b9f8",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  underlayColor="#ccc"
                  onPress={() => this.gotoProductCategories(7, "Fashion")}
                >
                  <MatComIcon name="shoe-formal" size={30} color="#fff" />
                </TouchableHighlight>
                <Text style={{ fontSize: 10 }}> Footware </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <TouchableHighlight
                  style={{
                    borderRadius:
                      Math.round(
                        Dimensions.get("window").width +
                          Dimensions.get("window").height
                      ) / 2,
                    width: Dimensions.get("window").width * 0.14,
                    height: Dimensions.get("window").width * 0.14,
                    // margin:10,
                    backgroundColor: "#88ca89",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  underlayColor="#ccc"
                  onPress={() => this.gotoProductCategories(9, "Babies & Kids")}
                >
                  <MatComIcon name="baby-face" size={30} color="#fff" />
                </TouchableHighlight>
                <Text style={{ fontSize: 10 }}> BabyU Toys </Text>
              </View>
            </View>

            <View style={{ marginTop: 30, marginBottom: 20 }}>
              <View
                style={{
                  height: 20,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                    width: 100,
                  }}
                >
                  <Text style={{ color: "#17375e", fontWeight: "bold" }}>
                    {" "}
                    Best Deals
                  </Text>
                </View>
                <View style={styles.productTitle}>
                  <Text
                    title="View Blll"
                    style={{
                      color: "#17375e",
                      backgroundColor: "#eff6ff",
                      fontWeight: "bold",
                    }}
                    onPress={this.gotoCategoryDetails}
                  >
                    View All
                  </Text>
                  <View>
                    <AntDez
                      name="right"
                      style={{ marginTop: 1 }}
                      color="#17375e"
                      size={14}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, margin: 20, marginTop: 3 }}>
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
                      <Text>Loading, Please wait...</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : !this.state.diamond.length ? (
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
                      <Text
                        style={{ alignSelf: "center", textAlign: "center" }}
                      >
                        Error Loading Products please retry{" "}
                      </Text>
                      <MatComIcon
                        onPress={() => this.setStateDiamond()}
                        style={{ alignSelf: "center" }}
                        name="reload"
                        size={30}
                        color="#17375e"
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <ScrollView
                horizontal={true}
                style={{
                  flexWrap: "wrap",
                  width: Dimensions.get("window").width,
                }}
              >
                {this.renderProduct()}
              </ScrollView>
            )}

            <ScrollView
              horizontal={true}
              style={{
                flexDirection: "row",
                width: Dimensions.get("window").width,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => this.props.navigation.navigate("Main")}
              >
                <View
                  style={{
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
                  }}
                >
                  <FontAwes name="wallet" size={30} color="#f36952" />
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    marginTop: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    marginBottom: 8,
                    height: 69,
                    width: 110,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 2,
                  }}
                >
                  <Text style={{ marginLeft: 5 }}>lillypay</Text>
                  <Text style={{ marginLeft: 5 }}>Bills Payment</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", marginLeft: 20 }}
                onPress={() => this.props.navigation.navigate("BusTicket")}
              >
                <View
                  style={{
                    backgroundColor: "#f3dffd",
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
                    elevation: 5,
                  }}
                >
                  <FontAwes name="bus" size={30} color="#a13fd5" />
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    marginTop: 10,
                    borderTopRightRadius: 10,
                    justifyContent: "center",
                    borderBottomRightRadius: 10,
                    marginBottom: 8,
                    height: 69,
                    width: 110,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text style={{ marginLeft: 5 }}>LillyPay</Text>
                  <Text style={{ marginLeft: 5 }}>Bus Ticketing </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#17375e",
  },
  header: {
    // flex:1,
    //flexDirection:'column',
    padding: 10,

    // justifyContent:"center",
    // alignItems:"center"
  },
  welcomText: {
    color: "white",
    margin: 20,
    fontSize: 20,
    marginLeft: 0,
  },
  text: {
    color: "white",
    // fontWeight:'bold',
    fontSize: 30,
    margin: 20,
    marginLeft: 0,
    // fontFamily:'san-serif',
  },
  footer: {
    // flex:1,

    // flexDirection:'row',
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    // paddingHorizontal:-10
  },
  btn_viewall: {
    //marginLeft:200,
    color: "#17375e",
    backgroundColor: "red",
  },
  search: {
    flex: 0,
    borderColor: "grey",
    borderWidth: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  productTitle: {
    flexDirection: "row",
    height: 30,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#eff6ff",
  },
});
