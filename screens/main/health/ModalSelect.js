import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import BorderedCancelButton from "../../../components/BorderedCancelButton";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",

    // alignItems:'center',
    paddingTop: Platform.select({
      ios: '30%',
      android: 20,
    }),

    paddingBottom: Platform.select({
      ios: '10%',
      android: 20,
    }),
    paddingHorizontal: 15,
  },

  closeBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    // marginRight: 10,
    // marginTop: 5,
  },

  titleWrapper: {
    marginBottom: 10,
    paddingLeft: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    // lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginBottom: 5,
  },

  modalView: {
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    padding: 10,
    paddingBottom: 50,
    borderRadius: 15,
  },

  contents: {
    padding: 5,
    justifyContent: "space-between",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    // paddingVertical: 10,
  },

  label: {
    fontWeight: "500",
    fontStyle: "normal",
    // lineHeight: 40,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
    fontSize: 17,
  },

  labelWrapper: {
    marginLeft: 20,
  },

  productWrapper: {
    flex: 0.6,
    flexDirection: "row",
  },

  amount: {
    flex: 0.4,
    alignItems: "flex-end",
    paddingRight: 10,
  },

  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
    marginVertical: 15,
  },

  inputBox: {
    flexDirection: "row",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    padding: 5,
    paddingLeft: 10,
    borderColor: "#f7f7f7",
  },

  inputIconContainer: {
    alignItems: "flex-end",
    bottom: 1,
    flex: 0.2,
    alignSelf: "flex-end",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    // lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  inputLabelSubText: {
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    // lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
});

export default function ModalSelect({
  closModal,
  showModal,
  visible,
  inputLabel,
  selectTitle,
  items,
  selected,
  onSelect,
  iconName = "chevron-down-outline",
  iconColor = "#17375e",
  iconSize = 20,
  inputWidth,
  placeholder,
  disabled = false,
}) {
  applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

  const [item, setItem] = useState(selected);

  const onValueChange = (itemValue, itemIndex) => {
    setItem(itemValue);
    onSelect(itemValue);
  };

  const ItemObj = items.find((item) => item.value === selected);

  const modalVisible = disabled === true ? false : visible;

  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{inputLabel}</Text>
      </View>

      <TouchableWithoutFeedback onPress={showModal}>
        <View
          style={[
            styles.inputBox,
            applyWidth,
            disabled && { backgroundColor: "#eff6ff" },
          ]}
        >
          <View style={{ flex: 0.8 }}>
            {ItemObj ? (
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.inputLabel}>{ItemObj.month}{" - "}</Text>

                  <Text style={[styles.inputLabel]}>{ItemObj.amount}</Text>
                </View>

                {ItemObj.condition ? (
                  <Text style={styles.inputLabelSubText}>{ItemObj.condition}</Text>
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <Text style={[styles.inputLabel]}>
                {placeholder ? placeholder : "Select an item..."}
              </Text>
            )}
          </View>

          <View style={styles.inputIconContainer}>
            <Icon name={iconName} size={iconSize} color={iconColor} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closModal}
      >
        <View style={[styles.container]}>

        <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.contents}>
              <View style={styles.closeBox}>
                <BorderedCancelButton onPress={closModal} />
              </View>

              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{selectTitle}</Text>
              </View>

              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onValueChange(item.value, index)}
                >
                  <View style={styles.row}>
                    <View style={styles.productWrapper}>
                      <View style={styles.labelWrapper}>
                        <Text style={styles.inputLabel}>{item.month}</Text>
                        {item.condition ? (
                          <Text style={styles.inputLabelSubText}>{item.condition}</Text>
                        ) : (
                          <></>
                        )}
                      </View>
                    </View>

                    <View style={styles.amount}>
                      <Text style={styles.inputLabel}>{item.amount}</Text>
                    </View>
                  </View>
                  <View style={styles.line37}></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

        </View>
      </Modal>
    </View>
  );
}
