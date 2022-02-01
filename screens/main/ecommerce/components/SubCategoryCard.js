import React, { Component } from 'react';
import { View, Text, Image, Button,ScrollView, TouchableHighlight,TextInput, StyleSheet,Dimensions } from 'react-native';
import Input from 'react-native-input-style';
import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from 'react-native-vector-icons/Octicons';
import FontAwes from 'react-native-vector-icons/FontAwesome5';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchIcon from '@material-ui/icons/Search';
import AntDez from 'react-native-vector-icons/AntDesign';
class SubCategoryCard extends Component {

        constructor(props){
            super(props);
        }
    // return this.state.array.map((element) => {
        render(){
            // const image = this.props.image && this.props.image.length> 0 ? this.props.image[0].url: "../assets/images/laptop2.jpeg";
            
        return(

          <View style = {{flex:1, flexDirection:"row", margin:20, justifyContent:"space-between"}}>
             
          <TouchableHighlight onPress={()=>this.props.handleSubCatClick(this.props.name)} underlayColor="white">

            <View>
              <Text>{this.props.name} </Text>
            
            </View>

          </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.props.handleSubCatClick(this.props.name)} underlayColor="white">
                <View> 
                {/* <Text>{">"} </Text> */}
                    <AntDez name="right" size={15} />
                </View>
            </TouchableHighlight>
          </View>

        )
        }
};
export default SubCategoryCard;