import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import Icon from "react-native-vector-icons/FontAwesome5";
import Header from "../../../../components/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  line: {
    height: 0,
    borderWidth: 1,
    borderColor: "#dce7f4",
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

export default function Security({ navigation }) {

  const [pinActivated, setPinStatus] = useState(false);

  useEffect(() => {
  
    let  {transaction_pin, transaction_pin_status, secret_question, secret_answer} = global.user

       if (transaction_pin_status =="1") {

        setPinStatus(true)
         
       }
       else {

        setPinStatus(false)
       }

  });

 

  const SecurityTabs = () => {
    if (!pinActivated) {
      return [
        { label: "Reset Password", route: "Account.Reset" },
        { label: "Activate Transaction PIN", route: "Account.CreatePIn" },
      ];
    } else {
      return [
        { label: "Reset Password", route: "Account.Reset" },
        { label: "Change Transaction PIN", route: "Account.ChangePin" },
        { label: "Disable Transaction PIN", route: "Account.DisablePin" },
      ];
    }
  };

  const handleTabChange = (item) => {
    navigation.navigate(item.route)
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={styles.container.backgroundColor} /> */}

      <Header
            text="Security"
            backAction={() => navigation.goBack()}
          />

      <View>
        {SecurityTabs().map((item, index) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => handleTabChange(item)}
          >
            <View style={{}}>
              <View style={styles.row}>
                <Text style={styles.label}>{item.label}</Text>

                <Icon name="chevron-right" size={16} color="#17375e" />
              </View>

              <View style={{ paddingTop: 20 }}>
                <View style={[styles.line, { borderColor: "#f7f7f7" }]}></View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
