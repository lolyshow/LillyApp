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
      style={
        {
          // margin:5
        }
      }
    />
  );
};

export default function WalletComponent({
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
        <TouchableWithoutFeedback 
        // onPress={() => onPress(item)}
        
        >
          <View style={styles.walletHistoryWrapper}>
            <View style={{ flexDirection: "row", flex: 0.6 }}>
              {/* <View style={styles.walletHistoryIconWrapper}>
                <Icon
                  name={
                    item.type === "CREDIT"
                      ? "arrow-circle-right"
                      : "arrow-circle-left"
                  }
                  size={12}
                  color={
                    item.type === "CREDIT"
                      ? styles.credit.color
                      : styles.debit.color
                  }
                />
              </View> */}

              <View style={{ flexDirection: "column", marginLeft: 7 }}>
                <Text style={styles.productText}>{item.description } </Text>
                <Text style={styles.dateText}>{item.created_at } </Text>
                <Text style={[styles.dateText, ]}> 
                
                <Icon  name="wallet"/> {item.wallet }  
                
                </Text>
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
                {" "}
                {item.type === "CREDIT" ? "+" : "-"} {Helper.formattedAmountWithNaira(item.amount)}
              </Text>
              <Text style={styles.dateText}>Prev Bal. {Helper.formattedAmountWithNaira(item.previous_balance)} </Text>
              <Text
                style={[
                  styles.typeText,
                  
                  item.type == "CREDIT" ? styles.credit : styles.debit,
                ]}
              >
                {item.type}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      ItemSeparatorComponent={renderSeparator}
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
  walletHistoryWrapper: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  walletHistoryIconWrapper: {
    // width: 32,
    // height: 32,
    // borderRadius: 10,
    // backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
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

  typeText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: "left",
  },

  credit: {
    color: "#01cf13",
  },

  debit: {
    color: "#f36952",
  },

  typePending: {
    color: "#c7c7c7",
  },
});
