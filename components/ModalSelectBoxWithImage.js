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

import GreenButton from "./GreenButton";

import WhiteButton from "./WhiteButton";

import BorderedCancelButton from "./BorderedCancelButton";

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
      ios: '20%',
      android: 20,
    }),
    paddingHorizontal: 15,
  },

  closeBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: 5,
  },

  titleWrapper: {
    // marginBottom: 10,
    // paddingLeft: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  label: {
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
    fontSize: 15,
  },

  labelWrapper: {
    marginLeft: 20,
    // justifyContent:'flex-end'
  },

  productWrapper: {
    flex: 0.9,
    flexDirection: "row",
  },

  image: {
    width: 65,
    height: 24,
  },

  imageWrapper: {
    // justifyContent: "center",
    justifyContent:'flex-end',
    alignItems: "flex-end",
    width: 75,
    height: 37,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderStyle: "solid",
    // borderColor: "#030875"
  },

  tick: {
    flex: 0.1,
    alignItems: "flex-end",
  },
  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
  },

  inputBox: {
    flexDirection: "row",
    height: 50,
    // borderRadius: 100,
    backgroundColor: "#f7f7f7",
    padding: 10,
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
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default function ModalSelectBoxWithImage({
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
  inputLabelStyle,
}) {
  applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

  const [item, setItem] = useState(selected);

  const onValueChange = (itemValue, itemIndex) => {
    setItem(itemValue);
    onSelect(itemValue);
  };

  const ItemObj = items.find((item) => JSON.stringify(item.value) === JSON.stringify(selected));

  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, inputLabelStyle]}>{inputLabel}</Text>
      </View>

      <TouchableWithoutFeedback onPress={showModal}>
        <View style={[styles.inputBox, applyWidth]}>
          <View
            style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}
          >
            {ItemObj ? (
              <>
                <View
                  style={[
                    styles.imageWrapper,
                    ItemObj.borderColor
                      ? { borderColor: ItemObj.borderColor }
                      : {},
                  ]}
                >
                  <Image style={styles.image} source={ItemObj.image} />
                </View>
                <Text style={[ styles.inputLabel, {color:"#17375e"}]}>{ItemObj.label}</Text>
              </>
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
        animationType="fade"
        transparent={true}
        visible={visible}
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

                      
                      <View
                        style={[
                          styles.imageWrapper,
                          item.borderColor
                            ? { borderColor: item.borderColor }
                            : {},
                        ]}
                      >
                        <Image style={styles.image} source={item.image} />
                      </View>


                      <View style={styles.labelWrapper}>
                        <Text style={styles.label}>{item.label}</Text>
                      </View>

                      
                    </View>

                    <View style={styles.tick}>
                      {JSON.stringify(selected) ==
                        JSON.stringify(item.value) && (
                        <Icon
                          name="checkmark-outline"
                          size={30}
                          color="#01cf13"
                        />
                      )}
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
