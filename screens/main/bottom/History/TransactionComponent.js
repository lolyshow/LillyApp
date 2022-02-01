import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Helper from "../../../../Helpers/Helper";

const renderSeparator = () => {
  return (
    <View
      style={{
        marginVertical: 5,
      }}
    />
  );
};

const SectionRenderSeparator = () => {
  return (
    <View
      style={{
        marginVertical: 5,
      }}
    />
  );
};

export default function TransactionComponent({
  onPress,
  sectionData,
  loading,
  refresh,
}) {
  return (
    <SectionList
      onRefresh={refresh}
      refreshing={loading}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 25 }}
      sections={sectionData}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      keyExtractor={(item, index) => index}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback onPress={() => onPress(item)}>
          <View style={styles.transactionHistoryWrapper}>
            <View style={{ flexDirection: "row", flex: 0.6 }}>
              <View
                style={[
                  styles.transactionHistoryIconWrapper,
                  item.icon.backgroundColor && {
                    backgroundColor: item.icon.backgroundColor,
                  },
                ]}
              >
                <Icon
                  name={item.icon.iconName}
                  color={item.icon.iconColor}
                  size={12}
                />
              </View>

              <View style={{ flexDirection: "column", marginLeft: 7 }}>
                <Text style={styles.productText}>{item.name} </Text>
                <Text style={{ fontSize: 12, color: "#555555" }}>
                  {item.destination}
                </Text>
                <Text style={styles.dateText}>{item.created_at} </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                flex: 0.4,
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.amountText}>
                {Helper.formattedAmountWithNaira(item.amount)}{" "}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  item.status === "1"
                    ? styles.statusSuccessful
                    : item.status === "2"
                    ? styles.statusFailed
                    : styles.statusPending,
                ]}
              >
                {item.status == "1"
                  ? "successful"
                  : item.status == "2"
                  ? "failed"
                  : "pending"}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      ItemSeparatorComponent={renderSeparator}
      SectionSeparatorComponent={SectionRenderSeparator}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  upperContainer: {
    backgroundColor: "#17375e",
    flex: 0.2,
    padding: 20,
    justifyContent: "flex-end",
  },

  lowerContainer: {
    flex: 0.8,
    paddingHorizontal: 20,
  },

  settingsText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },

  inputWrapper: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  buttonWrapper: {
    paddingHorizontal: 25,
    marginTop: 45,
  },

  ListHeaderComponentStyle: {
    marginTop: 20,
    marginBottom: 30,
  },

  historySwitch: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  history: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#717171",
  },
  historyActive: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },
  historyWrapper: {
    height: 36,
    width: 159,
    alignItems: "center",
    justifyContent: "center",
  },

  historyWrapperActive: {
    height: 36,
    width: 159,
    borderRadius: 10,
    backgroundColor: "#17375e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  filterWrapper: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#c7c7c7",
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
  },

  input: {
    color: "#17375e",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    width: 220,
    height: 40,
  },

  header: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#b8b8b8",
  },
  transactionHistoryWrapper: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  transactionHistoryIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#e3e3ff",
    justifyContent: "center",
    alignItems: "center",
    marginTop:4
  },

  productText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
    color: "#c7c7c7",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
  },

  statusSuccessful: {
    color: "#01cf13",
  },

  statusFailed: {
    color: "#f36952",
  },

  statusPending: {
    color: "#c7c7c7",
  },
});
