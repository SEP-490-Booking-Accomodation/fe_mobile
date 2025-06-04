import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
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
  const { data: notificationsData, refetch } = useGetNotificationsByUserQuery(userId, { skip: !userId });
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Auto-refetch when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) {
        console.log('NotificationScreen focused, refetching data...');
        refetch();
      }
    });

    return unsubscribe;
  }, [navigation, userId, refetch]);

  const handleMarkAllAsRead = async () => {
    if (!notificationsData?.data || isMarkingAll) return;
    
    setIsMarkingAll(true);
    try {
      const unreadNotifications = notificationsData.data.filter(notification => !notification.isRead);
      
      if (unreadNotifications.length === 0) {
        console.log('No unread notifications to mark');
        return;
      }

      console.log(`Marking ${unreadNotifications.length} notifications as read`);
      
      const promises = unreadNotifications.map(notification => 
        markAsRead(notification._id).unwrap()
      );
      
      await Promise.all(promises);
      console.log('All notifications marked as read successfully');
      
      // Refetch để cập nhật UI
      refetch();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign 
          name="left" 
          size={24} 
          color="#4E72E3" 
        />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.textHeader}>{t('notifications')}</Text>
        {/* Hiển thị số lượng notification chưa đọc */}
        {/* {notificationsData?.data && (
          <Text style={styles.notificationCount}>
            {notificationsData.data.filter(n => !n.isRead).length} chưa đọc
          </Text>
        )} */}
      </View>

      <TouchableOpacity 
        style={[styles.markAllButton, isMarkingAll && styles.disabledButton]} 
        onPress={handleMarkAllAsRead}
        disabled={isMarkingAll || !notificationsData?.data?.some(n => !n.isRead)}
      >
        <MaterialIcons 
          name="checklist" 
          size={24} 
          color={
            isMarkingAll || !notificationsData?.data?.some(n => !n.isRead) 
              ? "#94A3B8" 
              : "#4E72E3"
          } 
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
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  textHeader: {
    fontSize: 22, 
    fontWeight: "600", 
    color: "#1E293B",
  },
  notificationCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  markAllButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});