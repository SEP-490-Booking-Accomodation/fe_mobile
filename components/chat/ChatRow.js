import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ChatRow = ({ sender, message, time, status }) => {
  return (
    <View
      style={[
        styles.container,
        status === "unread" && styles.unreadMessage, // Highlight unread messages
      ]}
    >
      <Icon
        name="person-circle-outline"
        size={36}
        color="#4E72E3"
        style={styles.icon}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.sender}>{sender}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  unreadMessage: {
    backgroundColor: "#f0f8ff", // Light blue background for unread
  },
});

export default ChatRow;
