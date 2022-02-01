import React from 'react';
import { View, Text, Image, Button,ScrollView, TouchableHighlight,TextInput, StyleSheet,Dimensions, ImageBackground } from 'react-native';
import Input from 'react-native-input-style';
import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from 'react-native-vector-icons/Octicons';
import FontAwes from 'react-native-vector-icons/FontAwesome5';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchIcon from '@material-ui/icons/Search';
//MaterialIcons
import AntDez from 'react-native-vector-icons/AntDesign';
import { FlatGrid } from 'react-native-super-grid';
import MatIco from 'react-native-vector-icons/MaterialIcons';
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import { SectionGrid } from 'react-native-super-grid';
import ProductCard from '../components/ProductCard';
import BorderedBackButton from "../../../../components/BorderedBackButton";
import GridLayout from 'react-native-layout-grid';

class ECategoryDetails extends React.Component {

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
            noProduct:false,
            responseMessage:'',
            searchQuery:'',
            loading:false,
            loadingGold:false,
            silverloading:false,
            diamondloading:false,
            setLoading:false,

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

      componentDidMount() {
        this.getSubCategoryProducts()
      }

      onPressButton() {
        alert('You tapped the button!')
      }
    
      _onLongPressButton() {
        alert('You long-pressed the button!')
      }

      onPressButton =(item)=> {
        this.props.navigation.navigate('EproductDetails', {  
            userName: "username",  
            product_id: item,
        })
      }

      renderProduct = () =>{
        let i = 0;
        
        return this.state.products.map((element) => {
            return(
                
                <ProductCard key = {element.id} name = {element.name} onPressButton ={this.onPressButton.bind(this, element.id)} amount = {element.amount} image = {element.images}/>
            )
        });
    };

    renderlistitem =()=>{
      // const items = [
      //   { name: 'Server', code: '#1abc9c', itemcode:'plug' },
      //   { name: 'laptop', code: '#2ecc71', itemcode:'plug' },
      //   { name: 'Desktop', code: '#3498db', itemcode:'plug' },
      //   { name: 'Others', code: '#9b59b6', itemcode:'plug' },
      // ];
      const items = this.state.products;
      console.log('thisisELementsRend',items)
      return(
        
        <FlatGrid
              itemDimension={120}
              data={items}
              style={styles.gridView}
              // staticDimension={300}
              // fixed
              spacing={13}
              renderItem={({ item }) => (
               
                
                <ProductCard key = {item.id} name = {item.name} onPressButton ={this.onPressButton.bind(this, item.id)} amount = {item.amount} image = {item.images}/>
                // <View><Text>{item.id}</Text></View>
              )}
            />
      )
    }


      getSubCategoryProducts() {
        let responseStatus = 0;
        this.setState({loading: true});
        this.setState({product_id: this.props.route.params.subcategoryid})
        console.log("thisistheProrrr",this.props.route.params.subcategoryid);
        fetch('https://www.lillypayment.com/api/e-commerce',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': 'application/json',
                "Origin": "*"
            },
            body:JSON.stringify({
                action: "getSubCategoryProducts", 
                subCategory : this.props.route.params.subcategoryid,
                })
        }).then((response) => response.json()).then((response) => {
           
            // console.log("thisisthePro",this.props.location.state);
            console.log("thisistheProrrr",response);
            response.status=='204'?this.setState({noProduct:true}):
            console.log("thisisAlterNative",response);
            this.setState({responseMessage:response.message})
            this.setState({products: response.products.data});
            this.setState({initialresp: response.products});
            this.setState({loading: false});
        }).catch(error => {this.setState({loading: false}); console.log('error', error)});

    }


render() {
      //return <Cat/>

      
    //   const data = [{title: 'Cars', items: [{title: 'G-Wagon'},{title: 'Toyota Camry'}]},{title: 'Fashion', items: [{title: 'Watches'}]}];

      const items = [
        { name: 'Server', code: '#1abc9c', itemcode:'plug' },
        { name: 'laptop', code: '#2ecc71', itemcode:'plug' },
        { name: 'Desktop', code: '#3498db', itemcode:'plug' },
        { name: 'Others', code: '#9b59b6', itemcode:'plug' },
      ];
      let loading = this.state.loading;
      console.log(this.props.route.params);
      return (
      <View style = {styles.main}>
         {/* <ScrollView style = {{marginTop:20}}>  */}
         <View style={styles.titleWrapper}>
            <BorderedBackButton style = {{padding:5}} onPress={() => this.props.navigation.goBack()} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{this.props.route.params.categoryName}</Text>
            </View>
        </View>
        
        <View>
        
          <ScrollView>

            


          
            <ScrollView horizontal={true} style = {{ margin:20,marginTop:2, flexDirection:'row'}}>
            {
              loading?<Text>loading....</Text>:this.state.noProduct==true? <Text>{this.state.responseMessage}</Text>:

              this.renderlistitem()
            }
            
            </ScrollView>


          </ScrollView>
              
            
        </View>
      </View>
      );
     
  }
  }
  export default ECategoryDetails;



const {height} = Dimensions.get('screen');
const height_logo = height *0.28;

const styles = StyleSheet.create({
  container:{
    flex:3,
    // backgroundColor:'#17375e',
  },
  gridView: {
    // marginTop: 10,
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
  main:{
    flex:1,
    backgroundColor:"#fff",

    paddingVertical:20,
  },
  category:{
    flex:3,
    // backgroundColor:'#17375e',
  },
  header:{
    flex:0,
    padding:20,
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
 
  SquareShapeView: {
    width: 100,
    height: 35,
    backgroundColor: '#9b59b6',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    justifyContent:'center',
    alignItems:'center',
    margin:20,
    marginTop:0,
    marginLeft:2
  },
 
  SquareShapeView2: {
    width: 100,
    height: 35,
    backgroundColor: '#2ecc71',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    justifyContent:'center',
    alignItems:'center',
    margin:20,
    marginTop:0,
    marginLeft:2
  },

  SquareShapeView3: {
    width: 100,
    height: 35,
    backgroundColor: '#FFC107',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    justifyContent:'center',
    alignItems:'center',
    margin:20,
    marginTop:0,
    marginLeft:2
  },
  RectangleShapeView: {
 
  marginTop: 20,
  width: 120 * 2,
  height: 120,
  backgroundColor: '#FFC107'
 
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
    // marginTop: 15,
    alignItems: "center",
    paddingHorizontal:10,
    // backgroundColor:'white',
  },
  title: {
    // width: 185,
    height: 40,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#17375e",
    // marginLeft: 20,
  },


})