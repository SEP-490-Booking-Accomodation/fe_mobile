import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function LoadingState() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4E72E3" style={styles.spinner} />
      <Text style={styles.text}>{t("loading")}</Text>
      <Text style={styles.subText}>{t("please_wait")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },
});
