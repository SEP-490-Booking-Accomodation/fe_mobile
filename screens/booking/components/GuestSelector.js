import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";

const GuestSelector = ({ formatGuestCount, setGuestModalVisible }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.peopleRoom}>
      <Text style={styles.sectionHeader}>{t("number_of_guests")}</Text>
      <TouchableOpacity
        style={styles.selectionButton}
        onPress={() => setGuestModalVisible(true)}
      >
        <Text style={styles.selectionText}>{formatGuestCount()}</Text>
        <Users size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  peopleRoom: {
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginBottom: 24,
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default GuestSelector;
