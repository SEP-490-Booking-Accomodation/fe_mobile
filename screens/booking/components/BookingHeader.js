import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const BookingHeader = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <Text style={styles.textHeader}>{t("booking_info")}</Text>
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
