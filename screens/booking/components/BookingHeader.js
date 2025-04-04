import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BookingHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Thông tin đặt phòng</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default BookingHeader;
