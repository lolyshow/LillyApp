import React from "react";
import {
    Text,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import { IconButton } from "react-native-paper";

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: "row",
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 21,
        letterSpacing: 0,
        textAlign: "left",
        color: "#707070",
        marginBottom: 5,
    },

    SectionStyle: {
        flexDirection: 'row',
        backgroundColor: "#f7f7f7",
        height: 50,
        paddingHorizontal: 10,
        borderRadius: 10,  
        marginBottom: 40              
    },
    defaultIcon: {
        backgroundColor: "#17375e",
        borderRadius: 5,
        elevation: 5
    }
});

export default function SubmitInputBox({
    inputWidth,
    inputStyle = {},
    icon = null,
    iconStyle = null,
    inputWrapperStyle = {},
    inputLabelStyle = {},
    inputLabel,
    iconOnPress = null,
    onChangeText,
    iconColor = null,
    iconSize = null,
    placeholder,
    inputValue,
    keyboardType = "default",
    editable = true,
    secureTextEntry = false
}) {
    applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.SectionStyle}>
                    <TextInput
                        keyboardType={keyboardType}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        value={inputValue}
                        editable={editable}
                        style={[inputStyle, applyWidth, {flex: 1}]}
                    ></TextInput>
                    {icon ? <IconButton onPress={() => iconOnPress()} style={iconStyle || styles.defaultIcon} icon={icon} color={iconColor || "#fff"} size={iconSize || 30} /> : null}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
