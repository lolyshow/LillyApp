import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import GreenButton from "./GreenButton";

import WhiteButton from "./WhiteButton";

import BorderedCancelButton from "./BorderedCancelButton";


const screenWidth = Math.round(Dimensions.get("window").width);

const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",

    // alignItems:'center',
    paddingVertical: Platform.select({
      ios:50,
      android:5
    }),
    paddingHorizontal: 15,
  },

  closeBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: 5,
  },

  titleWrapper: {
    marginBottom: 10,
    paddingLeft: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginBottom: 5,
  },

  modalView: {
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    padding: 10,
    paddingBottom: 50,
    borderRadius: 15,
  },

  contents: {
    padding: 5,
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
  },

  label: {
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 40,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
    fontSize: 17,
  },

  labelWrapper: {
    marginLeft: 20,
  },

  productWrapper: {
    flex: 0.9,
    flexDirection: "row",
  },

  tick: {
    flex: 0.1,
    alignItems: "flex-end",
  },
  line37: {
    height: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
    
   
  },

  inputBox: {
    opacity: 0.5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",

  },

  inputIconContainer: {
    alignItems: "flex-end",
    bottom: 1,
    flex: 0.2,
   
  },

  inputLabel: {
    flex: 0.8,
    opacity: 0.5,
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  
  },
});

export default function ModalSelectLine({
  closModal,
  showModal,
  visible,
  inputLabel,
  selectTitle,
  items,
  selected,
  onSelect,
  iconName = "chevron-down-outline",
  iconColor = "#17375e",
  iconSize = 20,
  inputWidth,
  placeholder
}) {
  
  applyWidth =  inputWidth ?  {width:inputWidth} : {alignSelf:'stretch'};

  const [item, setItem] = useState(selected);

   const onValueChange = (itemValue, itemIndex) => {
    setItem(itemValue);
    onSelect(itemValue);
  };


  const ItemObj = items.find((item) => item.value === selected);
 

  return (
    <View>
     
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>{inputLabel}</Text>
          </View>

          <TouchableWithoutFeedback onPress={showModal}>
         

            <View style={[styles.inputBox, applyWidth]}>
         
         <View style={{  flexDirection: "row",  alignItems:'center'}}>
         
         {    ItemObj  ?
           
         
           <Text style={styles.inputLabel}>{ItemObj.label}</Text>
        
           
           : <Text style={[styles.inputLabel]}> {placeholder ? placeholder : 'Select an item...'  }</Text>

         }

         <View style={styles.inputIconContainer}>
           <Icon name={iconName} size={iconSize} color={iconColor} />
         </View>

         </View>

         
       </View>
       
         
       
       </TouchableWithoutFeedback>

       
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={closModal}
      >
        <View style={[styles.container]}>
          <View style={styles.modalView}>
            <View style={styles.closeBox}>
              <BorderedCancelButton onPress={closModal} />
            </View>

            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{selectTitle}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contents}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onValueChange(item.value, index)}
                >
                  <View style={styles.row}>
                    <View style={styles.productWrapper}>
                      <View style={styles.labelWrapper}>
                        <Text style={styles.label}>{item.label}</Text>
                      </View>
                    </View>

                    <View style={styles.tick}>
                      {selected == item.value && (
                        <Icon
                          name="checkmark-outline"
                          size={30}
                          color="#01cf13"
                        />
                      )}
                    </View>
                  </View>
                  <View style={styles.line37}></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
