import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';

export default function LoadingState() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{t('loading')}</Text>
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
