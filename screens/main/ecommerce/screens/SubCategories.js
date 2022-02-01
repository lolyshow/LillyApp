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
} from "react-native";
import Input from "react-native-input-style";
import IconButton from "@material-ui/core/IconButton";
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from "react-native-vector-icons/Octicons";
import FontAwes from "react-native-vector-icons/FontAwesome5";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchIcon from "@material-ui/icons/Search";
//MaterialIcons
import { FlatGrid } from "react-native-super-grid";
import MatIco from "react-native-vector-icons/MaterialIcons";
import AntDez from "react-native-vector-icons/AntDesign";
import NestedListView, { NestedRow } from "react-native-nested-listview";
import { SectionGrid } from "react-native-super-grid";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import SubCategoryCard from "../components/SubCategoryCard";
export default class SubCategories extends React.Component {
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
      searchQuery: "",
      loading: false,
      loadingGold: false,
      silverloading: false,
      diamondloading: false,
      setLoading: false,
      setSubCategories: [],
      subCategories: [
        {
          name: "Laptops & Computers",
          id: 1,
          created_at: "10-10-2020",
        },
        {
          name: "Audio and Music Equipments",
          id: 2,
          created_at: "10-10-2020",
        },
        {
          name: "Audio and Music Equipments",
          id: 3,
          created_at: "10-10-2020",
        },
        {
          name: "Audio and Music Equipments",
          id: 4,
          created_at: "10-10-2020",
        },
        {
          name: "Audio and Music Equipments",
          id: 5,
          created_at: "10-10-2020",
        },
      ],
    };
  }

  componentDidMount() {
    this.getSubCategory();
  }

  getSubCategory() {
    console.log("insideGetSubCategoris");
    this.setState({ loading: true });
    fetch("https://www.lillypayment.com/api/e-commerce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
        Origin: "*",
      },
      body: JSON.stringify({
        action: "getSubCategories",
        category: this.props.route.params.category_id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("CategoryResponse", JSON.stringify(response));
        this.setState({ setSubCategories: response.subCategories });

        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log("errormessage", error);
        this.setState({ loading: false });
        console.log("error", error);
      });
  }

  renderSubCategory = () => {
    let i = 0;
    return this.state.setSubCategories.map((element) => {
      console.log("thisisItem", element.name);
      return (
        <SubCategoryCard
          handleSubCatClick={this.handleSubCatClick.bind(this, element.id)}
          key={element.id}
          name={element.name}
        />
      );
    });
  };

  handleSubCatClick = (ids, name) => {
    console.log("nameis", name);
    console.log("myId", ids);
    // console.log(this.props.route.params.sell)
    console.log("thisisnav", this.props.route.params.nav);
    //this.props.navigation.navigate(this.props.route.params.nav,{userName: "username"})
    this.props.route.params.sell === "tru"
      ? this.props.navigation.navigate("EProductProperty", {
          categoryName: name,
          subcategoryid: ids,
          category_id: this.props.route.params.category_id,
        })
      : this.props.navigation.navigate(this.props.route.params.nav, {
          categoryName: name,
          subcategoryid: ids,
        });
  };

  //

  render() {
    const data = [
      {
        title: "Node 1",
        items: [{ title: "Node 1.1" }, { title: "Node 1.2" }],
      },
    ];
    let loading = this.state.loading;
    console.log("thisisSubCategories", this.props.route.params.category_id);

    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{ paddingHorizontal: 5 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {this.props.route.params.category_name}
            </Text>
          </View>
        </View>

        <View>
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
            this.renderSubCategory()
          )}
        </View>
      </ScrollView>
    );
  }
}

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
    paddingVertical: 40,
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
    marginTop: 15,
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 40,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "normal",
    // lineHeight: 32,
    // letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
});
