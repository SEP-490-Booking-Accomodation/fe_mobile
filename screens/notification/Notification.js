import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import { notificationData } from "./data/NotificationData";
import NotificationList from "../../components/notification/NotificationList";
import { useTranslation } from "react-i18next";
import { useMarkNotificationAsReadMutation, useGetNotificationsByUserQuery } from "../../api/notificationApi";
import { useSelector } from "react-redux";

import { View, Text } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function NotificationScreen({ navigation }) {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.auth?.userId);
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const { data: notificationsData } = useGetNotificationsByUserQuery(userId, { skip: !userId });
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const handleMarkAllAsRead = async () => {
    if (!notificationsData?.data || isMarkingAll) return;
    
    setIsMarkingAll(true);
    try {
      const unreadNotifications = notificationsData.data.filter(notification => !notification.isRead);
      
      const promises = unreadNotifications.map(notification => 
        markAsRead(notification._id).unwrap()
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <AntDesign 
        name="left" 
        size={24} 
        color="#4E72E3" 
        onPress={() => navigation.goBack()} 
      />
      <Text style={styles.textHeader}>{t('notifications')}</Text>

      <TouchableOpacity 
        style={[styles.markAllButton, isMarkingAll && styles.disabledButton]} 
        onPress={handleMarkAllAsRead}
        disabled={isMarkingAll}
      >
        <MaterialIcons 
          name="checklist" 
          size={24} 
          color={isMarkingAll ? "#94A3B8" : "#4E72E3"} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {renderHeader()}
        <NotificationList /> 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16, 
    backgroundColor: "#F9FAFB", 
  },
  textHeader: {
    fontSize: 22, 
    fontWeight: "600", 
    color: "#1E293B",
    marginLeft: 12,
    flex: 1,
  },
  markAllButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});