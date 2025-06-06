import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const NOTIFICATION_TYPES = {
  BOOKING: 1,
  FEEDBACK: 2,
  PAYMENT: 3,
  USER: 4,
  RENTAL: 5,
  MESSAGE: 6,
};

const getNotificationIcon = (type) => {
  let iconName = "notifications";
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING:
      iconName = "calendar";
      break;
    case NOTIFICATION_TYPES.FEEDBACK:
      iconName = "chatbox";
      break;
    case NOTIFICATION_TYPES.PAYMENT:
      iconName = "wallet";
      break;
    case NOTIFICATION_TYPES.USER:
      iconName = "person";
      break;
    case NOTIFICATION_TYPES.RENTAL:
      iconName = "home";
      break;
    case NOTIFICATION_TYPES.MESSAGE:
      iconName = "mail";
      break;
  }
  return iconName;
};

const getNotificationTypeText = (type) => {
  let text = "";
  switch (type) {
    case NOTIFICATION_TYPES.BOOKING:
      text = "notification_type_booking";
      break;
    case NOTIFICATION_TYPES.FEEDBACK:
      text = "notification_type_feedback";
      break;
    case NOTIFICATION_TYPES.PAYMENT:
      text = "notification_type_payment";
      break;
    case NOTIFICATION_TYPES.USER:
      text = "notification_type_user";
      break;
    case NOTIFICATION_TYPES.RENTAL:
      text = "notification_type_rental";
      break;
    case NOTIFICATION_TYPES.MESSAGE:
      text = "notification_type_message";
      break;
    default:
      text = "notification_type_default";
  }
  return text;
};

const NotificationDetail = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { notification } = route.params;
  const iconName = getNotificationIcon(notification.type);
  const typeText = t(getNotificationTypeText(notification.type));
  const notificationDetailText = t('notification_detail');
  const viewBookingDetailText = t('view_booking_detail');

  const handleNavigateToRelatedScreen = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.BOOKING:
        if (notification.bookingId) {
          navigation.navigate('BookingDetail', { bookingId: notification.bookingId });
        }
        break;
      case NOTIFICATION_TYPES.FEEDBACK:
        // Navigate to feedback screen if needed
        break;
      case NOTIFICATION_TYPES.PAYMENT:
        // Navigate to payment screen if needed
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign 
            name="left" 
            size={24} 
            color="#4E72E3" 
          />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.textHeader}>{notificationDetailText}</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={32} color="#4E72E3" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.type}>{typeText}</Text>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.createdAt}</Text>
          <Text style={styles.message}>{notification.content}</Text>

          {notification.bookingId && (
            <TouchableOpacity 
              style={styles.relatedButton}
              onPress={handleNavigateToRelatedScreen}
            >
              <Text style={styles.relatedButtonText}>
                {viewBookingDetailText}
              </Text>
              <AntDesign name="right" size={16} color="#4E72E3" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  type: {
    fontSize: 14,
    color: '#4E72E3',
    fontWeight: '500',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  relatedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  relatedButtonText: {
    fontSize: 16,
    color: '#4E72E3',
    fontWeight: '500',
  },
});

export default NotificationDetail; 