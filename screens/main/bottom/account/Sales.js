import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import WhiteButton from "../../../../components/WhiteButton";

import DatePicker from "../../../../components/DatePicker";
import BorderedCancelButton from "../../../../components/BorderedCancelButton";
import Header from "../../../../components/Header";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";
import Helper from "../../../../Helpers/Helper";
import Divider from "../../../../components/Divider";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    paddingVertical: 40,
    paddingHorizontal: 35,
  },
  box: {},

  title: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  heading: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    marginBottom: 20,
  },

  heading2: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    textAlign: "left",
    color: "#333333",
  },
  inputWrapper: {
    flexDirection: "column",
    marginBottom: 15,
  },
});

export default function Sales(props) {
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showDateTo, setShowDateTo] = useState(false);
  const [showDateFrom, setShowDateFrom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [salesInfo, setSalesInfo] = useState({});

  useEffect(() => {
    loadSales();
  }, []);

  const onChangeDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || dateFrom;
    setShowDateFrom(Platform.OS === "ios");
    setDateFrom(currentDate);
  };

  const onChangeDateTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateTo;
    setShowDateTo(Platform.OS === "ios");
    setDateTo(currentDate);
  };

  const loadSales = async (filter = false) => {
    try {
      setLoading(true);
      let formBody;
      formBody = {
        serviceCode: "SALES",
        from: dateFrom,
        to: dateTo,
      };

      if (filter) {
        formBody.filter = true;
      }

      console.log(formBody);

      let url = Config.base_url + "/app/info";

      let { error, errorMessage, response } = await new Network().post(
        url,
        formBody
      );

      setLoading(false);

      if (error) {
        return Alert.alert("Sales", errorMessage);
      }

      if (response.transactions) {
        setSalesInfo(response);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Sales", error.toString());
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={true}>
        <Header
          text="Account Sales"
          backAction={() => props.navigation.goBack()}
        />

        <View style={styles.box}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.title}>Enter Date</Text>
          </View>

          <View style={styles.inputWrapper}>
            <DatePicker
              value={dateFrom}
              onDateChange={onChangeDateFrom}
              label="From"
              showDate={Platform.OS === "ios" ? true : showDateFrom}
              showDatePicker={() => setShowDateFrom(true)}
              // width={200}
            />
          </View>

          <View style={styles.inputWrapper}>
            <DatePicker
              value={dateTo}
              onDateChange={onChangeDateTo}
              label="To"
              showDate={Platform.OS === "ios" ? true : showDateTo}
              showDatePicker={() => setShowDateTo(true)}
              // width={200}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <WhiteButton
              onPress={() => loadSales(true)}
              bordered
              text="Filter"
            />
          </View>
        </View>

        {salesInfo.transactions && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.heading}>{salesInfo.time}</Text>

            <Text style={styles.heading}>
              Total Sales:{" "}
              {Helper.formattedAmountWithNaira(salesInfo.amount.toString())}
            </Text>

            <Text style={styles.heading}>
              Total Transaction Count: {salesInfo.count}
            </Text>

            <View
              style={{
                borderWidth: 0.4,
                borderRadius: 10,
                paddingHorizontal: 5,
                borderColor: "#333333",
                paddingVertical: 20,
              }}
            >
              <Text style={styles.heading}>Product Sales Breakdown</Text>
              {salesInfo.transactions.map((product, index) => (
                <View key={product.name + index}>
                  <Divider
                    style={{ backgroundColor: "#333333", height: 0.5 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 10,
                      flex: 1,
                      marginVertical: 10,
                    }}
                  >
                    <View style={{ flex: 0.5 }}>
                      <Text style={styles.heading2}>
                        {index + 1}. {product.name}
                      </Text>
                    </View>
                    <View style={{ flex: 0.5, }}>
                      <Text style={styles.heading2}>
                        Sales:{" "}
                        {Helper.formattedAmountWithNaira(
                          product.sum.toString()
                        )}
                      </Text>
                      <Text style={styles.heading2}>
                        Count: {product.count}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
