import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStatusText, getPaymentStatusText } from "../../../utils/formatters";

export default function BookingStatusBar({ status, paymentStatus }) {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>
        Trạng thái:
        <Text style={styles.statusValue}>{getStatusText(status)}</Text>
      </Text>
      <Text style={styles.statusText}>
        Thanh toán:
        <Text style={styles.statusValue}>
          {getPaymentStatusText(paymentStatus)}
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
    color: "#ff385c",
  },
});
