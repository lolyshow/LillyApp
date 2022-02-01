import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import BorderedBackButton from './BorderedBackButton'

const styles  =StyleSheet.create({


  titleWrapper: {
    flexDirection: "row",
    marginBottom: 40,
    alignItems:'center',
  },

  product: {},

  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#17375e",
    marginLeft:'8%',
    textAlign:'center',
    width:200
    
  },
})

export default function Header({
  text,
  backAction  
}) {
    return (
        <View style={styles.titleWrapper}>
        <BorderedBackButton
          onPress={backAction}
        />

        <View>
          <Text style={styles.title}>{text}</Text>
        </View>
      </View>

    )
}
