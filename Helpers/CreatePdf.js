import { Alert, Image, Platform, PermissionsAndroid } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import ImgToBase64 from "react-native-image-base64";
import Helper from "./Helper";
import ShagoLogoBase64 from "./ShagoLogoBase64";

const isPermitted = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "External Storage Write Permission",
          message: "App needs access to Storage data",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      alert("Write permission err", err);
      return false;
    }
  } else {
    return true;
  }
};

const createPDF = async (
  printObjectsArray = [],
  image = null,
  filename = "receipt"
) => {
  try {
    if (await isPermitted()) {
      let htmlBody = "";
      const shagoLogoTag = `<img src="data:image/png;base64,${ShagoLogoBase64}" alt="" width=120; height=40;  ></img>`;
      const productLogoTag = image
        ? await convertImageToBase64(image).then(
            (res) =>
              `<img src="data:image/png;base64,${res}" alt="Lilly" style="${imageStyle}" ></img>`
          )
        : "";

      const contactInfo = `<div style="${contactInfoStyle}"> <div>SUPPORT LINES</div> <div><span>+2347000000000,</span>  <span>+234900000000</span></div>  <div>support@lillynaija.com</div> </div>`;

      htmlBody += `<div style="${row}"><div style="${col_sm}">Agent</div><div style="${col_sm_right}">${global.user.username}</div></div><hr>`;

      printObjectsArray.forEach((item) => {
        if (item.value != null && item.label.toLowerCase() !== "agent") {
          htmlBody += `<div style="${row}"><div style="${col_sm}">${item.label}</div><div style="${col_sm_right}">${item.value}</div></div><hr>`;
        }
      });

      const html = `<div style="${wrapper}"><div ><div style="${logo}">${productLogoTag}</div><div style="${main}">${htmlBody}</div><div style="${footer}"> <div>${shagoLogoTag}</div> <div style="${thankYouMessage}">Thanks for using our Service</div> ${contactInfo} </div></div></div>`;

      const options = {
        html: html,
        fileName: filename,
        // directory: "Documents",
      };

      let file = await RNHTMLtoPDF.convert(options);

      FileViewer.open(file.filePath, { showOpenWithDialog: true })
        .then(() => {
          // success
        })
        .catch((error) => {
          // error
          Alert.alert("Error", "Could not generate PDF");

          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);

    Alert.alert("Error", "Could not generate PDF");
  }
};

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

const wrapper =
  "display:flex; justify-content:center; align-items:center; width:100%;";

const row = "display:flex; flex-direction:row; justify-content:space-between;";

const col_sm =
  "display:flex; flex-direction:column;  padding:0.5em; overflow-wrap:break-word;";

const col_sm_right =
  "display :flex; flex-direction:column; padding :0.5em; overflow-wrap:break-word; text-align:right;";

const logo = "margin-bottom:0.1em; text-align:center; margin-bottom:0.5em";

const main = "padding:1em;  border: 0.5px groove #f2f2f2;";

const footer =
  "display:flex; flex-direction:column; justify-content:center; align-items:center;";

const thankYouMessage =
  "font-weight:bold; font-size:1em;  text-align:center; margin-bottom:0.5em;";

const imageStyle = "width:200px; height:80px; object-fit: contain;";

const contactInfoStyle =
  'text-align:center; font-size:18; font-family: "Times New Roman", Times, serif;';

export default createPDF;
