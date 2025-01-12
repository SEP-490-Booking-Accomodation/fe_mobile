import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const NotificationItem = ({ iconName, title, time, message, status }) => {
  return (
    <View
      style={[
        styles.container,
        status === "unread" && styles.unreadNotification, // Highlight unread notifications
      ]}
    >
      <Icon name={iconName} size={24} color="#4E72E3" style={styles.icon} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
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
  title: {
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
  unreadNotification: {
    backgroundColor: "#cee8ff", // Light blue background for unread
  },
});

export default NotificationItem;
