import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

export default function ProcessingComponent() {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>

        <View>
         <Text>Loading </Text><ActivityIndicator size="large" color="#17375e" />
        </View>

 </View>
    )
}
