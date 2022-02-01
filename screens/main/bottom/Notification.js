import React, { Component, useState, useEffect } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import Helper from "../../../Helpers/Helper";
import { getNotifications } from "../../../redux/actions";

function Notification() {
  const [processing, setProcessing] = useState(false);
  const { notification } = useSelector((state) => state.reducers);
  const dispatch = useDispatch();
  const fetchNotification = async () => {
    setProcessing(true);
    dispatch(getNotifications());
    setProcessing(false);
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={processing}
        onRefresh={fetchNotification}
        data={Helper.getPropValue(notification, "data") ?? []}
        key={"_"}
        keyExtractor={(item, index) => index + "_"}
        ListHeaderComponent={
          <>
            <View style={styles.headerWrapper}>
              <Text style={styles.header}>
                {" "}
                <Icon
                  name="notifications"
                  size={30}
                  color={styles.title.color}
                />{" "}
                Notifications
              </Text>
            </View>
          </>
        }
        ListHeaderComponentStyle={styles.headerStyle}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: "7%",
  },

  title: {
    fontSize: 14,
    color: "#17375e",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingTop: 20,
    paddingBottom: 10,
    flexWrap: "wrap",
  },

  message: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    paddingLeft: 5,
    textAlign: "left",
    color: "#707070",
    flexWrap: "wrap",
  },

  row: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    padding: 10,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#17375e",
  },

  headerWrapper: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  headerStyle: {
    paddingTop: "7%",
  },
});

export default Notification;
