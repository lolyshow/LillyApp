import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Share
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Clipboard from "@react-native-clipboard/clipboard";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import Header from "../../../../components/Header";
import InputBox from "../../../../components/InputBox";
import ClipBoardModal from "../../../../components/ClipBoardModal";
import SocialMediaModal from "./SocialMediaModal";
import Helper from "../../../../Helpers/Helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },

  blueText: {
    fontSize: 24,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
  },

  row: {
    flexDirection: "row",
  },

  buttonWrapper: {
    alignSelf: "stretch",
    marginTop: 20,
  },
});

export default function ShareReferral({ navigation }) {
  const [shareValue, setShareValue] = useState(
    "https://www.lillypayment.com//register?referred_id=" +
      Helper.getPropValue(global, "wallet.code")
  );

  const [showModal, modalToggle] = useState(false);

  const [IconGroup, setIconGroup] = useState([
    { name: "facebook-square", size: 60, color: "#2196f3" },
    { name: "twitter-square", size: 60, color: "#55acee" },
    { name: "instagram-square", size: 60, color: "#e1306c" },
    { name: "whatsapp-square", size: 60, color: "#4caf50" },
  ]);

  const [showClipBoard, setClipBoardModal] = useState(false);

  const displayClipBoard = () => {
    Clipboard.setString(shareValue);
    setClipBoardModal(true);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({message:shareValue});

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  
  }


  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={styles.container.backgroundColor} /> */}

      <Header
        text="Share With A Friend"
        backAction={() => navigation.goBack()}
      />

      <View style={{}}>
        <InputBox
          placeholder="join.lilly.com/23157908"
          inputLabel="Referral Link"
          editable={false}
          inputValue={shareValue}
          inputStyle={{ color: "grey" }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "40%",
        }}
      >
        <View style={{ flex: 0.7 }}>
          <GreenButton
            text="Share link"
            onPress={() => onShare() }
            // onPress={() => modalToggle(true)}
          />
        </View>

        <View
          style={{ flex: 0.3, alignSelf: "center", alignItems: "flex-end" }}
        >
          <TouchableOpacity onPress={() => displayClipBoard()}>
            <Icon name="copy" size={30} color="#01cf13"></Icon>
          </TouchableOpacity>
        </View>
      </View>

      <SocialMediaModal
        icons={IconGroup}
        visible={showModal}
        closModal={() => modalToggle(false)}
        onIconPress={(item) => alert(item.name)}
      />

      <ClipBoardModal
        closModal={() => setClipBoardModal(false)}
        itemCopied="Referral link Copied"
        message="You have copied Referral link"
        visible={showClipBoard}
      />
    </View>
  );
}
