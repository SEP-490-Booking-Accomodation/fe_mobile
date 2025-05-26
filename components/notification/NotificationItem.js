import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useMarkNotificationAsReadMutation } from "../../api/notificationApi";
import { useTranslation } from "react-i18next"; 

const NotificationItem = ({ id, iconName, title, time, message, status }) => {
  const { t } = useTranslation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePress = async () => {
    if (status === "unread" && !isLoading) {
      setIsLoading(true);
      try {
        await markAsRead(id).unwrap();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        status === "unread" && styles.unreadNotification,
        isLoading && styles.loadingNotification,
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={isLoading}
    >
      <View style={[
        styles.iconContainer,
        status === "unread" && styles.unreadIconContainer
      ]}>
        <Icon 
          name={iconName} 
          size={22} 
          color={status === "unread" ? "#4E72E3" : "#64748B"} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text 
            style={[
              styles.title, 
              status === "unread" && styles.unreadTitle
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.time}>{formatTime(time)}</Text>
        </View>
        
        <Text 
          style={[
            styles.message, 
            status === "unread" && styles.unreadMessage
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
      
      {status === "unread" && (
        <View style={styles.unreadIndicator}>
          <View style={styles.unreadDot} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 2,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  unreadNotification: {
    backgroundColor: "#F8FAFF",
    borderColor: "#E0E7FF",
    borderLeftWidth: 4,
    borderLeftColor: "#4E72E3",
    elevation: 2,
    shadowOpacity: 0.08,
  },
  loadingNotification: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  unreadIconContainer: {
    backgroundColor: "#EEF2FF",
  },
  contentContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  unreadTitle: {
    fontWeight: "600",
    color: "#1E293B",
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "400",
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    fontWeight: "400",
  },
  unreadMessage: {
    color: "#4B5563",
    fontWeight: "400",
  },
  unreadIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    marginTop: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4E72E3",
  },
});

export default NotificationItem;