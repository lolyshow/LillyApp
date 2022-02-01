import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GreenButton from "../../../../components/GreenButton";
import InputBox from "../../../../components/InputBox";
import SelectBox from "../../../../components/SelectBox";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "40",
    backgroundColor: "#ffffff",
  },
  inputWrapper: {
    flexDirection: "column",

    marginBottom: 15,
  },
  blueText: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },
});

export default function SecurityQuestionComponent({
  questionValue,
  questionChange,
  answerValue,
  answerChange,
  onPressContinue,
  itemList,
}) {
  const items = [
    {
      label: "What is your pass phrase?",
      value: "What is your pass phrase?",
    },

    {
      label: "What is your favorite color?",
      value: "What is your favorite color?",
    },

    {
      label: "What is the name of your first pet?",
      value: "What is the name of your first pet?",
    },

    {
      label: "What is the location of your dream vacation?",
      value: "What is the location of your dream vacation?",
    },

    {
      label: "What is your mother's maiden name?",
      value: "What is your mother's maiden name?",
    },

    {
      label: "Where is the best place to live?",
      value: "Where is the best place to live?",
    },

    {
      label: "What elementary school did you attend?",
      value: "What elementary school did you attend?",
    },

    {
      label: "What is the name of the town where you were born?",
      value: "WWhat is the name of the town where you were born?",
    },

    {
      label: "What was your first car?",
      value: "What was your first car?",
    },
  ];

  return (
    <View>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.blueText}>Security Question</Text>
      </View>

      <View style={styles.inputWrapper}>
        <SelectBox
          placeholder={{ label: "Select  a Security Question", value: null }}
          inputLabel="Choose a Security question"
          value={questionValue}
          items={itemList ?? items}
          onValueChange={questionChange}
        />
      </View>

      <View style={styles.inputWrapper}>
        <InputBox
          multiline={true}
          placeholder="Input your answer"
          inputLabel="Answer"
          inputValue={answerValue}
          onChangeText={answerChange}
        />
      </View>

      <View style={styles.inputWrapper}>
        <GreenButton text="Continue" onPress={onPressContinue} />
      </View>
    </View>
  );
}
