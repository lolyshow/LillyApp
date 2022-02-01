import React, { Component } from "react";
import { View,Text, Button } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
 
export default class Example extends Component {
  render() {
    
    YourOwnComponent=() => {

        return(
            <View style={{backgroundColor:'red'}}>

                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
                <Text> {"his is my text"}</Text>
              
            </View>
        )
    }
 
    return (
      <View style={{ flex: 1}}>
        <Button title="OPEN BOTTOM SHEET" onPress={() => this.RBSheet.open()} />
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={300}
          openDuration={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
             draggableIcon:true,
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius:20,
              borderTopLeftRadius:20,
            }
          }}
        >
          <YourOwnComponent />
        </RBSheet>
      </View>
    );
  }
}