import React, { Component } from 'react'
import { View, Text, TouchableOpacity,Image,ActivityIndicator,Alert, TouchableHighlight,TextInput, StyleSheet } from 'react-native'
import BorderedBackButton from "../../../../../components/BorderedBackButton";
import { ScrollView } from 'react-native-gesture-handler';
import AntDez from 'react-native-vector-icons/AntDesign';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { FlatGrid } from 'react-native-super-grid';
import Result from "../../../../../components/Result";
// import LoadingOverlay from 'react-loading-overlay';
import ProgressLoader from 'rn-progress-loader';


class Overview extends Component {
  
  state = {
      email: '',
      password: '',
      photo: null,
      photoArr:[],
      dynamicFormList: [
        "state",
        "lg",
        "number",
        "address",
      ],
      dynamicForm: {},
      submitData:{},
      showResult: false,
      userMessage :"",                                                                                                                                                                                                               
      transactionStatus :"",
      submitLoader:false,
      excludeFields : ['userId', 'categoryId', 'subcategoryId']

   }
  
 componentDidMount(){

  // console.log(this.props.route.params)
 }

   handleEmail = (text) => {
      this.setState({ email: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (email, pass) => {
      alert('email: ' + email + ' password: ' + pass)
   }

   handleChoosePhoto = () =>{
    const options = {
      noData:true,
    };
    ImagePicker.launchImageLibrary(options, response=>{
        console.log("response",response);
        if(response.uri){

          this.setState({photo:response});
        }
    });
};
  setDynamicForm(fieldPath, value) {
    console.log("filePathLocation",fieldPath)
    console.log("ValueLocation",value)
    console.log("printDataLocation",this.state.dynamicForm)
  this.setState({
    dynamicForm: {
      ...this.state.dynamicForm,
      [fieldPath]: value,
    },
  });
  }

  submitData() {


    let previousObj = this.props.route.params.productProperty;
    console.log("insideSubmitDAta",previousObj);
    // const object3 = {...this.state.dynamicForm, ...previousObj }
    console.log("thisisObject3223",this.state.dynamicForm);
    const allinputField = this.props.route.params.allInputData;


    console.log("thisisphotoConverted",this.props.route.params.photoBase64)
    //submitLoader
    this.setState({submitLoader: true});
    let finalObject = {}
     finalObject = {...allinputField, action:"UploadProducts", images: this.props.route.params.photoBase64}
     console.log("FinalsubmitdataFinal",finalObject)
      fetch("https://www.lillypayment.com/api/e-commerce",{
          method:'POST',
          headers:{
              'Content-Type':'application/json',
              'Access-Control-Allow-Origin': 'application/json',
              "Origin": "*"
          },
          body:JSON.stringify(
            finalObject
          )
      }).then((response) => response.json()).then((response) => {
        this.setState({submitLoader: false});
      console.log('uploadResponse',JSON.stringify(response))
        if (response.status) {
          if(response.status == '200'){
            Alert.alert(
              "Product Upload",
              " "+response.message.toString(),
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => this.props.navigation.navigate("ESellProduct") }
              ]
            );
          }else{
            Alert.alert(
              "Product Upload",
              " "+response.message.toString(),
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => console.log("could not be uploaded") }
              ]
            );
          }
        }
          
      }).catch(error => {console.log('errormessage',error); this.setState({submitLoader: false}); console.log('error', error)});

    }

    Capitalize(str){
      let upperstr = str.charAt(0).toUpperCase() + str.slice(1);
        return <Text>{upperstr}</Text>
      }

    renderPhotoItem =()=>{
    let photoArr = [];
    const photo = this.props.route.params.photo;
    const photo2 = this.props.route.params.photo2;
    const photo3 = this.props.route.params.photo3;
    if(photo3 != null && photo3!= "" && photo3!= undefined){
      photoArr.push(photo3);
    }
    if(photo2 != null && photo2!= "" && photo2!= undefined){
      photoArr.push(photo2);
    }

    if(photo != null && photo!= "" && photo!= undefined){
      photoArr.push(photo);
    }

      const items = photoArr;
      console.log('thisisELementsRend',items)
      return(
        // <View><Text>this life</Text></View>
        <FlatGrid
              itemDimension={120}
              data={items}
              style={styles.gridView}
              spacing={13}
              renderItem={({ item }) => (
               
                <View style={{backgroundColor:'#f5f5f5', marginLeft:0, margin:10, borderRadius:10, marginBottom:0, height:150, width:130,}}>
                    
                    <View style ={{ justifyContent:'center', alignItems:'center', }}>
                        <TouchableHighlight onPress={this.props.onPressButton} onLongPress={this._onLongPressButton} underlayColor="white">   

                        <Image source = {{uri:item.uri}}
                        style = {{ width: 100, height: 100 }}
                        />
                        </TouchableHighlight>  
                    </View>
                </View>                // <ProductCard key = {item.id} name = {item.name} onPressButton ={this.onPressButton.bind(this, item.id)} amount = {item.amount} image = {item.images}/>
              )}
            />
      )
    }



   render() {
    const photo = this.props.route.params.photo;
    const photo2 = this.props.route.params.photo2;
    const photo3 = this.props.route.params.photo3;
    console.log('thisisPhoto111',photo);
    const submitLoader = this.state.submitLoader;
    console.log('previous state object',this.props.route.params.productProperty);
    console.log('previous state Dynameobject',this.props.route.params.dynamicFormL);

    
    console.log('allInputDataTo',this.props.route.params.allInputData)
    let allinputField = this.props.route.params.allInputData;
      return (
       

         <View style = {styles.container}>
          <View style={styles.titleWrapper}>
            <BorderedBackButton style = {{}} onPress={() => this.props.navigation.goBack()} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{'Overview'}</Text>
               
            </View>
          </View>

          <Result
          closModal={() => this.setState({showResult:false})}
          status={this.state.transactionStatus}
          userMessage={this.state.userMessage}
          visible={this.state.showResult}
          
          />
         
         
          
              <ScrollView style = {{margin: 20,}}>
              <ProgressLoader
              visible={submitLoader}
              isModal={true} isHUD={true}
              hudColor={"#17375e"}
              color={"#FFFFFF"} />

              {Object.entries(allinputField).map((item, index) => {
                  console.log(item[0],"No",item[1]);
              return( !this.state.excludeFields.includes(item[0])  &&  <View style ={styles.textInputContainer} key={item}>
              
                
                {this.Capitalize(item[0])}
                <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  autoCapitalize = "none"
                  inputLabel={item[1]}
                  placeholder={item[1]}
                  inputValue={item[1]}
                  editable = {false}
                  />
              </View>)
             })
              }



              <ScrollView horizontal={true} style = {{ margin:20,marginTop:2, flexDirection:'row'}}>
               

                    {this.renderPhotoItem()}
                    
              </ScrollView>
            
            
            
            

              <TouchableOpacity
                style = {styles.submitButton}
                onPress = {
                    () => this.submitData()
                }>
                <Text style = {styles.submitButtonText}>Submit </Text>
              </TouchableOpacity>

         </ScrollView>
        
      </View>
      
        
      )
   }
}
export default Overview

const styles = StyleSheet.create({
   container: {
     flex:1,
      paddingTop: 23,
      backgroundColor:'white',
      marginBottom:20,
    },
   input: {
      height: 50,
      backgroundColor:'#eeededa8',
      marginTop:15,
      borderTopLeftRadius:5,borderTopRightRadius:5,borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
   },
   submitButton: {
      backgroundColor: '#3ebd2e',
      padding: 10,
      marginTop: 45,
      height: 50,
      // alignContent:'center',
      justifyContent:'center',
      // alignSelf:'center',
      marginBottom:20,
      borderTopLeftRadius:5,borderTopRightRadius:5,borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
   },
   submitButtonText:{
      color: 'white',
      textAlign:'center',
   }, titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
    paddingHorizontal:20,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 30,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "normal",
    // lineHeight: 32,
    // letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },
  textInputContainer:{
   marginTop:20
 },
 gridView: {
  // marginTop: 10,
  flex: 1,
},
 uploadBox:{
   backgroundColor:'#f5f5f5', justifyContent:'center', alignSelf:'center', marginLeft:0, margin:10, borderRadius:5, marginBottom:0, height:130, width:160,
 }
})
