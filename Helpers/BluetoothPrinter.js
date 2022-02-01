import PrintFormat from "../native_modules/PrintFormat";
import BluetoothPrint from "../native_modules/BluetoothPrint";
import PrintExample from "../native_modules/PrintExample";
import Storage from "./Storage";
import { Alert, Image } from "react-native";

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
  let itemString = "";
  itemString += "Agent<FIELD>" + global.user.username;

  items.forEach((item) => {
    if (item.value != null && item.label.toLowerCase() != "agent") {
      itemString += `<ITEM>${item.label}<FIELD>${String(item.value).replace(
        "\u20A6",
        "N"
      )}`;
    }
  });

  return itemString;
};

const getExternalPrintItems = (items, image = null) => {
  let itemString = "";
  itemString += "Agent <020>" + global.user.username;
  items.forEach((item) => {
    if (item.value != null && item.label.toLowerCase() != "agent") {
      itemString += `<100>${item.label} <020>${String(item.value).replace(
        "\u20A6",
        "N"
      )}`;
    }
  });

  return itemString;
};

const Print = async (printObjectsArray, image = null) => {
  try {
    let [paperSizePromise, printerNamePromise] = await Promise.all([
      Storage.getStringData("paperSize").then((result) => result),
      Storage.getStringData("printerName").then((result) => result),
    ]).then((results) => results);

    let paperSize = paperSizePromise.data ?? 32;
    let printerName = printerNamePromise.data;

    if (!printerName) {
      Alert.alert(
        "Error",
        "It seems no printer is selected/paired. Please pair your device with a bluetooth printer. Then select the paired bluetooth printer on the app under settings tab."
      );
      return;
    }

    paperSize = parseInt(paperSize);
    let items = getItems(printObjectsArray);

    await PrintFormat.format(null, items, paperSize, false, (msg) => {
      console.log(msg);
      BluetoothPrint.print(msg, printerName, (response) => {
        Alert.alert("Message", response.toString());
      });
    });
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};

const ExternalPrint = async (printObjectsArray, image = null) => {
  try {
    let items = getExternalPrintItems(printObjectsArray);
    await PrintExample.print(items);
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};

export { Print, ExternalPrint };
