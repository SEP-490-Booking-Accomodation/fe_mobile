import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStatusText, getPaymentStatusText } from "../../../utils/formatters";
import { useTranslation } from "react-i18next";

export default function BookingStatusBar({ status, paymentStatus, note }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {t("status_label") + " "}
          <Text style={styles.statusValue}>{t(getStatusText(status))}</Text>
        </Text>

        <Text style={styles.statusText}>
          {t("payment_label") + " "}
          <Text style={styles.statusValue}>
            {t(getPaymentStatusText(paymentStatus))}
          </Text>
        </Text>
      </View>
      {note && (
        <View style={{ paddingBottom: 10 }}>
          <View
            style={[
              styles.noteContainer,
              { display: "flex", flexDirection: "row" },
            ]}
          >
            <Text style={styles.noteLabel}>{t("note_label") + ": "}</Text>
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
    // paddingBottom: 12,
    borderRadius: 8,
    // marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    // borderRadius: 8,
    // // marginBottom: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  statusValue: {
    fontWeight: "bold",
    color: "#4E72E3",
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: "#4E72E3",
    backgroundColor: "#F0F4FF",
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 10,
    paddingBottom: 0,
    // marginTop: 8,
  },
  noteLabel: {
    // fontSize: 13,
    fontWeight: "bold",
    color: "#4E72E3",
    // marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: "#333",
  },
});
