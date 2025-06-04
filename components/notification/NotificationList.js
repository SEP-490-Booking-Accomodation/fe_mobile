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
  const { data, isLoading, error, refetch } = useGetNotificationsByUserQuery(userId, { skip: !userId });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4E72E3" />
        <Text style={styles.loadingText}>{t('loading_notifications')}</Text>
      </View>
    );
  }

  if (error) {
    if (error.status === 404) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>{t('no_notifications')}</Text>
          <Text style={styles.emptySubtitle}>{t('no_notifications_subtitle')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>{t('error_loading_notifications')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="notifications-off-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>{t('no_notifications')}</Text>
        <Text style={styles.emptySubtitle}>{t('check_back_later')}</Text>
      </View>
    );
  }

  const transformedData = data.data.map((notification) => ({
    id: notification._id,
    type: notification.type,
    title: notification.title,
    time: notification.createdAt,
    message: notification.content,
    status: notification.isRead ? "read" : "unread",
    bookingId: notification.bookingId,
  }));

  return (
    <FlatList
      data={transformedData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem {...item} />}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4E72E3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#4E72E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
});

export default NotificationList;