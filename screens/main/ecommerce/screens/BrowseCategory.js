import React from 'react';
import { View, Text, Image, Button,ScrollView,ActivityIndicator, TouchableHighlight,TextInput, StyleSheet,Dimensions } from 'react-native';
import Input from 'react-native-input-style';
import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwes from 'react-native-vector-icons/FontAwesome5';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchIcon from '@material-ui/icons/Search';
//MaterialIcons
import { FlatGrid } from 'react-native-super-grid';
import MatIco from 'react-native-vector-icons/MaterialIcons';
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import { SectionGrid } from 'react-native-super-grid';
import BorderedBackButton from "../../../../components/BorderedBackButton";

class BrowseCategory extends React.Component {

    constructor(props) {
        super(props);
        // this.checkState();
        this.state = {
            showModal: false,
            currentData: {},
            products: [],
            initialresp: {},
            gold:[],
            silver:[],
            diamond:[],
            details: {},
            searchQuery:'',
            loading:false,
            loadingGold:false,
            silverloading:false,
            diamondloading:false,
            setLoading:false,
            categories:[],

        }
    }


    componentDidMount() {
      this.getCategory();
  }

    getCategory() {
      console.log('responsefrominitial');
      this.setState({loading: true});
      fetch("https://www.lillypayment.com/api/e-commerce",{
          method:'POST',
          headers:{
              'Content-Type':'application/json',
              'Access-Control-Allow-Origin': 'application/json',
              "Origin": "*"
          },
          body:JSON.stringify({
              action: "getCategories"
              })
      }).then((response) => response.json()).then((response) => {
      console.log('CategoryResponse',JSON.stringify(response))
          this.setState({categories: response.categories});
          
          
          this.setState({loading: false});


      }).catch(error => {console.log('errormessage',error);this.setState({loading: false}); console.log('error', error)});


  }

  gotoSubCategory(item){
    console.log('itemgoeshere')

    
     
    if (typeof(this.props.route.params) !== 'undefined') {
    this.props.route.params.userName=== "home"? this.props.navigation.navigate('ESubCategories',{userName: "username", sell:'fal', category_name:item.name, category_id: item.id, nav:"ECategoryDetails"}): this.props.navigation.navigate('ESubCategories',{userName: "username",category_id: item.id, category_name:item.name, sell:'tru', nav:"ECategoryDetails"})
    }else{
      this.props.navigation.navigate('ESubCategories',{userName: "username", sell:'fal', category_name:item.name, category_id: item.id, nav:"ECategoryDetails"})
    }
  }

