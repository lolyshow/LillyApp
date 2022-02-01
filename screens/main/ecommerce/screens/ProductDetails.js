import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SliderBox } from "react-native-image-slider-box";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import ImageSlider from "react-native-image-slider";
export default class ProductDetails extends Component {
  constructor(props) {
    //this.props.route.params.product_id
    super(props);
    this.state = {
      images: [
        // "https://source.unsplash.com/1024x768/?nature",
        // "https://source.unsplash.com/1024x768/?water",
        // "https://source.unsplash.com/1024x768/?girl",
        //"https://source.unsplash.com/1024x768/?tree",
        require("../assets/images/laptop2.jpeg"),
        require("../assets/images/laptop.png"),
        require("../assets/images/laptop3.jpg"),
      ],
      diamond: [],
      responseimage: [],
      productDetails: {},
      loading: false,
      brandDetails: {},
      processedImage: [],
      featuresDetails: {},
      setAddress: {},
      setCategory: {},
    };
  }

  componentDidMount() {
    this.getProductDetails();
  }

  PictureComponent = () => {
    const images =
      this.props.image && this.props.image.length > 0
        ? this.props.image[0].url
        : "../assets/images/laptop2.jpeg";
    let image = { uri: images };
    return <SliderBox images={this.state.images} sliderBoxHeight={400} />;
  };

  renderImage = () => {
    return this.state.responseimage.map((element) => {
      return (
        <PictureComponent
          key={element.id}
          name={element.name}
          onPressButton={this.onPressButton.bind(this, element.id)}
          amount={element.amount}
          image={element.images}
        />
      );
    });
  };

  static navigationOptions = {
    title: "EproductDetails",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    //headerTintColor: '#0ff',
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  processImage = () => {
    console.log("philipiHowfa");
    console.log(this.state.responseimage);
    const img = this.state.responseimage;
    img.map((image) => {
      // let image = this.state.responseimage;
      console.log(image.url);
      this.state.processedImage.push(image.url);
    });

    // console.log("andfinnallyImage",this.state.processedImage)
  };

  getProductDetails = () => {
    this.setState({ loading: true });

    console.log("leadingDetails");
    fetch("https://www.lillypayment.com/api/e-commerce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "application/json",
      },
      body: JSON.stringify({
        action: "getProductInfo",
        product: this.props.route.params.product_id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        //console.log('thisisProduct',response.product.address.residence);

        console.log("productDetailsResponse", response);
        this.setState({ productDetails: response.product });
        this.setState({ responseimage: response.product.images });
        this.setState({ brandDetails: response.product.brand });
        this.setState({ featuresDetails: response.product.features });
        // console.log(this.state.brandDetails);

        this.setState({ setAddress: response.product.address });
        this.setState({ setCategory: response.product.category });
        this.setState({ loading: false });

        // setLoading(false);
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("error", error);
      });
  };

  Capitalize(strs) {
    var str = strs.toString();
    let upperstr = str.charAt(0).toUpperCase() + str.slice(1);
    return <Text>{upperstr}</Text>;
  }

  render() {
    console.log("thisisData", this.props.route.params.product_id);

    console.log("brandDetails", this.state.brandDetails.name);
    {
      this.processImage();
    }

    console.log(this.state.processedImage);
    var img = this.state.processedImage;
    const loading = this.state.loading;
    console.log(
      "thisDetailsAreProductDetailssss",
      this.state.productDetails.brand
    );
    console.log("productDetails", this.state.productDetails);
    var NumberFormat = require("react-number-format");
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton
            style={{}}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {loading ? "loading...." : this.state.setCategory.name}
            </Text>
          </View>
        </View>

        {loading ? (
          <View
            style={{
              alignSelf: "center",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{}}>
              <ActivityIndicator color="#17375e" size="large" />
            </View>
          </View>
        ) : !this.state.processedImage.length ? (
          <View style={{ marginLeft: 150, marginTop: 50, marginBottom: 30 }}>
            <Text>Error Loading Products</Text>
          </View>
        ) : (
          <ScrollView>
            <SliderBox
              images={img}
              sliderBoxHeight={400}
              imageLoadingColor="green"
              disableOnPress={true}
              ImageComponentStyle={{ backgroundColor: "#17375e" }}
              paginationBoxStyle={{ backgroundColor: "#17375e" }}
              dotColor="#01cf13"
            />

            <View
              style={{
                flexDirection: "row",
                margin: 20,
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ flex: 1, fontWeight: "bold" }}>
                {this.state.productDetails.features.name}
              </Text>
              {
                <NumberFormat
                  value={this.props.amount}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₦"}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: "#01cf13",
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      ₦{this.state.featuresDetails.amount}
                    </Text>
                  )}
                />
              }
            </View>

            <View>
              <Text style={{ margin: 20, fontWeight: "bold" }}>
                Product Location Information
              </Text>
            </View>
            {Object.entries(this.state.productDetails.address).map(
              (item, index) => {
                console.log(item[0], "No", item[1]);
                if (item[0] != "id" && item[0] != "created_at") {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 20,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>
                          {item[0].toLowerCase() == "number"
                            ? "Shop Number"
                            : this.Capitalize(item[0])}
                        </Text>

                        <Text> {this.Capitalize(item[1])}</Text>
                      </View>
                    </View>
                  );
                }
              }
            )}

            <View>
              <Text style={{ margin: 20, fontWeight: "bold" }}>
                Product Features
              </Text>
            </View>
            {Object.entries(this.state.productDetails.features).map(
              (item, index) => {
                console.log(item[0], "No", item[1]);
                if (item[0] != "id" && item[0] != "created_at") {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 20,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text> {this.Capitalize(item[0])}</Text>

                        <Text>{this.Capitalize(item[1])}</Text>
                      </View>
                    </View>
                  );
                }
              }
            )}

            <View>
              <Text style={{ margin: 20, fontWeight: "bold" }}>
                Owner Information
              </Text>
            </View>
            {Object.entries(this.state.productDetails.brand).map(
              (item, index) => {
                console.log(item[0], "No", item[1]);
                if (item[0] != "id" && item[0] != "created_at") {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 20,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>{this.Capitalize(item[0])}</Text>

                        <Text> {this.Capitalize(item[1])}</Text>
                      </View>
                    </View>
                  );
                }
              }
            )}

            {/* <Text style = {{margin:20, fontWeight: "bold"}}>Seller's note</Text>
            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                
                <Text > Congratulations! You've completed this tutorial and successfully added an authentication flow between the two stack navigators. In the next part of this series, we'll explore more features such as creating and storing chat rooms in a collection in Firestore, as well as displaying all chat rooms on the home screen. To create a new chat room, we'll create a new modal screen and make changes to the current home stack accordingly. </Text>
            </View> */}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: "10%",
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
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
});
