import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import GreenButton from "./GreenButton";
import WhiteButton from "./WhiteButton";
import {
  //  Print,
  ExternalPrint,
} from "../Helpers/BluetoothPrinter";
import Print from "../Helpers/BluetoothPrinterComponent";
import PosPrintComponents from "../Helpers/PosPrintComponents";
import createPDF from "../Helpers/CreatePdf";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Helper from "../Helpers/Helper";
import Config from "../Helpers/Config";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  row: {
    marginVertical: 5,
  },
});

export default function PrintComponents({
  showPrintReceipt = false,

  showDownloadPdf = false,

  showExternalPrintReceipt = false,

  showHomeReturn = false,

  printObjectsArray = [],

  image = null,
}) {
  const navigation = useNavigation();
  const [printReceiptProcessing, setPrintReceiptProcessing] = useState(false);
  const [
    printReceiptWithImageProcessing,
    setPrintReceiptWithImageProcessing,
  ] = useState(false);
  const [downloadPdfProcessing, setDownloadPdfProcessing] = useState(false);

  const [
    externalPrintReceiptProcessing,
    setExternalPrintReceiptProcessing,
  ] = useState(false);

  const printBluetooth = async () => {
    setPrintReceiptProcessing(true);

    if (Config.isPos) {
      await PosPrintComponents(printObjectsArray).then((result) => result);
    } else {
      await Print(printObjectsArray).then((result) => result);
    }

    setPrintReceiptProcessing(false);
  };

  const printBluetoothWithImage = async () => {
    setPrintReceiptWithImageProcessing(true);
    await Print(printObjectsArray, image).then((result) => result);
    setPrintReceiptWithImageProcessing(false);
  };

  const printPdf = async () => {
    setDownloadPdfProcessing(true);
    await createPDF(printObjectsArray, image).then((result) => result);
    setDownloadPdfProcessing(false);
  };

  const externalPrintBluetooth = async () => {
    setExternalPrintReceiptProcessing(true);
    await ExternalPrint(printObjectsArray).then((result) => result);
    setExternalPrintReceiptProcessing(false);
  };

  return (
    <View style={styles.container}>
      {showPrintReceipt && (
        <>
          <View style={styles.row}>
            <GreenButton
              text={"Print receipt"}
              disabled={printReceiptProcessing}
              processing={printReceiptProcessing}
              onPress={() => printBluetooth()}
            />
          </View>

          {!Config.isPos && (
            <View style={styles.row}>
              <WhiteButton
                bordered
                text={"Print receipt"}
                disabled={printReceiptWithImageProcessing}
                processing={printReceiptWithImageProcessing}
                onPress={() => printBluetoothWithImage()}
              />
            </View>
          )}
        </>
      )}

      {/* { !Config.isPos && showExternalPrintReceipt && Platform.OS == "android" && (
        <View style={styles.row}>
          <WhiteButton
            text={"External Print Receipt"}
            bordered
            disabled={externalPrintReceiptProcessing}
            processing={externalPrintReceiptProcessing}
            onPress={() => externalPrintBluetooth()}
          />
        </View>
      )} */}

      {!Config.isPos && showDownloadPdf && (
        <View style={styles.row}>
          <WhiteButton
            text={"Download Reciept in PDF"}
            bordered
            disabled={downloadPdfProcessing}
            processing={downloadPdfProcessing}
            onPress={() => printPdf()}
          />
        </View>
      )}

      {showHomeReturn && (
        <View style={styles.row}>
          <WhiteButton
            text={
              <Icon size={22} name="home" color="#01cf13">
                {" "}
                Home
              </Icon>
            }
            onPress={() => navigation.navigate("Home")}
            bordered
          />
        </View>
      )}
    </View>
  );
}
