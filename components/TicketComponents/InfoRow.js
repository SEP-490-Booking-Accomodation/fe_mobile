import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoRow = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
});

export default InfoRow;
