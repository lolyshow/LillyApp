import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { List } from "react-native-paper";
import Helper from "../../../Helpers/Helper";
import Icon from "react-native-vector-icons/FontAwesome5";

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectedStyles: {},
});

export default function MultiChoiceList({
  data,
  onSelect = function() {},
  selected = {},
  title = "",
}) {
  const [item, setItem] = useState(selected);

  const onValueChange = (itemValue, itemIndex) => {
    setItem(itemValue);
    onSelect(itemValue);
  };

  const currentCode = Helper.getPropValue(selected, "code");
  console.log("thisIsDataToBeLoged",data);
  const ItemObj = data.find(
    (item) => JSON.stringify(item.code) === JSON.stringify(currentCode)
  );
  console.log("thisIsDataToBeLogedInInInIn",data);
  return (
    <View style={styles.container}>
      <View>
        <List.Section
          title={title}
          titleStyle={{
            fontSize: 16,
            fontWeight: "500",
            fontStyle: "normal",
            lineHeight: 21,
            letterSpacing: 0,
            textAlign: "left",
            color: "#333333",
          }}
        >
          <List.AccordionGroup>
            {data.map((item, index) => (
              <View
                key={"start#" + index}
                style={[
                  {
                    borderRadius: 10,
                    marginVertical: 5,
                    borderColor: "#333333",
                    borderWidth: 0.3,
                  },
                  ItemObj == item && {
                    borderColor: "#17375e",
                    backgroundColor: "#f7f7f7",
                    color: "#ffffff",
                    borderWidth: 1.5,
                  },
                ]}
              >
                <List.Accordion
                  id={index + 1}
                  title={item.name}
                  titleNumberOfLines={0}
                >
                  {console.log("thisisMyIteminininining",data)}
                  {/* {item.items.map((list, index) => ( */}
                    {data.map((list, index) => ( 
                    <TouchableOpacity
                      onPress={() => onValueChange(list, index)}
                      key={"list#" + index}
                    >
                      <List.Item
                        description={
                          <>
                            <Icon
                              name={
                                list == selected ? "check-circle" : "circle"
                              }
                              solid={list == selected}
                              color="#17375e"
                              size={20}
                            />

                            <Text>{`  ${
                              list.month
                            } month(s) - ${Helper.formattedAmountWithNaira(
                              list.price
                            )}`}</Text>
                          </>
                        }
                        descriptionNumberOfLines={0}
                        titleStyle={{ marginTop: 0, paddingTop: 0, height: 0 }}
                        descriptionStyle={{
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: 24,
                          letterSpacing: 0,
                          textAlign: "left",
                          color: "#333333",
                          fontSize: 14,
                          flexWrap: "wrap",
                        }}
                        style={[
                          {
                            borderColor: "#333333",
                            borderTopWidth: 0.25,
                          },
                          list == selected && {
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "#17375e",
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </List.Accordion>
              </View>
            ))}
          </List.AccordionGroup>
        </List.Section>
      </View>
    </View>
  );
}
