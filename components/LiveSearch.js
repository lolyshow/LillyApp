import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableNativeFeedback,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Divider, Searchbar } from "react-native-paper";
import InputBox from "./InputBox";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 5,
  },
});

export default function LiveSearch({
  url,
  searchWord,
  titleKey,
  descriptionKey,
  nameKey,
  onValueChange,
  searchInputLabel,
  searchInputPlaceholder,
}) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [searchTimer, setSearchTimer] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showEmptyResponse, setShowEmptyResponse] = useState(false);

  const fetchData = async (text) => {
    let urlQuery = `${url}?${searchWord}=${text}`;

    try {
      setProcessing(true);
      let responseData = await axios
        .get(urlQuery)
        .then((response) => response.data);
      setProcessing(false);
      let { status } = responseData;

      if (status == "200") {
        let responseResult = responseData.results;
        setShowEmptyResponse(false);
        setResults(responseResult);
      } else {
        setResults([]);
        setShowEmptyResponse(true);
      }
    } catch (err) {
      setProcessing(false);
      console.log(err);
    }
  };

  const onchangeSelect = (item) => {
    setResults([]);
    setInput(item[titleKey]);
    onValueChange(item[titleKey]);
  };

  const onChangeText = (text) => {
    setInput(text);
    onValueChange(text);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    if (text.length > 2) {
      setSearchTimer(
        setTimeout(() => {
          fetchData(text);
        }, 1000)
      );
    } else {
      setResults([]);
    }
  };
  return (
    <View style={styles.container}>
      {/* <InputBox
        inputLabel={searchInputLabel}
        placeholder={searchInputPlaceholder}
        onChangeText={onChangeText}
        inputValue={input}
      /> */}
      <Text style={styles.inputLabel}>{searchInputLabel}</Text>
      <Searchbar
        placeholder={searchInputPlaceholder}
        onChangeText={onChangeText}
        value={input}
        style={{ backgroundColor: "#f7f7f7", height: 50, borderRadius: 10 }}
        inputStyle={{ fontSize: 14, fontWeight: "500", color: "#17375e" }}
      />
      {processing && (
        <View>
          <ActivityIndicator color="#17375e" />
        </View>
      )}
      {results.length > 0 && (
        <ScrollView
          style={{
            maxHeight: 300,
            borderWidth: 1.5,
            borderColor: "#eff6ff",
            paddingVertical: 20,
          }}
          nestedScrollEnabled={true}
        >
          {results.map((item, index) => (
            <TouchableOpacity
              onPress={() => onchangeSelect(item)}
              key={"index#" + index}
            >
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 0.2,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        color: "#707070",
                      }}
                    >
                      {item[nameKey]}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 0.7 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                      {item[titleKey]}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 13,
                        color: "#707070",
                      }}
                    >
                      {item[descriptionKey]}
                    </Text>
                  </View>
                </View>

                <Divider
                  style={{
                    marginVertical: 10,
                    backgroundColor: "#b8a399",
                  }}
                />
              </>
            </TouchableOpacity>
          ))}

          {/* <FlatList
            data={results}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onchangeSelect(item)}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 0.2,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        color: "#707070",
                      }}
                    >
                      {item[nameKey]}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 0.7 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                      {item[titleKey]}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 13,
                        color: "#707070",
                      }}
                    >
                      {item[descriptionKey]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingVertical: 20, color: "#ffff" }}
            ItemSeparatorComponent={() => (
              <Divider
                style={{
                  marginVertical: 10,
                  backgroundColor: "#b8a399",
                }}
              />
            )}
            keyExtractor={(item, index) => "#" + index}
            nestedScrollEnabled={true}
          /> */}
        </ScrollView>
      )}

      {results.length == 0 && showEmptyResponse && (
        <>
          <Text>No result available</Text>
        </>
      )}
    </View>
  );
}
