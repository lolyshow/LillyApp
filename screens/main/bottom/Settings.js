import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  AppState,
} from "react-native";
import GreenButton from "../../../components/GreenButton";
import ModalSelectBox from "../../../components/ModalSelectBox";
import WhiteButton from "../../../components/WhiteButton";
import Storage from "../../../Helpers/Storage";
import InputBox from "../../../components/InputBox";
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import FingerprintScanner from "react-native-fingerprint-scanner";
import Helper from "../../../Helpers/Helper";
import SelectBox from "../../../components/SelectBox";
import Icon from "react-native-vector-icons/FontAwesome5";
import BluetoothStateManager from "react-native-bluetooth-state-manager";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  upperContainer: {
    backgroundColor: "#17375e",
    flex: 0.2,
    padding: 20,
    justifyContent: "flex-end",
  },

  lowerContainer: {
    flex: 0.8,
  },

  settingsText: {
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 54,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  inputWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  buttonWrapper: {
    paddingHorizontal: "10%",
    marginTop: 25,
  },
  heading: {
    color: "#17375e",
    fontSize: 15,
    fontWeight: "bold",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "3%",
    height: 60,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dce7f4",
    paddingHorizontal: 10,
  },

  bluetoothBox: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dce7f4",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginHorizontal: "3%",
  },
});

export default class Settings extends Component {
  _listeners = [];

  constructor() {
    super();
    this.state = {
      printerName: null,
      paperSize: "32",
      autoLogin: false,
      biometricLogin: false,
      biometryType: undefined,
      devices: [],
      pairedDs: [],
      bluetoothOpened: false,
      bluetoothState: "",
      loading: true,
      scanCount: 0,
      currentPrinter: null,
    };
  }

  async componentDidMount() {
    await Promise.all([this.loadAutoLogin(), this.initBluetooth()]);
  }

  componentWillUnmount() {
    //usually to destroy states or variables or components, reset the passed variables so that printer can start afresh again
    for (let ls in this._listeners) {
      this._listeners[ls].remove();
    }
  }

  onchangeTouchIdoLogin = (res) => {
    if (res === true) {
      FingerprintScanner.isSensorAvailable()
        .then((biometryType) => {
          if (this.state.autoLogin === true) {
            this.saveAutoLogin(false);
          }
          this.saveTouchIDLogin(res, biometryType);
        })
        .catch((error) => {
          return Alert.alert("Biometric Login Set Up", error.message);
        });
    } else {
      this.saveTouchIDLogin(res);
    }
  };

  onchangeAutoLogin = (res) => {
    if (this.state.biometricLogin === true && res === true) {
      this.saveTouchIDLogin(false);
    }

    this.saveAutoLogin(res);
  };

  saveTouchIDLogin = (res, biometryType = undefined) => {
    this.setState((state) => ({
      biometricLogin: !state.biometricLogin,
      biometryType,
    }));
    Storage.storeObjectData("biometricLogin", res);
  };

  saveAutoLogin = (res) => {
    this.setState((state) => ({
      autoLogin: !state.autoLogin,
    }));

    Storage.storeObjectData("autoLogin", res);
  };

  loadAutoLogin = async () => {
    let [autoLoginPromise, biometricLoginPromise] = await Promise.all([
      Storage.getObjectData("autoLogin").then((res) => res),
      Storage.getObjectData("biometricLogin").then((res) => res),
    ]).then((results) => results);

    if (autoLoginPromise.data != null) {
      this.setState({ autoLogin: autoLoginPromise.data });
    }

    if (biometricLoginPromise.data != null) {
      this.setState({ biometricLogin: biometricLoginPromise.data });
    }
  };

  getPairedBluetooth = async () => {
    let [printerNamePromise, paperSizePromise] = await Promise.all([
      Storage.getObjectData("printerName").then((res) => res),
      Storage.getStringData("paperSize").then((res) => res),
    ]).then((results) => results);

    let printerName = Helper.getPropValue(printerNamePromise, "data.address")
      ? printerNamePromise.data
      : null;
    let paperSize = paperSizePromise.data ?? "32";

    this.setState({ printerName, paperSize, currentPrinter: printerName });
  };

  bluetoothDeviceList = () => {
    let list = [];
    this.state.pairedDs.forEach((element) => {
      console.log(element);
      if (element.name) {
        list.push({
          label: `${element.name} (${element.address})`,
          value: element,
        });
      }
    });

    return list;
  };

  populateDevices = async () => {
    try {
      Platform.select({
        ios: this.getPairedDeviceIOS(),
        android: this.getPairedDevicesAndroid(),
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };

  getPairedDeviceIOS = () => {
    this._scan();
    if (this.state.scanCount == 0) {
      this._scan();
    }
    this.setState((state) => ({ scanCount: state.scanCount }));
  };

  getPairedDevicesAndroid = async () => {
    await BluetoothManager.enableBluetooth().then(
      (r) => {
        var paired = [];

        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i]));
            } catch (e) {
              console.log(e);
              //ignore
            }
          }
        }
        this.setState({
          pairedDs: paired,
          loading: false,
        });
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  bluetoothStatus = async () => {
    let promise = BluetoothStateManager.getState().then((bluetoothState) => {
      this.setState({ bluetoothState: bluetoothState });

      if (bluetoothState == "PoweredOn") {
        this.setState({ bluetoothOpened: true });
      } else {
        this.setState({ bluetoothOpened: false });
      }
    });

    let result = await promise;
  };

