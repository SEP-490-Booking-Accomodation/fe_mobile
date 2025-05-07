import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import { notificationData } from "./data/NotificationData";
import NotificationList from "../../components/notification/NotificationList";
import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function NotificationScreen({ navigation }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(notificationData);

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((item) => ({
      ...item,
      status: "read",
    }));
    setNotifications(updatedNotifications);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t('notifications')}</Text>

      <TouchableOpacity style={{ marginLeft: "auto" }} onPress={markAllAsRead}>
        <MaterialIcons name="checklist" size={24} color="#4E72E3" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <View>
        {renderHeader()}
        <NotificationList iconName={"bell"} data={notifications} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  arrowBack: {
    marginRight: 10,
    color: "#4E72E3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
