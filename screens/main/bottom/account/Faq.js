import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SectionList,
  Linking,
} from "react-native";
import { List } from "react-native-paper";

import Header from "../../../../components/Header";

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
    fontSize: 18,
    fontWeight: "700",
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
export default function Faq({ navigation }) {
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => setExpanded(!expanded);
  const shagoPaymentsLink = () => {
    return (
      <Text
        style={{ color: "blue" }}
        onPress={() => Linking.openURL("https://www.lillypayment.com/")}
      >
        https://www.lillypayment.com/
      </Text>
    );
  };

  const Faqs = [
    {
      title: "About LillyPay Payments",
      data: [
        {
          label: "Lilly Payments as a company",
          text:
            "Lilly Payments is a financial technology company promoting e-commerce and payments solution through technology. Our application facilitates transactions, such as bill payments, airtime purchase, fund transfer, account opening, and more.",
        },

        {
          label: "Where is Lilly Payments head office located?",
          text:
            "Lilly payments head office is at No. 6 Olakunle Selesi Crescent, Ajao Estate, Lagos.",
        },

        {
          label: "What is Lilly Payments Website?",
          text: shagoPaymentsLink,
        },
      ],
    },

    {
      title: "Becoming A LillyPay Agent",
      data: [
        {
          label: "How do I become an agent?",
          text: `I.  Download the Lilly App from the Play Store or APP Store or visit the web on www.lillypayment.com to fill the form once you login.\nII.  Fill the “Become an Agent” form with your accurate information and submit.\nIII. Your agent application will be reviewed and approved once the information provided have been confirmed.`,
        },

        {
          label: "What do I need to become a LillyPay agent?",
          text:
            "To become a LillyPay agent, you need to provide a valid means of identification and BVN. And an initial wallet funding of N10,000.",
        },
      ],
    },

    {
      title: "About Lilly App",
      data: [
        {
          label: "How do I update my Lilly App?",
          text:
            "A notification message will be sent automatically, requesting you to update the app to the latest version. Also, latest App Version from Lilly Payments is available on the Play Store or App store.",
        },
        {
          label: "How do I change my username or update any details?",
          text:
            "Contact Lilly Payments Customer Care Helpline: +23490000000, +23490900000000 or email: support@lillynaija.com",
        },

        {
          label: "Is my password case sensitive?",
          text: "Yes. Do not share your password with anyone.",
        },

        {
          label:
            "Do I require data/internet service to access the Lilly platform?",
          text:
            "Yes, an internet enabled phone with active data service is required.",
        },

        {
          label: "How do I activate my transaction pin?",
          text:
            'Login to your Lilly App, click on “Account” menu, then click on "Security" sub-menu and select “ACTIVATE TRANSACTION PIN”. Select your preferred secret question, provide the answer, input your preferred "TRANSACTION PIN" submit and then continue your transactions.',
        },

        {
          label: "How do I pair my bluetooth printer with my phone?",
          text:
            "Pair the bluetooth printer to your phone’s bluetooth, input 1234 or 0000 as the password and pair. Login to your LillyPay App, click on “Settings”, select the bluetooth printer's name and input 32 as the paper size and then save the settings to enable you print transaction receipts.",
        },

        {
          label: "I cannot log in to my Lilly App",
          text:
            "I.  Ensure to input the correct password and any of the following; username, phone or email address.\nII. Check phone data status and ensure you have an active connection.",
        },

        {
          label: "How do I change my password?",
          text:
            "Click on “Forgot Password” on the login screen and a link will be sent to your email to reset the password.",
        },
      ],
    },

    {
      title: "About Wallet Funding",
      data: [
        {
          label: "How do I fund my Lilly wallet?",
          text: `APP/POS USERS.\nI. Click on the "How To Fund Wallet" menu on the home page.\nII  A list of funding options will appear.\nIII.  Make use of any of the listed options to fund your wallet.\nWEB USERS.\nI.  Visit www.lillypayment.com\nII.  Click on the "Fund Wallet & Transfers" menu and make use of the listed bank account or any of the funding options that appears.\nIII. Click on the payment notification menu only when fund transfer is made to LillyPay Payments bank collection accounts and input details accordingly, then submit. The wallet funding team will be prompted to confirm your payment and fund your wallet.`,
        },

        {
          label: "How do I fill the payment notification?",
          text:
            "Login to the Lilly App, Click on “How To Fund Wallet” menu, select “Payment Notification” and input the details accordingly.",
        },

        {
          label:
            "Where can I see my commission, bonus and POS wallets balance?",
          text:
            'Login to the Lilly App, click on "Account" menu to see your commission, bonus and POS (for only activated POS wallet Users) wallets balance.',
        },

        {
          label:
            "How do I move the fund in my commission or bonus wallet to my primary wallet?",
          text:
            "Login to your Lilly App, Click on “Transfer & Banks”, select “Transfer”, click on “Commission to Wallet” or “Bonus to Wallet” then input amount to move, then submit.",
        },

        {
          label:
            "How do I move the fund in my POS wallet to my primary wallet?",
          text:
            "Login to your Lilly App (for only activated POS wallet Users), Click on “Transfers & Bank”, select “Transfer”, click on “POS Wallet to Wallet” then input Transaction PIN and a Notification will be sent to LillyPay Team to approve the movement of the fund in the POS wallet to your primary wallet. Also, activated POS wallet Users can link their bank account to their POS wallet to automatically transfer fund to their bank account. This is possible only on request.",
        },
      ],
    },

    {
      title: "About Transaction Issues",
      data: [
        {
          label:
            "No Token issued/ Incomplete Units Issued on electricity payments.",
          text:
            "This happens mostly when the customer has an arrear on his/her account with the Electricity Distribution Company.",
        },

        {
          label: "What do I do when my transaction is Pending/Processing?",
          text:
            "Wait for 1-2 minutes and check the transaction history for the final status of the transaction or reach out to us for assistance.",
        },
      ],
    },
  ];

  const renderSeparator = () => {
    return (
      <View
        style={{
          marginVertical: 0,
          marginHorizontal: 15,
          height: 0,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#f7f7f7",
        }}
      />
    );
  };

  const SectionRenderSeparator = () => {
    return (
      <View
        style={{
          paddingTop: 20,
          paddingBottom: 0,
          marginBottom: 0,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={styles.container.backgroundColor} /> */}

      <Header text="FAQs" backAction={() => navigation.goBack()} />

      <SectionList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
        sections={Faqs}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.blueText}>{title}</Text>
        )}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <List.Accordion
            title={item.label}
            titleNumberOfLines={0}
            // titleStyle={{ color: "#000" }}
          >
            <List.Item
              description={item.text}
              descriptionNumberOfLines={0}
              titleStyle={{ marginTop: 0, paddingTop: 0, height: 0 }}
              descriptionStyle={{
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: 24,
                letterSpacing: 0,
                textAlign: "left",
                // color: "#acacac",
                fontSize: 14,
                flexWrap: "wrap",
              }}
              style={{
                borderRadius: 20,
                backgroundColor: "#f7f7f7",
              }}
            />
          </List.Accordion>
        )}
        ItemSeparatorComponent={renderSeparator}
        SectionSeparatorComponent={SectionRenderSeparator}
      />
    </View>
  );
}
