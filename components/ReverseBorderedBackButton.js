import React from 'react'
import { View , TouchableNativeFeedback} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";

const Border =  {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "transparent",
    padding: 5,
    justifyContent:'center',
    alignItems:'center'
  }

export default function ReverseBorderedBackButton({onPress}) {
    return (
        <TouchableNativeFeedback>

        <View style={Border}>
            <Icon
              onPress={onPress}
              size={30}
              name="chevron-back-outline"
              color="#fff"
            ></Icon>
          </View>

        </TouchableNativeFeedback>
        
    );
}
