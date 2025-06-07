import React from "react";
import { Text, StyleSheet } from "react-native";

export function InfoText({ children }) {
  return <Text style={styles.value}>{children}</Text>;
}

export function InfoSecondaryText({ children }) {
  return <Text style={styles.valueSecondary}>{children}</Text>;
}

const styles = StyleSheet.create({
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 6,
    lineHeight: 22,
  },
  valueSecondary: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
    lineHeight: 20,
  },
});
