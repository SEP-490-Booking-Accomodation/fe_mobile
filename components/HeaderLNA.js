import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HeaderLNA = ({
  location = "Chọn thành phố",
  onNotificationPress,
  onAvatarPress,
  onLocationPress,
  avatarSource,
  notificationCount = 0,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onLocationPress} style={styles.locationContainer}>
        <Icon name="location-outline" size={24} color="#4E72E3" />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.locationText}
        >
          {location || "Đang tải..."}
        </Text>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <View style={styles.notificationContainer}>
            <Icon name="notifications-outline" size={24} color="#333" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAvatarPress} style={styles.iconButton}>
          {avatarSource ? (
            <Image source={{ uri: avatarSource }} style={styles.avatar} />
          ) : (
            <Icon name="person-circle-outline" size={30} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4E72E3",
    marginLeft: 10,
    maxWidth: "80%",
    overflow: "hidden",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default HeaderLNA;
