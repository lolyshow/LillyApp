import React, { Component } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import Divider from "../../../../components/Divider";
import GreenButton from "../../../../components/GreenButton";
import Header from "../../../../components/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    justifyContent: "space-between",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  container2: {
    // flex:5,
    // justifyContent: "space-around",
    // alignItems:'center'
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#707070",
  },

  blueText: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  row: {
    flexDirection: "row",
  },

  buttonWrapper: {
    alignSelf: "stretch",
    marginTop:20
  },
});

export default class Contact extends Component {
  render() {
    return (

     
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

       {/* <StatusBar backgroundColor={styles.container.backgroundColor} /> */}
       <Header
            text="Contact Us"
            backAction={() => this.props.navigation.goBack()}
          />


        <View>
          <Text style={styles.greyText}>
            You can reach out to us on any of our customer support channels
          </Text>
        </View>

        <View>
          <Text style={styles.greyText}>Support line</Text>
          <Text style={styles.blueText}>+234909000000, +234900000000</Text>
        </View>

        <View>
          <Text style={styles.greyText}>Support email</Text>
          <Text style={styles.blueText}>support@lillynaija.com</Text>
        </View>

            <View>

        <Divider style={{ marginVertical: 20, backgroundColor: "#eff6ff" }} />
        <View
          style={{
            marginTop: -40,
            marginBottom: 30,
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

        <View>
          <Text style={styles.greyText}>Send us an Instant message</Text>

          <View style={styles.buttonWrapper}>
            <GreenButton text="Write a message" 
              onPress={() => this.props.navigation.navigate('Account.SendMessage')}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
