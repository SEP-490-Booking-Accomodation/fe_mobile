import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HeaderLNA = ({
  location = "Chọn thành phố",
  onNotificationPress,
  onAvatarPress,
  onLocationPress,
  onLoginPress,
  avatarSource,
  notificationCount = 0,
  authData,
  displayUser,
}) => {
  const isAuth = authData.isAuth;
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onLocationPress}
        style={styles.locationContainer}
      >
        <Icon name="location-outline" size={24} color="#4E72E3" />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.locationText}
        >
          {location || "Đang tải..."}
        </Text>
      </TouchableOpacity>
      {isAuth ? (
        <View style={styles.rightContainer}>
          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.iconButton}
          >
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
              <Image
                source={{ uri: displayUser.avatar }}
                style={styles.avatar}
              />
            ) : (
              <Icon name="person-circle-outline" size={30} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        userNotLoggedIn({ onLoginPress })
      )}
    </View>
  );
};

function userNotLoggedIn({ onLoginPress }) {
  const handleAlert = () => {
    Alert.alert(
      "Bạn chưa đăng nhập",
      "Vui lòng đăng nhập để sử dụng tính năng này",
      [
        {
          text: "Đăng nhập",
          onPress: () => onLoginPress(),
        },
        { text: "Để sau" },
      ]
    );
  };
  return (
    <View style={styles.notLogin}>
      <TouchableOpacity onPress={handleAlert}>
        <AntDesign name="user" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

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
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  notLogin: {
    padding: 8,
    backgroundColor: "#eeeeee",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(198, 198, 198, 0.3)",
  },
});

export default HeaderLNA;
