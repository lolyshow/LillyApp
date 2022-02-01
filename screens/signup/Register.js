import React, { Component } from 'react'
import { Text, View } from 'react-native'

import InfoScreen from "./Info";

import PasswordScreen from "./Password";

import ConfirmEmailScreen from "./ConfirmEmail";
import ConfirmEmail from './ConfirmEmail';


const  RegistrationScreens =  [InfoScreen, PasswordScreen, ConfirmEmail];

export default class Register extends Component {

    constructor() {
        super();
        this.state = {
          firstname: "",
          lastname: "",
          username: "",
          gender: "",
          phone: "",
          referral_code: "",
          state: "",
          lga: "",
          email: "",
          gender:"",
          password:"",
          confirmPassword: "",
          genders: ["Male", "Female"],
          states: [],
          lgas: [],
          currentScreenIndex :  0 
        };
      }
    
      genderList = () => {
        let gendersLists = [];
    
        this.state.genders.forEach((item, index) => {
          gendersLists.push({ label: item, value: item, key: index });
        });
    
        return gendersLists;
      };


    

    render() {

     let CurrentScreen =  RegistrationScreens[this.state.currentScreenIndex]
     
        return (
            <CurrentScreen/>
        )
    }
}
