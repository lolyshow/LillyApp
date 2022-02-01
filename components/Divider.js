import React, { useState, useEffect } from "react";
import { View } from "react-native";

function Divider({style={}}) {
    return (
        <View style={[
            {
                height: 1,
                backgroundColor: "#000",
                width: "100%"
            },
            style
        ]}>
        </View>
    )
}
export default Divider;