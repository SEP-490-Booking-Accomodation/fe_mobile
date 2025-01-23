import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HeaderLNA = ({
  location = "Your Location",
  onNotificationPress,
  onAvatarPress,
  avatarSource,
  notificationCount = 0, // Số lượng thông báo
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Location */}
      <View style={styles.locationContainer}>
        <Icon name="location-outline" size={24} color="#4E72E3" />
        <Text
          numberOfLines={1} // Giới hạn chỉ hiển thị 1 dòng
          ellipsizeMode="tail" // Hiển thị dấu ba chấm ở cuối nếu quá dài
          style={styles.locationText}
        >
          {location || "Đang tải..."}
        </Text>
      </View>

      {/* Right Side (Notification + Avatar) */}
      <View style={styles.rightContainer}>
        {/* Notification Icon with badge */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconButton}
        >
          <View style={styles.notificationContainer}>
            <Icon name="notifications-outline" size={24} color="#333" />
            {/* Thêm chấm đỏ hoặc số lượng thông báo */}
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Avatar Icon */}
        <TouchableOpacity onPress={onAvatarPress} style={styles.iconButton}>
          {avatarSource ? (
            <Image source={{ uri: avatarSource }} style={styles.avatar} />
          ) : (
            <Icon name="person-circle-outline" size={24} color="#000000" />
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
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4E72E3",
    marginLeft: 10,
    maxWidth: "100%", // Đảm bảo giới hạn chiều rộng
    overflow: "hidden", // Ẩn nội dung thừa
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
