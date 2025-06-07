import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStatusText, getPaymentStatusText } from "../../../utils/formatters";
import { useTranslation } from "react-i18next";

export default function BookingStatusBar({ status, paymentStatus, note, style }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#48BB78";
      case "PENDING":
        return "#F6AD55";
      case "CANCELLED":
        return "#F56565";
      default:
        return "#4E72E3";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "#48BB78";
      case "PENDING":
        return "#F6AD55";
      case "REFUNDED":
        return "#4299E1";
      default:
        return "#4E72E3";
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>{t("status_label")}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + "15" }]}>
            <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>
              {t(getStatusText(status))}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>{t("payment_label")}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(paymentStatus) + "15" }]}>
            <Text style={[styles.statusValue, { color: getPaymentStatusColor(paymentStatus) }]}>
              {t(getPaymentStatusText(paymentStatus))}
            </Text>
          </View>
        </View>
      </View>
      {note && (
        <View style={styles.noteWrapper}>
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>{t("note_label")}:</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#1a365d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    marginVertical: 6,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  statusItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#EDF2F7",
    marginHorizontal: 12,
  },
  statusLabel: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 6,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  noteWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  noteContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
    marginRight: 6,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 18,
  },
});
