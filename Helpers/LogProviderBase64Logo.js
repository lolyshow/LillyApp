import ProvidersLogo from "./ProvidersLogo";
import ImgToBase64 from "react-native-image-base64";
import { Image } from "react-native";

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

const LogProviderBase64Logo = async () => {
  try {
    let LogoBase64 = [];

    for (let element of ProvidersLogo) {
      let { value, image, category } = element;

      let imageUri = Image.resolveAssetSource(image).uri;

      let img = await convertImageToBase64(imageUri).then((res) => res);

      LogoBase64.push({
        value,
        image: img,
        category,
      });
    }

    console.log(LogoBase64);
  } catch (error) {
    console.log(err);
  }
};

export default LogProviderBase64Logo;
