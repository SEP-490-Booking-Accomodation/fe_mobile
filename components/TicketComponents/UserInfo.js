import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserInfo = ({ name, total }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Họ tên</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Tổng</Text>
        <Text style={styles.value}>{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
});

export default UserInfo;
