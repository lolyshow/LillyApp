import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import BorderedCancelButton from "../../../../components/BorderedCancelButton";

import Icon from "react-native-vector-icons/FontAwesome5";

const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  closeBox: {
    alignSelf: "flex-end",
    marginTop: 20,
  },

  modalView: {
    flex:0.6,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    padding: 10,
    paddingBottom: 50,
    paddingHorizontal: 30,
  },

  detailBox: {
    marginTop: 20,
    padding: 20,
    alignSelf: "center",

    borderRadius: 18,
    backgroundColor: "#f8f8f8",
    justifyContent: "space-between",
  },

  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
    marginTop: 20,
    marginBottom: 10,
  },

  blueText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },
  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
});

export default function SocialMediaModal({
  closModal,
  visible,
  icons,
  onIconPress,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <View style={[styles.container]}>
        <View style={styles.modalView}>
          <View style={styles.closeBox}>
            <BorderedCancelButton onPress={closModal} />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.blueText}>Share link</Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.greyText}>
              Share your referral link with your friends
            </Text>
          </View>

          <View style={styles.line37}></View>

          <FlatList
            contentContainerStyle={{
              flex: 1,
            }}
            data={icons}
            horizontal={false}
            key={"_"}
            numColumns={4}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <>
                <View key={index + "_"} style={{ flex: 0.25 }}>
                  <TouchableOpacity onPress={() => onIconPress(item)}>
                    <Icon
                      name={item.name}
                      size={item.size}
                      color={item.color}
                    ></Icon>
                  </TouchableOpacity>
                </View>
              </>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
