import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AntDesign name="inbox" size={48} color="#A0AEC0" />
      </View>
      <Text style={styles.title}>{t("no_booking_found")}</Text>
      <Text style={styles.description}>{t("booking_not_exist")}</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
        <Text style={styles.backText}>{t("go_back")}</Text>
      </TouchableOpacity>
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
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#EDF2F7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: "80%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4E72E3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

