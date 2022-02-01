import React, { Component } from "react";

import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  Modal,
  Alert,
  ImageBackground,
} from "react-native";

import GreenButton from "../components/GreenButton";

import Icon from "react-native-vector-icons/Ionicons";
import Logo from "../assets/shago_logo_white.png";

import logoWatermark from "../assets/logoWatermark.png";
import Helper from "../Helpers/Helper";

import { store } from "../redux/store";

const screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17375e",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
  },

  wrapper: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  back: {
    fontSize: 25,
    color: "#ffffff",
  },

  backWrapper: {
    marginLeft: -5,
    marginTop: 15,
  },

  buttonWrapper: {
    marginTop: 30,
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },

  logoWrapper: {},
  brandLogo: {
    width: 53,
    height: 65,
  },

  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff",
  },
  instruction: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  centeredView: {
    marginTop: Platform.select({
      android: 20,
      ios: 100,
    }),
    paddingBottom: "20%",
  },
  modalView: {
    paddingBottom: 100,
    marginTop: 40,
    backgroundColor: "white",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginTop: 20,
  },

  modalTextSub: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginTop: 10,
  },
  termsConditions: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    marginBottom: 10,
  },
});

export default class Terms extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      email: "",
      password: "",
      name: "",
      processing: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  acceptTerms = async () => {
    this.setState({ processing: false });

    return this.logIn();
  };

  updateUSerTerm = async () => {};

  componentDidMount() {
    let { email, password, firstname, lastnem } = this.props.route.params;

    this.setState({ email, password, name: firstname });
  }

  logIn = async () => {
    try {
      let { email, password } = this.state;

      this.setState({ processing: true });

      let { message, error, user } = await Helper.logInApi(
        email,
        password,
        true
      ).then((result) => result);

      this.setState({ modalVisible: false, processing: false });

      if (!error) {
        store.dispatch({
          type: "IS_SIGNED_IN",
          payload: true,
        });
        // this.props.navigation.navigate("Main");
      } else {
        Alert.alert("Terms & Condition", message);
      }
    } catch (error) {
      this.setState({ modalVisible: false, processing: false });

      Alert.alert("Message", error.toString());
    }
  };

  render() {
    return (
      <ImageBackground
        source={logoWatermark}
        style={styles.container}
        imageStyle={{
          resizeMode: "contain",
          height: "55%",
          top: undefined,
          // marginRight:'-25%'
        }}
      >
        <View>
          <View style={styles.backWrapper}>
            <Icon
              onPress={() => this.props.navigation.navigate("Login")}
              size={30}
              name="close-outline"
              color="#ffffff"
            ></Icon>
          </View>

          <View style={styles.wrapper}>
            <View style={styles.logoWrapper}>
              <Image
                source={Logo}
                resizeMode="contain"
                style={styles.brandLogo}
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.greeting}>Hey, {this.state.name}</Text>
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.instruction}>
                Before you continue, please review & accept the terms and
                conditions of use
              </Text>
            </View>

            <View style={styles.buttonWrapper}>
              <GreenButton
                text="Review our Terms & conditions"
                disabled={this.state.processing}
                processing={this.state.processing}
                onPress={() => {
                  this.setModalVisible(true);
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <ScrollView
              contentContainerStyle={styles.centeredView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalView}>
                <View style={{ alignSelf: "flex-end" }}>
                  <Icon
                    onPress={() => {
                      this.setModalVisible(false);
                    }}
                    size={30}
                    name="close-circle-outline"
                    color="#17375e"
                  ></Icon>
                </View>

                <Text style={styles.termsConditions}>Terms & Conditions</Text>

                <View>
                  <Text style={styles.modalText}>{"\t"}</Text>

                  <Text style={styles.modalText}>
                    1. {"\t"} Description of the Service: You may use the Lilly
                    App to complete the digitally enabled products such as bill
                    payments, e-commerce, product listing e.t.c. More products
                    may be added to the Lilly App from time to time.
                  </Text>

                  <Text style={styles.modalText}>
                    2. {"\t"} Enrolment: Upon completing the download of the
                    Lilly App, you will be required to provide some of your
                    personal data for your security. You will also be required
                    to complete and submit a guarantor’s form and any other
                    documentation required for our record. By using the Lilly
                    App you represent that the information provided is true.
                  </Text>

                  <Text style={styles.modalText}>
                    3. {"\t"} Security Procedures: You are solely responsible
                    for maintaining the security of your LillyPay App and for any
                    unauthorized use of your Device to access the service. You
                    agree to lock your LillyPay App with a password and transaction
                    pin whenever it is not in use so that your personal
                    information is not accessible to others. Also, you agree to
                    notify us immediately in the event you become aware of any
                    loss, theft, or unauthorized use of the LillyApp App or your
                    Mobile Device.
                  </Text>

                  <Text style={styles.modalText}>
                    4. {"\t"} Availability and Reversals: Once you have
                    initiated a successful transaction via the LillyApp App, you
                    will not be able to reverse the transaction. It is your
                    responsibility to correctly enter all transaction
                    information into the LillyApp App, including transaction
                    amounts. There may be events during which our services will
                    be unavailable. This may be due to factors such as scheduled
                    maintenance or interruption from the service provider.
                  </Text>

                  <Text style={styles.modalText}>
                    5.{"\t"} Principal Agent and its Sub-Accounts Feature: This
                    feature which is referred to as the “Principal-Agent and
                    Sub-Account” feature enables the Principal-Agent who owns
                    multiple outlets to create sub-accounts for the purpose of
                    monitoring transactions across their outlets (“Sub-Account
                    Users”). By using this feature, you agree that:
                  </Text>

                  <Text style={styles.modalTextSub}>
                    i. {"\t"} Each user of a sub-account represents you, and as
                    such you have records and personal data of each sub-account
                    user within your possession;
                  </Text>

                  <Text style={styles.modalTextSub}>
                    ii. {"\t"} You accept and shall take responsibility for all
                    acts and omissions including damages and liabilities
                    incurred by Users of any sub-account which you create.
                  </Text>

                  <Text style={styles.modalText}>
                    6.{"\t"} LillyApp POS Device: Upon your acquisition of the
                    LillyApp POS for use, from LillyPay Payments Limited (“the
                    company”), you will be expected to meet the company’s
                    required minimum daily transaction sales of ₦50,000. NB: In
                    the event of failure to consistently reach the required
                    turnover within two (2) months of acquiring the POS, the
                    company has the right to terminate this Agreement and
                    immediately retrieve the POS.
                  </Text>

                  <Text style={styles.modalText}>
                    7.{"\t"} Data Privacy and User Information: You acknowledge
                    that in connection with the use of the LillyPay App, LillyPay and
                    it’s service providers may receive names, domain names,
                    addresses, passwords, telephone and device numbers, message
                    contents, data files and other data and information provided
                    by you or from other sources in connection with the LillyPay
                    App (User Information). LillyPay and it’s service providers
                    will maintain and reasonably safeguard the information from
                    unauthorized disclosure or use.
                  </Text>

                  <Text style={styles.modalText}>
                    8. {"\t"} Restrictions on Use: You are not to use the LillyPay
                    App in or for any illegal, fraudulent, unauthorized or
                    improper manner or purpose and agree that the LillyPay App will
                    only be used in a manner that complies with all applicable
                    laws, rules and regulations including all applicable state,
                    federal and international internet, data,
                    telecommunications, telemarketing, “spam”, and import/
                    export laws and regulations. Without limitation, you agree
                    that you will not
                  </Text>

                  <Text style={styles.modalTextSub}>
                    i.{"\t"} Violate the privacy rights of third parties, any
                    third party’s intellectual property rights, rights of
                    publicity, privacy or confidentiality, or the rights or
                    legal obligations of any service provider or any of its
                    clients or subscribers;
                  </Text>

                  <Text style={styles.modalTextSub}>
                    ii. {"\t"} Disseminate material or data that is illegal, or
                    of such nature that is harassing, harmful, coercive,
                    defamatory, libellous, abusive, threatening, obscene, or
                    otherwise objectionable;
                  </Text>

                  <Text style={styles.modalTextSub}>
                    iii. {"\t"} Disseminate any material or information that is
                    false, misleading, or inaccurate;
                  </Text>

                  <Text style={styles.modalTextSub}>
                    iv. {"\t"} Disseminate any material that would expose LillyPay,
                    the Bank or any third-party service provider involved in
                    providing the Services, or any other third party to
                    liability. Further to the above, you agree that you will not
                    attempt to:
                  </Text>

                  <Text style={styles.modalTextSub}>
                    Further to the above, you agree that you will not attempt
                    to:
                  </Text>

                  <Text style={styles.modalTextSub}>
                    a. {"\t"}Access any software or services for which your use
                    has not been authorized; or
                  </Text>

                  <Text style={styles.modalTextSub}>
                    b. {"\t"} Use or attempt to use a third party’s account or
                  </Text>

                  <Text style={styles.modalTextSub}>
                    c. {"\t"} Interfere in any manner with the provision of the
                    Services or the Software, the security of the LillyPay App or
                    other customers that use the service or
                  </Text>

                  <Text style={styles.modalTextSub}>
                    d. {"\t"} Disclose third party data to any person or utilize
                    the data for any purpose except for the performance of the
                    service and use reasonable means to ensure that unauthorized
                    persons do not have access to such personal data;or
                  </Text>

                  <Text style={styles.modalTextSub}>
                    e. {"\t"} Otherwise abuse the service or the LillyPay App.
                  </Text>

                  <Text style={styles.modalText}>
                    9. {"\t"} Money Laundering and Terrorism Prohibition: You
                    hereby agree to comply with the anti-money laundering and
                    anti-terrorism regulations; and anti-corruption laws
                    including but not limited to the Central Bank of Nigeria
                    (Anti-Money Laundering and Combating the Financing of
                    Terrorism in Banks and other Financial Institutions in
                    Nigeria) Regulations 2013, Economic and Financial Crimes
                    Commission (Establishment, etc) Act 2004; Corrupt Practices
                    and Other Related Offences Cap C31 Laws of the Federation of
                    Nigeria 204; Money Laundering (Prohibition) Act, 2011 and
                    Terrorism (Prevention) Act 2011.
                  </Text>

                  <Text style={styles.modalText}>
                    10. {"\t"} Indemnification: You hereby agree to indemnify,
                    defend and hold LillyPay, its employees, agents and affiliates
                    harmless from and against any claim, expense, liability,
                    cost, loss or damage (including the cost of dispute
                    resolution) caused directly or indirectly by your failure to
                    comply with the terms of the agreement, your breach of
                    representation or warranty, your failure to maintain the
                    security of your mobile device and your negligence or
                    international acts or omission in utilizing the service and
                    your violation of any applicable law, statute, or regulation
                    relating to your use of the service.
                  </Text>

                  <Text style={styles.modalText}>
                    11. {"\t"} Limitation of liability: You agree that to the
                    extent not prohibited by applicable law, LillyPay shall not be
                    liable for any direct or indirect incident, consequential or
                    exemplary damages for loss of profits, data or other losses
                    resulting from the use or the inability to use the service
                    incurred by you or any third party arising from or related
                    to the use or inability to use, or the termination of the
                    use of the LillyPay App, regardless of the form of action or
                    claim (whether contract, tort, strict liability or
                    otherwise), even if we have been informed of the possibility
                    thereof. In addition to the above, we shall not be liable
                    for the inability to use the service or losses caused by
                    events such as fires, flood, earthquakes, epidemics,
                    unavailability of necessary utilities, strikes, blackouts,
                    natural disasters and acts of regulatory agencies.
                  </Text>

                  <Text style={styles.modalText}>
                    12. {"\t"} Disclaimer of Warranties: You agree that your use
                    of the services and all information and content (including
                    that of third parties) is at your own risk and is provided
                    “as-it-is” and as available basis. We disclaim all
                    warranties of any kind as to the use of LillyPay App, whether
                    express or implied, including, but not limited to the
                    implied warranties of merchantability, fitness for a
                    particular purpose and non-infringement. We make no warranty
                    that the LillyPay App: (i) will meet your requirements, (ii)
                    will be uninterrupted, timely, secure, or error-free, (iii)
                    the result that may be obtained from the service will be
                    accurate or reliable, and (iv) any error in the service or
                    technology will be corrected.
                  </Text>

                  <Text style={styles.modalText}>
                    13. {"\t"} Intellectual Property: This Agreement does not
                    transfer to you any ownership or proprietary right in the
                    LillyPay App or any associated content, technology, Software or
                    any part thereof. LillyPay retains all intellectual property
                    rights, title and interest in and to the LillyPay App and any
                    associated content, technology, and software. Neither you
                    nor any user you authorize will use the LillyPay App in any
                    manner or for any property rights in the LillyPay App or
                    contradict our business interest.
                  </Text>

                  <Text style={styles.modalText}>
                    14. {"\t"} Acceptance of Agreement and Amendment: Your use
                    of the LillyPay App constitutes your acceptance of this
                    agreement and other amendments that may be made from time to
                    time. We will notify you of any material change to the
                    agreement by providing a link to the revised agreement. Such
                    amendments shall become effective upon your receipt of the
                    notice. If a change is made for security purposes, we may
                    implement the changes without prior notice to you. If you do
                    not agree with the change, you may discontinue using the
                    service. However, your continued use of the services will
                    indicate your acceptance of the agreement to any changes
                    with the service.
                  </Text>

                  <Text style={styles.modalText}>
                    15. {"\t"} Legal Rights for events of fraud, security breach
                    or related conduct: In the event of your participation or
                    suspicion thereof in activities such as fraud, security
                    breach, misuse of the LillyPay App and other prohibited
                    activities specified in clauses 6 and 7 above, we shall be
                    entitled to take all preventive or corrective action
                    permitted under the law not limited to the restriction of
                    your access to the service, blacklisting or otherwise
                    freezing the BVN provided, making formal reports to Economic
                    and Financial Crime Commission (EFFC), The Nigerian Police
                    Force (NPF) and other relevant security and regulatory
                    authorities, or otherwise commence legal action in a
                    competent court. Further to the above you hereby grant us
                    authority to investigate, report, or take other actions as
                    may be necessary to prevent or resolve the event described
                    above and to recover the affected funds or other properties.
                  </Text>

                  <Text style={styles.modalText}>
                    16. {"\t"} Insurance: We do not provide insurance coverage
                    for the safety of your personal effects, losses caused by
                    fraud or security breach hence, you shall be solely
                    responsible for obtaining all insurance policies as you deem
                    fit.
                  </Text>

                  <Text style={styles.modalText}>
                    17. {"\t"} Premium Services: If you meet certain conditions,
                    you will be entitled to the premium service on the App. You
                    hereby undertake that there shall be a prompt settlement of
                    the service as agreed by you. You will also comply with all
                    relevant regulations including terms stipulated in this
                    agreement or in other agreements which you execute with us
                    and act in good faith at all times. The rule regulating this
                    service may be reviewed or updated from time to time and
                    shall include rules laid down by us, applicable financial
                    institutions and regulatory authorities. It is your
                    responsibility as a recipient of these services to stay
                    informed on all reviews or update that may apply to you. In
                    the event of a default in the use of this service received,
                    we shall be entitled to take all legal actions as we deem
                    fit including reporting you to/engaging the services of
                    appropriate agencies.
                  </Text>

                  <Text style={styles.modalText}>
                    18. {"\t"}Privacy of Contract: The terms of this agreement
                    apply to you as a user only and any person who is not a
                    party to this agreement shall have no right by law or
                    otherwise to enforce any of its terms.
                  </Text>

                  <Text style={styles.modalText}>
                    19. {"\t"} Governing Law and Dispute Resolution: Subject to
                    clause 14 above, this agreement, and your rights and our
                    obligations under this agreement, are governed by and
                    interpreted according to the laws of the Federal Republic of
                    Nigeria. Any dispute that arises from the use of the service
                    shall be resolved by direct consultation between the
                    parties. If the parties remain dissatisfied, the dispute
                    shall be referred to arbitration, to be presided over by a
                    sole arbitrator and the proceedings shall be coordinated
                    under the Arbitration and Conciliation Act, Cap A18, Law of
                    the Federation of Nigeria, 2004 and the Rules thereunder.
                  </Text>
                  <Text style={styles.modalText}>
                    20. {"\t"} Miscellaneous: We may waive enforcement of any
                    provision of this agreement. Any such waiver shall not
                    affect our rights concerning any other transaction to modify
                    the terms of this agreement. No waiver of any breach of this
                    agreement shall constitute a waiver of any prior or
                    subsequent breach of this agreement held to be unenforceable
                    or invalid by any court or regulatory authority of competent
                    jurisdiction. The validity and enforceability of the
                    remaining provisions shall not be affected, and in place of
                    such invalid or unenforceable provision, there shall be
                    added automatically as part of this Agreement or make
                    provision as similar in terms as may be valid and
                    enforceable, if possible.
                  </Text>
                  <Text style={styles.modalText}>
                    21. {"\t"} Termination: You can opt-out of the service by
                    deleting and uninstalling the LillyPay App from your mobile
                    device. Where you have received any of our properties
                    including signages or banners, such items shall be returned
                    to us within fourteen (14) days of termination. If you have
                    any questions about these Terms and Conditions, please
                    contact us on 09090000448, 09090000844.
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 20,
                    height: 50,
                    position: "relative",
                  }}
                >
                  <GreenButton
                    text="Accept"
                    disabled={this.state.processing}
                    processing={this.state.processing}
                    onPress={() => {
                      this.acceptTerms();
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}