    static navigationOptions = {
        headerTitle: 'Wallet To Wallet',
        headerStyle: {
            //backgroundColor: '#fb55ab',
            
            backgroundColor: '#101c2c', borderBottomWidth:5, 
            borderBottomColor:'#fb55ab', height:70,
        },
        headerTintColor: '#fb55ab',
        headerTitleStyle: {
            //fontWeight: 'bold',
            textAlign: 'center', 
        },
       
      };


render() {
      //return <Cat/>

      
    //   const data = [{title: 'Cars', items: [{title: 'G-Wagon'},{title: 'Toyota Camry'}]},{title: 'Fashion', items: [{title: 'Watches'}]}];

      const items = [
        { name: 'Agriculture and Food', code: '#1abc9c', itemcode:'plug' },
        { name: 'Animal & Pet', code: '#2ecc71', itemcode:'plug' },
        { name: 'Babies & Kids', code: '#3498db', itemcode:'plug' },
        { name: 'Electronics', code: '#9b59b6', itemcode:'plug' },
        { name: 'Equipments & Tools ', code: '#34495e', itemcode:'plug' },
        { name: 'Fashion', code: '#1abc9c', itemcode:'plug' },
        { name: 'Health & Beauty', code: '#2ecc71', itemcode:'plug' },
        { name: 'Hobbies Art & Sport', code: '#3498db', itemcode:'plug' },
        { name: 'Home & Golden', code: '#9b59b6', itemcode:'plug' },
        { name: 'Phones & Tablet', code: '#34495e', itemcode:'plug' },
        { name: 'Properties', code: '#1abc9c', itemcode:'plug' },
        { name: 'Repair & Construction', code: '#2ecc71', itemcode:'plug' },
        { name: 'Services', code: '#3498db', itemcode:'plug' },
        { name: 'Vehicles', code: '#9b59b6', itemcode:'plug' },
        { name: 'Equipments & Tools ', code: '#34495e', itemcode:'plug' },
        { name: 'Agriculture and Food', code: '#1abc9c', itemcode:'plug' },
        { name: 'Animal & Pet', code: '#2ecc71', itemcode:'plug' },
        { name: 'Babies & Kids', code: '#3498db', itemcode:'plug' },
        { name: 'Electronics', code: '#9b59b6', itemcode:'plug' },
        { name: 'Equipments & Tools ', code: '#34495e', itemcode:'plug' },
       
      ];
      let loading = this.state.loading;
      let itemss = this.state.categories;
       console.log("thisisMyresponseCategroy",this.state.categories);
      return (
        <View style= {styles.container}>
         {/* <ScrollView style = {{marginTop:20}}>  */}

         <View style={styles.titleWrapper}>
                <BorderedBackButton style = {{paddingHorizontal:5,}} onPress={() => this.props.navigation.goBack()} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{'Browse Categories'}</Text>
            </View>
        </View>
        {loading?
          <View>
            <View style={{alignSelf:"center",alignContent:'center', justifyContent:'center', alignItems:'center'}}>
                <View style={{ alignSelf:"center",alignContent:'center', justifyContent:'center', alignItems:'center'}}>
                    <View style={{alignContent:'center',alignContent:'center',justifyContent:'center'}}>
                        <ActivityIndicator  color="#17375e" size="large" />
                        {/* <Text>Loading, Please wait...</Text> */}
                    </View>
                </View>
            </View>
          </View>
          :
            <FlatGrid
                itemDimension={100}
                data={itemss}
                style={styles.gridView}
                // staticDimension={300}
                // fixed
                spacing={20}
                
                renderItem={({ item }) => (
                    
                    <View>
                        <View style = {{  justifyContent: 'center', alignItems:'center'}}>
                            <View>
                                <TouchableHighlight
                                    style = {{
                                    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                    width: Dimensions.get('window').width * 0.14,
                                    height: Dimensions.get('window').width * 0.14,
                                    margin:10,
                                    
                                    backgroundColor:item.icon_color,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    
                                    }}
                                    underlayColor = '#ccc'
                                    onPress = {()=>this.gotoSubCategory(item)}
          
                                    >
                                    {/* <Icon name={item.icon_name == 'bookshelf'?'notebook-multiple':item.icon_name} size={30} color="#fff" /> */}
                                    <Icon name={item.icon_name} size={30} color="#fff" />

                                </TouchableHighlight>
                            </View>


                            <View style ={{height:40}}>
                                <Text style={{textAlign:"center"}}> {item.name} </Text>
                            </View>
                        </View>
                    </View>
                )}
                />}
        {/* </ScrollView> */}
            
          
        </View>
      );
     
  }
  }
  export default BrowseCategory;



const {height} = Dimensions.get('screen');
const height_logo = height *0.28;

const styles = StyleSheet.create({
  container:{
    flex:3,
    backgroundColor:'#fff',
    // padding:20,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },

  category:{
    flex:3,
    // backgroundColor:'#17375e',
  },
  header:{
    flex:0,
    padding:20,
    // backgroundColor:'red',
    // justifyContent:"center",
    // alignItems:"center"
  },
  welcomText:{
    color:'white',
    // fontFamily:'san-serif',
    // margin:10
  },
  text:{
    color:'white',
    fontWeight:'bold',
    fontSize:20,
    // fontFamily:'san-serif',
  },
  footer:{
    flex:1,
    marginTop:10,
    flexDirection:'row',
    backgroundColor:"#fff",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    paddingVertical:20,
    paddingHorizontal:20

  },
  btn_viewall:{
   //marginLeft:200,
   color:'#17375e',
   backgroundColor:'red',
  },
  search:{
    flex:0, borderColor: 'grey', borderWidth: 2,backgroundColor:"#fff",borderTopLeftRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},
titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
    alignItems: "center",
    paddingHorizontal:10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 40,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "normal",
    // lineHeight: 32,
    // letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },

})