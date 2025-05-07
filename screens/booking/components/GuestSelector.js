import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const GuestSelector = ({ formatGuestCount, setGuestModalVisible }) => {
  return (
    <View style={styles.peopleRoom}>
      <Text style={styles.sectionHeader}>Số lượng người ở phòng</Text>
      <TouchableOpacity
        style={styles.selectionButton}
        onPress={() => setGuestModalVisible(true)}
      >
        <Text style={styles.selectionText}>{formatGuestCount()}</Text>
        <AntDesign name="user" size={24} color="black" />
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
