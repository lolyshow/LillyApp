import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { Button } from 'react-native-paper';
import { SliderBox } from "react-native-image-slider-box";
 
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        // "https://source.unsplash.com/1024x768/?nature",
        // "https://source.unsplash.com/1024x768/?water",
        // "https://source.unsplash.com/1024x768/?girl",
        //"https://source.unsplash.com/1024x768/?tree",
        require('../assets/images/laptop2.jpeg'),
        require('../assets/images/laptop.png'),
        require('../assets/images/laptop3.jpg'),
      ]
    };
  }
 
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
            <SliderBox
            images={this.state.images}
            sliderBoxHeight={400}
            // onCurrentImagePressed={index =>
            //     console.warn(`image ${index} pressed`)
            // }
            />
            {/* <Text style = {{flexDirection:'row', flex:2}}>halley</Text> */}

            <View style={{flexDirection:"row", margin:20, justifyContent:'flex-end'}}>
                <Text style={{flex:1,fontWeight: "bold"}}>Apple MacBook Pro Core i9 8th Gen(16 GB/514 SSID)</Text>
                <Text style = {{color:'#01cf13', fontWeight: "bold", fontSize:15,}}>#45,2399</Text>
            </View>

            <View style={{flexDirection:"row", margin:20, justifyContent:'space-around'}}>
                <Text style={{flex:1}}>Condition: Brand new</Text>
                <Text style={{flex:1}}>State: Lagos</Text>
            </View>

            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                <Button style = {{backgroundColor:'#01cf13',flex:1, color:'white'}} labelStyle={{color:"#fff"}} onPress={() => console.log('Pressed')}>
                    Message
                </Button>
                
                <Button style = {{backgroundColor:'#01cf13', borderStyle:'solid',borderColor:"red", flex:1, marginLeft:10}} labelStyle={{color:"#fff"}} onPress={() => console.log('Pressed')}>
                    Call Owner
                </Button>
            </View>


            <Text style = {{margin:20,fontWeight: "bold"}}>Details</Text>
            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                <Text style = {{flex:1}} > Processor</Text>
                
                <Text > 8GHz Quad-Core AMD E2-770 APU </Text>
            </View>

            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                <Text style = {{flex:1}} > Battery</Text>
                
                <Text > 8GHz Quad-Core AMD E2-770 APU </Text>
            </View>


            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                <Text style = {{flex:1}} > Memory</Text>
                
                <Text > 4GB Ram</Text>
            </View>



            <Text style = {{margin:20, fontWeight: "bold"}}>Seller's note</Text>
            <View style={{flexDirection:"row", margin:20, justifyContent:'space-between'}}>
                {/* <Text style = {{flex:1}} > Processor</Text> */}
                
                <Text > Congratulations! You've completed this tutorial and successfully added an authentication flow between the two stack navigators. In the next part of this series, we'll explore more features such as creating and storing chat rooms in a collection in Firestore, as well as displaying all chat rooms on the home screen. To create a new chat room, we'll create a new modal screen and make changes to the current home stack accordingly. </Text>
            </View>
        </ScrollView>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});