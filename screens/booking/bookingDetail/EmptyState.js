import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from '@expo/vector-icons/AntDesign';

export default function EmptyState({ onGoBack }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Không có dữ liệu đặt phòng</Text>
      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <ArrowLeft size={24} color="#000" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

