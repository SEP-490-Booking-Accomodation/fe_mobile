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
    color: "#333",
    marginBottom: 4,
  },
  valueSecondary: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
});