  getDevices = async () => {
    try {
      this.setState({ loading: true });
      await this.bluetoothStatus();
      let { bluetoothOpened, bluetoothState } = this.state;
      if (bluetoothOpened) {
        this.populateDevices();
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
        Alert.alert("Bluetooth", "Bluetooth " + bluetoothState);
      }
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };

  initBluetooth = async () => {
    try {
      if (Platform.OS === "ios") {
        let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
        this._listeners.push(
          bluetoothManagerEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
            (rsp) => {
              this._deviceAlreadyPaired(rsp);
            }
          )
        );
        this._listeners.push(
          bluetoothManagerEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_FOUND,
            (rsp) => {
              this._deviceFoundEvent(rsp);
            }
          )
        );
      } else if (Platform.OS === "android") {
        this._listeners.push(
          DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
            () => {
              ToastAndroid.show(
                "Device Does Not Support Bluetooth !",
                ToastAndroid.LONG
              );
            }
          )
        );
      }
      await Promise.all([this.getPairedBluetooth(), this.getDevices()]);
    } catch (error) {}
  };

  _deviceAlreadyPaired = (rsp) => {
    if (Platform.OS == "ios") {
      var ds = null;
      if (typeof rsp.devices == "object") {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = this.state.pairedDs;
        pared = pared.concat(ds || []);
        this.setState({
          pairedDs: pared,
        });
      }
    }
  };

  _deviceFoundEvent = (rsp) => {
    if (Platform.OS == "ios") {
      //alert(JSON.stringify(rsp))
      var r = null;
      try {
        if (typeof rsp.device == "object") {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        //alert(e.message);
        //ignore
      }
      //alert('f')
      if (r) {
        let found = this.state.pairedDs || [];

        let duplicated = found.findIndex(function(x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            pairedDs: found,
          });
        }
      }
    }
  };

  _scan = async () => {
    if (Platform.OS == "ios") {
      this.setState({
        loading: true,
      });
      await BluetoothManager.scanDevices().then(
        (s) => {
          var ss = s;
          var found = ss.found;
          try {
            found = JSON.parse(found); //@FIX_it: the parse action too weired..
          } catch (e) {
            //ignore
          }
          var fds = this.state.pairedDs;
          if (found && found.length) {
            fds = found;
          }
          this.setState({
            pairedDs: fds,
            loading: false,
          });
        },
        (er) => {
          this.setState({
            loading: false,
          });

          console.log(JSON.stringify(er));
        }
      );
    }
  };

  saveClicked = async () => {
    if (parseInt(this.state.paperSize) < 32) {
      Alert.alert("Settings", "Paper size cannot be less than 32");
      return;
    }

    if (!Helper.getPropValue(this.state.printerName, "address")) {
      Alert.alert("Settings", "Please select a printer device");
      return;
    }
    await Promise.all([
      Storage.storeObjectData("printerName", this.state.printerName),
      Storage.storeStringData("paperSize", this.state.paperSize),
    ]).then((results) => results);

    this.setState({ currentPrinter: this.state.printerName });
    Alert.alert("Settings", "Settings saved successfully");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Text style={styles.settingsText}>Settings</Text>
        </View>

        <View style={styles.lowerContainer}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 10,
              }}
            >
              <View style={styles.box}>
                <Text style={styles.heading}>Biometric Login </Text>
                <Switch
                  trackColor={{ false: "#f4f3f4", true: "#d7dae3" }}
                  thumbColor={this.state.biometricLogin ? "#17375e" : "#f4f3f4"}
                  onValueChange={this.onchangeTouchIdoLogin}
                  value={this.state.biometricLogin}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.heading}>Auto Login </Text>
                <Switch
                  trackColor={{ false: "#f4f3f4", true: "#d7dae3" }}
                  thumbColor={this.state.autoLogin ? "#17375e" : "#f4f3f4"}
                  onValueChange={this.onchangeAutoLogin}
                  value={this.state.autoLogin}
                />
              </View>
            </View>
            <View style={[styles.bluetoothBox]}>
              <Text style={[styles.heading, { textAlign: "center" }]}>
                Bluetooth Printer
              </Text>
              {Helper.getPropValue(this.state.currentPrinter, "address") && (
                <>
                  <Text
                    style={[
                      {
                        fontSize: 12,
                        marginTop: 5,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#707070",
                      },
                    ]}
                  >
                    Current Printer:{" "}
                    {this.state.currentPrinter.name +
                      " (" +
                      this.state.currentPrinter.address +
                      ")"}
                  </Text>
                </>
              )}
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={() => this.getDevices()}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingTop: 20,
                }}
              >
                <Text>
                  {Platform.select({
                    android: "Paired Devices",
                    ios: "Scan Devices",
                  })}{" "}
                </Text>
                {this.state.loading ? (
                  <ActivityIndicator color="#17375e" />
                ) : (
                  <Icon name="sync-alt" size={15} color="#17375e" solid />
                )}
              </TouchableOpacity>

              <View style={styles.inputWrapper}>
                <SelectBox
                  inputLabel="Select a printer"
                  value={this.state.printerName}
                  onValueChange={(printerName) =>
                    this.setState({ printerName })
                  }
                  placeholder={{ label: "Select a printer", value: null }}
                  items={this.bluetoothDeviceList()}
                  iconColor="#17375e"
                  iconSize={22}
                />
              </View>

              <View style={styles.inputWrapper}>
                <InputBox
                  placeholder="Enter Paper Size"
                  keyboardType="numeric"
                  inputValue={this.state.paperSize}
                  inputLabel="Paper Size"
                  onChangeText={(paperSize) => this.setState({ paperSize })}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <GreenButton
                  text="Save Bluetooth Printer Settings"
                  onPress={() => this.saveClicked()}
                />
              </View>
            </View>

            <View style={styles.buttonWrapper}>
              <WhiteButton
                bordered
                text="Go To Home"
                onPress={() => this.props.navigation.navigate("Home")}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
