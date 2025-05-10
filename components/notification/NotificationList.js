// HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import NotificationItem from "./NotificationItem";
import { useGetNotificationsByUserQuery } from "../../api/notificationApi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const NotificationList = () => {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.auth?.userId);
  const {
    data: notifications,
    isLoading,
    error,
  } = useGetNotificationsByUserQuery(userId);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.error}>{t('error_loading_notifications')}</Text>;
  }

  const transformedData = notifications?.data?.map((notification) => ({
    id: notification._id,
    icon: getNotificationIcon(notification.type),
    title: notification.title,
    time: notification.createdAt,
    message: notification.content,
    status: notification.isRead ? "read" : "unread",
  }));

  return (
    <FlatList
      data={transformedData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          id={item.id}
          iconName={item.icon}
          title={item.title}
          time={item.time}
          message={item.message}
          status={item.status}
        />
      )}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.empty}>{t('no_notifications')}</Text>}
    />
  );
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 1:
      return "checkmark-circle-outline";
    case 2:
      return "close-circle-outline";
    case 3:
      return "wallet-outline";
    default:
      return "notifications-outline";
  }
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  loading: {
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default NotificationList;
