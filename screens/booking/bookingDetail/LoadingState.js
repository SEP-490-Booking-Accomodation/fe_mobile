import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function LoadingState() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Đang tải...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
