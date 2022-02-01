import axios from "axios";
import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
import Result from "../../../../components/Result";
import TokenMaskedBox from "../../../../components/TokenMaskedBox";
import WhiteButton from "../../../../components/WhiteButton";
import Config from "../../../../Helpers/Config";
import Network from "../../../../Helpers/Network";
import SecurityQuestionComponent from "./SecurityQuestionComponent";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",

    backgroundColor: "#ffffff",

    padding: 40,
  },

  titleWrapper: {
    flexDirection: "row",

    // justifyContent: "space-between",

    marginBottom: 50,
  },

  title: {
    fontSize: 24,

    fontWeight: "500",

    fontStyle: "normal",

    // lineHeight: 32,

    letterSpacing: 0,

    textAlign: "left",

    color: "#17375e",

    marginLeft: 40,
  },

  inputWrapper: {
    flexDirection: "column",

    marginBottom: 15,
  },

  submitButtonWrapper: {
    marginTop: 20,
  },

  formRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  blueText: {
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  greyText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    textAlign: "left",
    color: "#707070",
  },
});

export default class ActivatePin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      question  : "",
      answer : "",
      pin: "",
      pinConfirm: "",
      screen: "question",
      showResult:false,
      
    };
  }

  componentDidMount() {

    let  {transaction_pin, transaction_pin_status, secret_question, secret_answer} = global.user

  }


  continueToPin = () => {

    let {question, answer} = this.state;

    if (question && answer) {

      this.setState({ screen: "pin" });
    } else {
      Alert.alert("Security Question", "Please select a question and enter an appropriate answer");
    }
  };


  continueToConfirmPin = () => {
    if (this.state.pin.length === 4) {
      this.setState({ screen: "confirm" });
    } else {
      Alert.alert("Set PIN", "Please enter a 4 digit PIN");
    }
  };

  confirmPin = () => {
    if (this.state.pinConfirm == this.state.pin) {
      
        this.ActivatePin();

    } else {
      Alert.alert("Confirm PIN", "Your confirmation PIN does not match with initial PIN");
    }
  };

  ActivatePin = async () => {
    
    try {
      let body = {
       
        serviceCode: "PIR",
        pin:  this.state.pin,
        secret_question: this.state.question,
        secret_answer :  this.state.answer,
      

      };

      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Activate PIN", errorMessage);
      }


      if (response.status == "200") {

        global.user.transaction_pin_status ="1";
        global.user.secret_question = this.state.question;
        global.user.secret_answer = this.state.answer;

        this.setState({
          pin: "",
          pinConfirm: "",
          screen: "question",
          showResult:true,
          processing:false
          
        });


        this.props.navigation.navigate('Account');
      }
     
      else {
         
        this.setState({
          pin: "",
          pinConfirm: "",
          screen: "question",
          // showResult:true,
          processing:false
          
        });

        Alert.alert("Activate PIN",  response.message.toString());

      }
    } catch (error) {

      this.setState({
        pin: "",
        pinConfirm: "",
        screen: "question",
        // showResult:true,
        processing:false
        
      });
      Alert.alert("Activate PIN", error.toString());
    }

   
  }
  
  SecurityQuestion = () => (
   
      <SecurityQuestionComponent
          questionValue={ this.state.question}
          questionChange={ (question) =>  this.setState({question})}
          answerValue={ this.state.answer}
          answerChange={(answer) => this.setState({answer}) }
          onPressContinue = {() => this.continueToPin()}
      />
    
  );

  PinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}> Create Transaction PIN</Text>
        <Text style={styles.greyText}>Please input pin transaction pin</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TokenMaskedBox
          length={4}
          value={this.state.pin}
          setValue={(pin) => this.setState({ pin })}
          autoFocus={true}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <GreenButton
          text="Set Pin"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.continueToConfirmPin()}
        />
      </View>
    </>
  );

  confirmPinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}>Confirm Transaction PIN</Text>
        <Text style={styles.greyText}>Please confirm pin transaction pin</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TokenMaskedBox
          length={4}
          value={this.state.pinConfirm}
          setValue={(pinConfirm) => this.setState({ pinConfirm })}
          autoFocus={true}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <GreenButton
          text="Confirm PIN"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.confirmPin()}
        />
      </View>
    </>
  );
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BorderedBackButton onPress={() => this.props.navigation.goBack()} />
        </View>

        {this.state.screen === "question"
          ? this.SecurityQuestion()
          : this.state.screen === "pin"
          ? this.PinView()
          : this.confirmPinView()
          }

          <Result
            closModal={() => this.setState({ showResult: false })}
            status={200}
            header="Transaction PIN Change Successful"
            userMessage={"You have successfully set your transaction PIN"}
            visible={this.state.showResult}
            />
      </View>
    );
  }
}
