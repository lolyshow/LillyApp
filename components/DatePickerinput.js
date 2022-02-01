import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/FontAwesome";


const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: "column",
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

    line155: {
        height: 50,
        borderRadius: 10,
        backgroundColor: "#f7f7f7",
        padding: 5,
        color: "#17375e",

    },
});

export default function DatepickerInput({
    inputWidth,
    inputStyle = {},
    inputWrapperStyle = {},
    inputLabelStyle = {},
    inputLabel,
    onChangeText,
    placeholder,
    inputValue,
    keyboardType = "default",
    editable = true,
    secureTextEntry = false,
    dateValue
}) {
    applyWidth = inputWidth ? { width: inputWidth } : { alignSelf: "stretch" };

    const [date, setDate] = useState(inputValue);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        dateValue(currentDate)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepickerDepart = () => {
        showMode('date');
        setShow(true);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={[styles.inputWrapper, inputWrapperStyle]}>
                    <Text style={[styles.inputLabel, inputLabelStyle]}>{inputLabel}</Text>
                    <View style={[styles.line155, {flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 10}]}>
                        <TextInput
                            keyboardType={keyboardType}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            secureTextEntry={secureTextEntry}
                            value={date.toLocaleDateString()}
                            editable={editable}
                            style={[inputStyle, applyWidth, {flex: 1}]}
                        ></TextInput>
                        <TouchableOpacity
                            onPress={() => showDatepickerDepart()}
                        >
                        <Icon name="calendar" size={25} color="#17375e" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    dateFormat="longdate"
                    minimumDate={new Date()}
                />
            )}
        </KeyboardAvoidingView>
    );
}
