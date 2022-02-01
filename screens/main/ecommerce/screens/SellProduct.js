import React, { Component } from 'react';
import { View, Text, Image, Button,ScrollView, TouchableHighlight,TextInput, StyleSheet,Dimensions } from 'react-native';

import Logo from "../../../../assets/lilly.png";
import GreenButton from "../../../../components/GreenButton";

import WhiteButton from "../../../../components/WhiteButton";
import displayIconEcommerce from "../../../../assets/ecomerce.png";

import BorderedBackButton from "../../../../components/BorderedBackButton";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);


export default class SellProduct extends Component {


   
    
    
    
        render(){
            return(
                <View style={[styles.container]}>
                    {/* <View style={styles.logoWrapper}>
                        <Image source={Logo} />
                    </View> */}
                    <View style={styles.titleWrapper}>
                        <BorderedBackButton style = {{paddingHorizontal:5,}} onPress={() => this.props.navigation.goBack()} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{'Sell a Product'}</Text>
                        </View>
                    </View>


                    <View>
                        <View style={styles.displayIconWrapper}>
                            <Image source={displayIconEcommerce} />
                        </View>

                        <View style={styles.IconTextWrapper}>
                            <Text style={styles.IconText}> Start selling in 3 easy steps </Text>
                            <Text style={styles.IconText}> select category, fill product description, post </Text>
                        </View>
                    </View>


                    <View style={styles.buttonWrapper}>
                        <View>
                            <GreenButton
                                text="Select Categories"
                                buttonWidth={300}
                                onPress={() => this.props.navigation.navigate('EBrowseCategory',{userName: "sell"})}
                                //('ESubCategories',{userName: "username",category_id: item.id, nav:'nav'})}
                                //this.props.navigation.navigate("Login")}   this.props.navigation.navigate('EBrowseCategory');
                            />

                        </View>
                    

                    </View>
                </View>
            );
    
        };
    

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height:screenHeight,
      width:screenWidth,
      backgroundColor: "#ffffff",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
    },
  
    logoWrapper: {
      // marginTop:30
    },
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
        marginTop: 15,
        alignItems: "center",
        paddingHorizontal:20,
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
  
    displayIconWrapper: {
      //  marginTop:100
      justifyContent:'center',
      alignItems:'center',
    },
  
    lineWrapper: {
      // marginTop:40,
  
      flexDirection: "row",
      justifyContent: "space-around",
    },
  
    line: {
      width: 47,
      height: 0,
      opacity: 0.5,
      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "gray",
      marginLeft: 20,
    },
  
    buttonWrapper: {
      flexDirection: "row",
      justifyContent:'space-between'
    },
    
  
    IconTextWrapper: {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  
    IconText: {
    //   width: 300,
      // height: 57,
      // fontFamily: "Gilroy",
      fontSize: 20,
      fontWeight: "600",
      fontStyle: "normal",
      // lineHeight: 28,
      letterSpacing: 0,
      textAlign: "center",
      color: "#17375e",
    },
  });