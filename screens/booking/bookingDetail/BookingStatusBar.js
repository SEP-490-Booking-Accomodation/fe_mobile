import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStatusText, getPaymentStatusText } from "../../../utils/formatters";
import { useTranslation } from "react-i18next";

export default function BookingStatusBar({ status, paymentStatus }) {
  const { t } = useTranslation();

  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>
        {t('status_label') + " "}
        <Text style={styles.statusValue}>
          {t(getStatusText(status))}
        </Text>
      </Text>
      
      <Text style={styles.statusText}>
        {t('payment_label') + " "}
        <Text style={styles.statusValue}>
          {t(getPaymentStatusText(paymentStatus))}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  statusValue: {
    fontWeight: "bold",
    color: "#4E72E3",
  },
});
