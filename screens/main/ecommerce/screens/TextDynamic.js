// import React from "react";
// import { View, Text, Image, Button,ScrollView,ActivityIndicator, TouchableHighlight,TextInput, StyleSheet,Dimensions } from 'react-native';

// class TextDynamic extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       categories: [
//         {
//           name: "brand",
//           id: 1,
//           value: ""
//         },
//         {
//           name: "color",
//           id: 2,
//           value: "oio"
//         }
//       ]
//     };
//   }

//   handleSearch = (index,text) => {
//     let newArr = [...this.state.categories]; // copying the old datas array
//     let item = newArr[index]; // get the item object from the array, based on its index
//     item = { ...item, value: text }; // add the value text tothe object
//     newArr[index] = item; // set the item to the same index

//     this.setState({
//       categories: newArr
//     });
//  }

//   renderDynamicInput = (categories) => {
//     let domElem = [];

//     for (let i in categories) {
//       domElem.push(
//         <TextInput
//         style = {{}}
//         // style={styles.search}
//         value={categories[i].value}
//         // onChangeText={(searchString) => {this.setState({searchString})}}
//         onChangeText = {(text)=>this.handleSearch.bind(text,i)}
//         underlineColorAndroid="transparent"
//         placeholder="Search for a Product"
//         />
//       );
//     }
//     return domElem;
//   };

//   render() {
//     const { categories } = this.state;
//     console.log("categories", categories);
//     return <View>{this.renderDynamicInput(categories)}</View>;
//   }
// }

// export default TextDynamic;
import { View, Text, Image, Button,ScrollView,ActivityIndicator, TouchableHighlight,TextInput, StyleSheet,Dimensions } from 'react-native';
import React from "react";
export default class TextDynamic extends React.Component {

    constructor(props) {
      super(props);
      // construct an array with the number of textInputs we require, 
      // each value an empty string
      // set this array in state
      // set the focusedIndex to null
      let textArray = Array(6).fill('');
      this.state = {
        textArray: textArray,
        focusedIndex: null,
        response:[
            {
                name:'Vehicle',
            },
            {
                name:'Fashion',
            },
            {
                name:'Animal'
            },
            {
                name:'Babies',
            },
            {
                name:'Books',
            },
            {
                name:'phone'
            }
        ],
        arr : [],
      }
    }
  
    // this function will handle setting of the state when each TextInput changes
    onChangeText = (text, index) => {
      // as there are going to be a lot of setState calls
      // we need access the prevState before we set the next state.
      this.setState(prevState => {
        prevState.textArray[index] = text
        return {
          textArray: prevState.textArray
        }
      }, () => console.log(this.state.textArray))
    }
  
    // handle the border color
    handleBorderColor = (index) => {
      return index === this.state.focusedIndex ? 'red' : 'grey'
    }
     pressMe() {
        console.log(this.state.response[1].name)
    console.log(this.state.textArray[0])
    console.log(this.state.arr);
    console.log("leghth",this.state.response.length);
    //   var object = {this.state.response[1]};
    
        var start = 0;
        for (start =0;start < this.state.response.length; start++){
            let textname = this.state.response[start].name;
            var object = {"textname":this.state.textArray[start]};
            this.state.arr.push(object);
            console.log(this.state.arr);
        }
    }
    
    render() {
      // here we map the items in the `this.state.textArray` 
      // notice that each TextInput is give a specific value in state
      // that will stop the overlap
      

      return (
        <View >
          {this.state.textArray.map((text, index) => {
            return <TextInput
              style={{height: 40, marginVertical: 10, borderColor: this.handleBorderColor(index), borderWidth: 1}}
              onChangeText={text => this.onChangeText(text, index)} 
              value={this.state.textArray[index]}
              placeholder={`placeholder for ${index}`}
              onFocus={() => this.setState({focusedIndex: index})}
              onBlur={() => this.setState({focusedIndex: null})}
            />
          })}

          <View><Button title = "pressMe" onPress={()=>this.pressMe()}>click</Button></View>
        </View>
        
      );
    }
  }


// import React, { useRef } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Modalize } from 'react-native-modalize';

// export  default function TextDynamic ()  {
//   const modalRef = useRef(null);

//   const onOpen = () => {
//     const modal = modalRef.current;

//     if (modal) {
//       modal.open();
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={onOpen}>
//         <Text>Open the modal</Text>
//       </TouchableOpacity>

//       <Modalize modalHeight = {20} ref={modalRef}><Text>...your content</Text></Modalize>
//     </>
//   );
// };