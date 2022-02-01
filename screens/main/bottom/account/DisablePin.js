import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
import Result from "../../../../components/Result";
import TokenMaskedBox from "../../../../components/TokenMaskedBox";
import WhiteButton from "../../../../components/WhiteButton";
import ConfirmationComponent from "../../../../components/ConfirmationComponent";
import SecurityQuestionComponent from "./SecurityQuestionComponent";
import Config from "../../../../Helpers/Config";
import axios from "axios";
import ProcessingComponent from "../../../../components/ProcessingComponent";
import Network from "../../../../Helpers/Network";

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

export default class DisablePin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      question  : "",
      answer : "",
      pin: "",
      pinConfirm: "",
      screen: "question",
      showResult:false,
      showWarning:false,
      secretAnswer : "",
      questionList :[],
      secretPIn :"",
      showProcessing: false
    };
  }

  componentDidMount() {

    let  {transaction_pin, transaction_pin_status, secret_question, secret_answer} = global.user

    let list =   [{label: secret_question, value: secret_question}]

    this.setState({question:secret_question, secretAnswer:secret_answer, secretPIn: transaction_pin, questionList:list})

  }


  continueToPin = () => {
    if (this.state.answer != "") {

       if (this.state.answer == this.state.secretAnswer) {
        this.setState({ screen: "pin" });
       }
       else {
         Alert.alert("Disable PIN",  "You've entered incorrect secret answer")
       }
    } 
    
    else {
      Alert.alert("Disable PIN",  "Please enter your secret answer")
    }
  };

  disablePin = () => {
    if (this.state.pin.length === 4) {

      if (this.state.pin == this.state.secretPIn) {

        this.setState({ showWarning:true });
       }

       else {
         Alert.alert("Disable PIN",  "You've entered incorrect transaction pin")
       }

  

    } else {
      Alert.alert("Disable PIN",  "Please enter 4 digits pin")
    }
  };

  disablePinAPI = async () => {
    
    try {
      
      let body = {
       
        serviceCode: "PID",
        pin:  this.state.pin,    

      };

    
      let url = Config.app_url;

      this.setState({ processing: true });

      let { error, errorMessage, response } = await new Network().post(
        url,
        body
      );

      this.setState({ processing: false });

      if (error) {
        return Alert.alert("Disable PIN", errorMessage);
      }



      if (response.status == "200") {

        global.user.transaction_pin_status ="2";
        
        this.setState({   
          pin: "",
          screen: "question",
          processing: false,
          showResult:true,
          
        });


        this.props.navigation.navigate('Account');
      }
     
      else {
         
        this.setState({   
          pin: "",
          screen: "question",
          processing: false,
        });

        Alert.alert("DIsble PIN",  response.message.toString());

      }
    } 
    catch (error) {

      this.setState({   
        pin: "",
        screen: "question",
        processing: false,
      });

      Alert.alert("DIsble PIN", error.toString());
    }

   
  }

  WaningDisablePin= (response) => {

    if( response === true) { 

      this.setState({showWarning:false})

      this.disablePinAPI();
    }
    else
    {
      this.setState({showWarning:false})
    }
  }
  
  SecurityQuestion = () => (
   
      <SecurityQuestionComponent
          questionValue={ this.state.question}
          questionChange={ (question) =>  this.setState({question})}
          answerValue={ this.state.answer}
          answerChange={(answer) => this.setState({answer}) }
          itemList ={this.state.questionList}
          onPressContinue = {() => this.continueToPin()}
      />
    
  );

  PinView = () => (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.blueText}> Transaction PIN</Text>
        <Text style={styles.greyText}>Please transaction pin</Text>
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
          text="Disable Pin"
          disabled={this.state.processing}
          processing={this.state.processing}
          onPress={() => this.disablePin()}
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

        {this.state.screen === "question" ? this.SecurityQuestion(): this.PinView()}


          <ConfirmationComponent
            message= "Are you sure you want to disable your Transaction PIN?"
            response = {this.WaningDisablePin}
            closModal={() => this.setState({ showWarning: false })}
            visible={this.state.showWarning}
            iconColor="#ffb64f"
            iconName= "warning"

          />
          <Result
            closModal={() => this.setState({ showResult: false })}
            status={200}
            header="Transaction PIN Disabled Successful"
            userMessage={"You have successfully Reset your Transaction PIN"}
            visible={this.state.showResult}
            />


         <ProcessingComponent
            visible={this.state.showProcessing}
            message="Processing"
            closModal={() => this.setState({ showProcessing: false })}
          />
      </View>
    );
  }
}
