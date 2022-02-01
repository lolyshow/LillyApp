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
  ImageBackground,
  FlatList,
} from "react-native";
import Input from "react-native-input-style";
import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from "react-native-vector-icons/Octicons";
import FontAwes from "react-native-vector-icons/FontAwesome5";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchIcon from "@material-ui/icons/Search";
//MaterialIcons
import AntDez from "react-native-vector-icons/AntDesign";
import { FlatGrid } from "react-native-super-grid";
import MatIco from "react-native-vector-icons/MaterialIcons";
import NestedListView, { NestedRow } from "react-native-nested-listview";
import { SectionGrid } from "react-native-super-grid";
import ProductCard from "../components/ProductCard";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GridLayout from "react-native-layout-grid";

class AllProduct extends React.Component {
  constructor(props) {
    super(props);
    // this.checkState();
    this.state = {
      showModal: false,
      currentData: {},
      products: [],
      initialresp: {},
      gold: [],
      silver: [],
      diamond: [],
      details: {},
      noProduct: false,
      noSilver: false,
      silverstatus: "404",
      noGold: false,
      goldstatus: "404",
      noDiamond: false,
      diamondstatus: "404",
      responseMessage: "",
      goldResponseMessage: "",
      silverResponseMessage: "",
      searchQuery: "",
      searchstatus: "404",
      searchloading: false,
      noSearch: false,
      searchResponseMessage: "",
      searchObj: [],
      loading: false,
      goldloading: false,
      silverloading: false,
      diamondloading: false,
      setLoading: false,

      seed: 1,
      page: 1,
      users: [],
      isLoading: false,
      loadingMore: false,
      morepage: false,
      totalPage: 1,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.call();
  }

  onPressButton() {
    alert("You tapped the button!");
  }

  _onLongPressButton() {
    alert("You long-pressed the button!");
  }

  onPressButton = (item) => {
    this.props.navigation.navigate("EproductDetails", {
      userName: "username",
      product_id: item,
    });
  };

  call = () => {
    let direct = this.props.route.params.search;
    // console.log("thisisDirect",direct)
    if (direct == false) {
      this.setStateDiamond();
    } else {
      this.searchFunctionNew();
    }
  };

  searchFunction(pageNumber = 1) {
    this.setState({ searchloading: true });
    fetch("https://www.lillypayment.com/api/e-commerce?page=" + pageNumber, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
        Origin: "*",
      },
      body: JSON.stringify({
        action: "searchProducts",
        product: this.props.route.params.searchQuery,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("checkProddd", response);
        if (response.status) {
          this.setState({ searchstatus: response.status });
          response.status == "204"
            ? this.setState({ noSearch: true })
            : this.setState({ searchResponseMessage: response.message });
          this.setState({ initialresp: response.products });
          this.setState({ searchObj: response.products.data });
        }
        this.setState({ searchloading: false });
      })
      .catch((error) => {
        this.setState({ searchloading: false });
        console.log("error", error);
      });
  }

  handleRefresh = () => {
    this.setState(
      {
        seed: this.state.seed + 1,
        isRefreshing: true,
      },
      () => {
        let direct = this.props.route.params.search;
        if (direct == false) {
          this.setStateDiamond();
        } else {
          this.searchFunctionNew();
        }
      }
    );
  };

  handleLoadMore = () => {
    console.log("insideLoadMore");
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        let direct = this.props.route.params.search;
        if (direct == false) {
          this.setStateDiamond();
        } else {
          this.searchFunctionNew();
        }
      }
    );
  };

  searchFunctionNew(pageNumber = 1) {
    let currentPage = this.state.page;
    let total = this.state.totalPage;
    console.log("responsefrominitial");
    if (currentPage <= total) {
      this.setState({ searchloading: true });
      fetch("https://www.lillypayment.com/api/e-commerce?page=" + currentPage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "application/json",
          Origin: "*",
        },
        body: JSON.stringify({
          action: "searchProducts",
          product: this.props.route.params.searchQuery,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("checkProddd", response);
          if (response.status) {
            this.setState({ searchstatus: response.status });
            response.status == "204"
              ? this.setState({ noSearch: true })
              : this.setState({ searchResponseMessage: response.message });
            this.setState({ totalPage: response.products.last_page });

            if (this.state.page == 1) {
              this.setState({ users: response.products.data });
            } else {
              this.setState({
                users: [...this.state.users, ...response.products.data],
                isRefreshing: false,
              });
            }

            this.setState({ initialresp: response.products });
            this.setState({ searchObj: response.products.data });
          }
          this.setState({ searchloading: false });
          this.setState({ refreshing: false });
        })
        .catch((error) => {
          this.setState({ searchloading: false });
          this.setState({ refreshing: false });
          console.log("error", error);
        });
    }
  }

  setStateDiamond() {
    let currentPage = this.state.page;
    let total = this.state.totalPage;
    console.log("responsefrominitial");
    if (currentPage <= total) {
      if (currentPage == 1) {
        console.log("itIsPage1");
        this.setState({ diamondloading: true });
      } else {
        console.log("itIsNotPage1");
        this.setState({ loadingMore: true }, function() {
          // do something with new state
          console.log("PringMorePageValimi", this.state.loadingMore);
        });
      }
      console.log("loadingMoreCheckings", this.state.loadingMore);
      console.log("thisispageVarileData", this.state.page);
      fetch("https://www.lillypayment.com/api/e-commerce?page=" + currentPage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "application/json",
          Origin: "*",
        },
        body: JSON.stringify({
          action: "initialDisplayProducts",
          mainPage : true
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("responsefromDiamondLoad", JSON.stringify(response));
          this.setState({ diamondstatus: response.status });
          if (response.status == "204") {
            this.setState({ noDiamond: true });
          } else {
            this.setState({ totalPage: response.products.last_page });

            if (this.state.page == 1) {
              this.setState({ users: response.products.data });
            } else {
              this.setState({
                users: [...this.state.users, ...response.products.data],
                isRefreshing: false,
              });
            }

            console.log("thisIsUserWithOtherPage", this.state.users);
            console.log("thisIsResponseDataDataii", response.products.data);
          }
          this.setState({ diamondloading: false });
          this.setState({ loadingMore: false });
          this.setState({ refreshing: false });
        })
        .catch((error) => {
          console.log("errormessage", error);
          this.setState({ searchloading: false });
          this.setState({ refreshing: false });
          console.log("error", error);
        });
    }
  }

  renderDiamondProduct = () => {
    let i = 0;

    const items = this.state.diamond;
    console.log("thisisInsideDiamondRender");
    return (
      <FlatGrid
        itemDimension={120}
        data={items}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={12}
        renderItem={({ item }) => (
          <ProductCard
            key={item.id}
            name={item.name}
            onPressButton={this.onPressButton.bind(this, item.id)}
            amount={item.amount}
            image={item.images}
          />
        )}
      />
    );
  };

  renderSearchProduct = () => {
    let i = 0;

    const items = this.state.searchObj;
    console.log(items);
    return (
      <FlatGrid
        itemDimension={120}
        data={items}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={12}
        renderItem={({ item }) => (
          <ProductCard
            key={item.id}
            name={item.name}
            onPressButton={this.onPressButton.bind(this, item.id)}
            amount={item.amount}
            image={item.images}
          />
        )}
      />
    );
  };

  renderlistitem = () => {
    // const items = [
    //   { name: 'Server', code: '#1abc9c', itemcode:'plug' },
    //   { name: 'laptop', code: '#2ecc71', itemcode:'plug' },
    //   { name: 'Desktop', code: '#3498db', itemcode:'plug' },
    //   { name: 'Others', code: '#9b59b6', itemcode:'plug' },
    // ];
    const items = this.state.products;
    const { users, isRefreshing } = this.state;
    console.log("thisisELementsRend", items);
    return (
      <FlatGrid
        itemDimension={120}
        data={items}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={13}
        renderItem={({ item }) => (
          <ProductCard
            key={item.id}
            name={item.name}
            onPressButton={this.onPressButton.bind(this, item.id)}
            amount={item.amount}
            image={item.images}
          />
        )}
      />
    );
  };

  renderPagination = () => {
    const items = this.state.products;
    const { users, isRefreshing } = this.state;
    console.log("thisisELementsRendiii", users);
    return (
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              // justifyContent:'center',
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <ProductCard
              key={item.id}
              name={item.name}
              onPressButton={this.onPressButton.bind(this, item.id)}
              amount={item.amount}
              image={item.images}
            />
          </View>
        )}
        keyExtractor={(i) => i.id}
        refreshing={isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        // onEndReachedThreshold = {this.handleLoadMore}
        // onEndThreshold={0}
      />
    );
  };

  renderSearchPagination = () => {
    // const items = this.state.products;
    const items = this.state.searchObj;
    const { users, isRefreshing } = this.state;
    console.log("thisisELementsRendiii", users);
    return (
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              // justifyContent:'center',
              alignContent: "center",
              alignSelf: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <ProductCard
              key={item.id}
              name={item.name}
              onPressButton={this.onPressButton.bind(this, item.id)}
              amount={item.amount}
              image={item.images}
            />
          </View>
        )}
        keyExtractor={(i) => i.id}
        refreshing={isRefreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        // onEndReachedThreshold = {this.handleLoadMore}
        // onEndThreshold={0}
      />
    );
  };

  getSubCategoryProducts() {
    let responseStatus = 0;
    this.setState({ loading: true });
    this.setState({ product_id: this.props.route.params.subcategoryid });
    console.log("thisistheProrrr", this.props.route.params.subcategoryid);
    fetch("https://www.lillypayment.com/api/e-commerce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
        Origin: "*",
      },
      body: JSON.stringify({
        action: "getSubCategoryProducts",
        subCategory: this.props.route.params.subcategoryid,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log("thisisthePro",this.props.location.state);
        console.log("thisistheProrrr", response);
        response.status == "204"
          ? this.setState({ noProduct: true })
          : console.log("thisisAlterNative", response);
        this.setState({ responseMessage: response.message });
        this.setState({ products: response.products.data });
        this.setState({ initialresp: response.products });
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("error", error);
      });
  }

  render() {
    //return <Cat/>

    //   const data = [{title: 'Cars', items: [{title: 'G-Wagon'},{title: 'Toyota Camry'}]},{title: 'Fashion', items: [{title: 'Watches'}]}];
    console.log("thisIsLoadingMoreResult", this.state.loadingMore);
    const items = [
      { name: "Server", code: "#1abc9c", itemcode: "plug" },
      { name: "laptop", code: "#2ecc71", itemcode: "plug" },
      { name: "Desktop", code: "#3498db", itemcode: "plug" },
      { name: "Others", code: "#9b59b6", itemcode: "plug" },
    ];
    let search = this.props.route.params.search;
    let direct = this.props.route.params.search;
    let diamondloading = this.state.diamondloading;
    let goldloading = this.state.goldloading;
    let silverloading = this.state.silverloading;
    let searching = this.state.searchloading;
    console.log(this.props.route.params);
    return (
      <View style={styles.main}>
        {/* <ScrollView style = {{marginTop:20}}>  */}
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{ padding: 5 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{"Products"}</Text>
          </View>
        </View>

        <View>
          {diamondloading ? (
            <View></View>
          ) : this.state.noDiamond == true ? (
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text>{this.state.responseMessage}</Text>
            </View>
          ) : this.state.diamondstatus == "200" ? (
            <View style={{ marginLeft: 30, marginTop: 20 }}>
              <View
                style={{
                  height: 30,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  title="View Blll"
                  style={{
                    color: "#17375e",
                    backgroundColor: "#eff6ff",
                    fontSize: 20,
                  }}
                >
                  Products For you
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ height: 0, backgroundColor: "red" }}></View>
          )}

          {diamondloading ? (
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
          ) : this.state.noDiamond == true ? (
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Text>{this.state.responseMessage}</Text>
            </View>
          ) : (
            // this.renderDiamondProduct()
            <View style={{ height: 0 }}></View>
          )}

          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
            horizontal={true}
            style={{
              margin: 20,
              marginTop: 2,
              paddingBottom: direct == false ? 50 : 0,
              alignContent: "center",
              flexDirection: "row",
            }}
          >
            {diamondloading ? (
              <View></View>
            ) : this.state.noDiamond == true ? (
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text>{this.state.responseMessage}</Text>
              </View>
            ) : // this.renderDiamondProduct()
            direct == false ? (
              this.renderPagination()
            ) : (
              <View></View>
            )}
          </ScrollView>
          {this.state.loadingMore ? (
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
            <View style={{ height: 0 }}></View>
          )}

          {searching ? (
            <View></View>
          ) : this.state.noSearch == true ? (
            <View
              style={
                {
                  /*justifyContent:'center',alignContent:'center'*/
                }
              }
            >
              <Text>{this.state.searchResponseMessage}</Text>
            </View>
          ) : this.state.searchstatus == "200" ? (
            <View style={{ marginLeft: 30, marginTop: 0 }}>
              <View
                style={{
                  height: 30,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  title="View Blll"
                  style={{
                    color: "#17375e",
                    backgroundColor: "#eff6ff",
                    fontSize: 20,
                  }}
                >
                  Search Result
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ height: 0 }}></View>
          )}

          <ScrollView>
            {searching ? (
              <View
                style={{ alignContent: "center", justifyContent: "center" }}
              >
                <ActivityIndicator color="#17375e" size="large" />
              </View>
            ) : this.state.noSearch == true ? (
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text>{this.state.searchResponseMessage}</Text>
              </View>
            ) : this.state.searchstatus == "200" ? (
              <ScrollView
                horizontal={true}
                style={{ margin: 20, marginTop: 0, flexDirection: "row" }}
              >
                {this.renderSearchPagination()}
              </ScrollView>
            ) : this.state.searchstatus != "200" ? (
              <View>
                {this.state.noSearch == true ? (
                  <Text>No product matches your search</Text>
                ) : (
                  <Text></Text>
                )}
              </View>
            ) : (
              <View></View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
export default AllProduct;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    // backgroundColor:'#17375e',
  },
  gridView: {
    // marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  main: {
    flex: 1,
    // marginTop:10,
    // flexDirection:'row',
    backgroundColor: "#fff",
    // borderTopLeftRadius:20,
    // borderTopRightRadius:20,
    paddingVertical: 20,
    // paddingHorizontal:5
  },
  category: {
    flex: 3,
    // backgroundColor:'#17375e',
  },
  header: {
    flex: 0,
    padding: 20,
    // backgroundColor:'red',
    // justifyContent:"center",
    // alignItems:"center"
  },
  welcomText: {
    color: "white",
    // fontFamily:'san-serif',
    // margin:10
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    // fontFamily:'san-serif',
  },
  footer: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  SquareShapeView: {
    width: 100,
    height: 35,
    backgroundColor: "#9b59b6",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 0,
    marginLeft: 2,
  },

  SquareShapeView2: {
    width: 100,
    height: 35,
    backgroundColor: "#2ecc71",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 0,
    marginLeft: 2,
  },

  SquareShapeView3: {
    width: 100,
    height: 35,
    backgroundColor: "#FFC107",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 0,
    marginLeft: 2,
  },
  RectangleShapeView: {
    marginTop: 20,
    width: 120 * 2,
    height: 120,
    backgroundColor: "#FFC107",
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
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    // marginTop: 15,
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 30,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
  productTitles: {
    height: 30,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#eff6ff",
    marginLeft: 5,
  },
});
