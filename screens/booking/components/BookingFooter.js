import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import CustomButton from "../../../components/buttons/Button";
import { useTranslation } from "react-i18next";

const BookingFooter = ({
  navigation,
  formatMoney,
  calculateTotalPrice,
  handleContinue,
  isFormValid,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={20} color="black" />
      </TouchableOpacity>
      <View style={styles.priceContainer}>
        <Text style={styles.currencySymbol}>{t("total")}</Text>
        <Text style={styles.price}>{formatMoney(calculateTotalPrice())}</Text>
      </View>
      <CustomButton
        style={[{ width: "45%" }, !isFormValid && styles.disabledButton]}
        title={t("confirm_button")}
        onPress={handleContinue}
        disabled={!isFormValid}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 15,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#666",
    marginRight: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default BookingFooter;
