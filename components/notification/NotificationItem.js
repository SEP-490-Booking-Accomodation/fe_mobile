import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useMarkNotificationAsReadMutation } from "../../api/notificationApi";
import { useTranslation } from "react-i18next"; 


const NotificationItem = ({ id, iconName, title, time, message, status }) => {
  const { t } = useTranslation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const handlePress = () => {
    if (status === "unread") {
      markAsRead(id);
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.container,
        status === "unread" && styles.unreadNotification,
      ]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Icon name={iconName} size={24} color="#4E72E3" style={styles.icon} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, status === "unread" && styles.unreadTitle]}>
            {title}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={[styles.message, status === "unread" && styles.unreadMessage]}>
          {message}
        </Text>
      </View>
      {status === "unread" && (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadBadgeText}>{t('new')}</Text>
      </View>
    )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: "#333",
  },
  unreadTitle: {
    fontWeight: "bold",
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
    color: "#444",
  },
  unreadNotification: {
    backgroundColor: "#f0f7ff",
    borderLeftWidth: 3,
    borderLeftColor: "#4E72E3",
  },
  unreadBadge: {
    backgroundColor: "#FF4B26",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default NotificationItem;