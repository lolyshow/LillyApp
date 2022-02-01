import POS from "../native_modules/POS";
import { Alert, Image } from "react-native";
import PrintStringFormat from "./PrintStringFormat";

const convertImageToBase64 = async (image) => {
  let res = "";
  let uri = Image.resolveAssetSource(image).uri;

  await ImgToBase64.getBase64String(uri)
    .then((base64String) => {
      res = base64String;
    })
    .catch((err) => {
      res = null;
      console.log(err);
    });

  return res;
};

const getItems = (items, image = null) => {
  let itemArray =[];
  let agentItem = {
    isMultiline: false,
    header: { text: "Agent", align: "left" },
    body: { text: global.username, align: "right" },
  };
  itemArray.push(agentItem);
  items.forEach((item) => {
    if (item.value != null && item.label.toLowerCase() != "agent") {
      var label = item.label;
      var value = String(item.value).replace("\u20A6", "N");
      itemArray.push({
        isMultiline: false,
        header: { text: label, align: "left" },
        body: { text: value, align: "right" },
      });
    }
  });
  return itemArray;
};

const Print = async (printObjectsArray, image = null) => {
  try {
    let array = getItems(printObjectsArray);
    let string = PrintStringFormat(array);
    console.log(string);
    POS.print(string, (responseCode, data) => {
      if ("00" == responseCode) {
        Alert.alert("Message", "Successful");
      } else if ("02" == responseCode) {
        Alert.alert("Error", "Transaction Failed");
      } else if ("03" == responseCode) {
        Alert.alert("Error", "Transaction Cancelled");
      } else if ("04" == responseCode) {
        Alert.alert("Error", "Invalid Format");
      } else if ("05" == responseCode) {
        Alert.alert("Error", "Wrong Parameter");
      } else if ("06" == responseCode) {
        Alert.alert("Error", "Transaction Timeout");
      } else if ("09" == responseCode) {
        Alert.alert("Error", "Activity Cancelled");
      } else {
        Alert.alert("Error", "Intent failed to pass result");
      }
    });
  } catch (error) {
    Alert.alert("Error", "An error occurred");
  }
};

export default Print;
