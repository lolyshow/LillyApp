import Storage from "./Storage";
import { Alert, Image, Platform } from "react-native";
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from "react-native-bluetooth-escpos-printer";
import dateFormat from "dateformat";
import ImgToBase64 from "react-native-image-base64";
import Helper from "./Helper";
import shagoLogoBase64_ from "./shagoLogoBase64_";

const convertImageToBase64 = async (image) => {
  let res = null;
  await ImgToBase64.getBase64String(image)
    .then((base64String) => {
      res = base64String;
    })
    .catch((err) => {
      res = null;
      console.log(err);
    });

  return res;
};

const Print = async (printObjectsArray, image = null) => {
  try {
    let [paperSizePromise, printerNamePromise] = await Promise.all([
      Storage.getStringData("paperSize").then((result) => result),
      Storage.getObjectData("printerName").then((result) => result),
    ]).then((results) => results);

    let paperSize = paperSizePromise.data ?? 32;
    let printerName = printerNamePromise.data;

    if (!Helper.getPropValue(printerName, "address")) {
      Alert.alert(
        "Error",
        "You may not have selected a printer. Please pair your device with a bluetooth printer and try again."
      );
      return;
    }

    paperSize = parseInt(paperSize);

    let address = printerName.address;

    await BluetoothManager.connect(address) // the device address scanned.
      .then(
        (s) => {
          printing(printObjectsArray, image);
        },
        (e) => {
          Alert.alert("Bluetooth Printer", e.toString());
        }
      );
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};
const printing = async (printObjectsArray, image = null) => {
  try {
    let base64Img = null;

    if (image) {
      base64Img = await convertImageToBase64(image).then((res) => res);
    }

    let dateField = printObjectsArray.find(
      (el) => el.label.toLocaleLowerCase() == "date"
    );

    if (Platform.OS == "ios") {
      if (base64Img) {
        await BluetoothEscposPrinter.printPic(base64Img, {
          width: 200,
          left: 80,
        }).catch(async (error) => {});
      }
    } else {
      if (base64Img) {
        await BluetoothEscposPrinter.printPic(base64Img, {
          width: 200,
          left: 80,
        });
      }
    }

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );

    await BluetoothEscposPrinter.printText("Transaction Summary\r\n", {});

    //-----------------------------------------------------------Dynamic fields --------------------------------------------------------------------------

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );

    let columnWidths = [16, 14];
    await BluetoothEscposPrinter.printText(
      "--------------------------------\r\n",
      {}
    );
    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["ITEM", "DETAIL"],
      {}
    );
    await BluetoothEscposPrinter.printText(
      "--------------------------------\r\n",
      {}
    );

    await BluetoothEscposPrinter.printText(
      `Agent: ${global.user.username}\r\n`,
      {}
    );

    if (!dateField) {
      await BluetoothEscposPrinter.printText(
        `Date: ${dateFormat(new Date(), "dd/mm/yyyy hh:MM:ss tt")}\r\n`,
        {}
      );
    }

    for (let el of printObjectsArray) {
      if (el.value != null && el.label.toLowerCase() != "agent") {
        await BluetoothEscposPrinter.printText(
          `${el.label}: ${String(el.value).replace("\u20A6", "N")}\r\n`,
          {}
        );
      }
    }

    await BluetoothEscposPrinter.printText("\r\n", {});

    //-----------------------------------------------------------End Dynamic fields --------------------------------------------------------------------------

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.printText(
      "(Customer & Agent Receipt)\r\n",
      {}
    );

    await BluetoothEscposPrinter.printText("Thank you, visit again.\r\n", {});

    if (shagoLogoBase64_) {
      if (Platform.OS == "ios") {
        await BluetoothEscposPrinter.printPic(shagoLogoBase64_, {
          width: 200,
          left: 80,
        }).catch(async (error) => {});
      } else {
        await BluetoothEscposPrinter.printPic(shagoLogoBase64_, {
          width: 200,
          left: 80,
        });
      }
    } else {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.printText("Lilly Payments\r\n", {});
    }
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.printText("\r\nThe e-Market Space\r\n", {});

    await BluetoothEscposPrinter.printText("CUSTOMER CARE\r\n", {});
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );
    await BluetoothEscposPrinter.printText(
      "+234900000000, +234900000000\r\n",
      {}
    );
    await BluetoothEscposPrinter.printText(
      "support@lillynaija.com\r\n",
      {}
    );
    await BluetoothEscposPrinter.printText("\n\r\n\r", {});
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};

export default Print;
