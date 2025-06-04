import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function BookingHeader({ rentalName = "" }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#4E72E3" />
        </TouchableOpacity>
        <Text style={styles.header}>{t("booking_details")}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  reportButton: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
