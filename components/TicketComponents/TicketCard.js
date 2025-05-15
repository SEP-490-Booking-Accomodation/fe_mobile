import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomButton from "../buttons/Button";
import QRCodeComponent from "./QRCode";

const TicketCard = ({ mode, onShowPassword, onHidePassword, password }) => {
  const isShowingPassword = mode === "show-password";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Room Info */}
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>Phòng 1 - Phòng con</Text>

          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color="#4E72E3" />
            <Text style={styles.locationText}>Vũng Tàu</Text>
          </View>

          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Trương Gia Đình</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFC907" />
            <Text style={styles.ratingText}>4.8 (120 lượt đánh giá)</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ngày đặt</Text>
              <Text style={styles.infoValue}>30.12.24</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Giờ</Text>
              <Text style={styles.infoValue}>2h</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Check-In</Text>
              <Text style={styles.infoValue}>30.12.24 - 12:30</Text>
            </View>
          </View>

          <View style={styles.infoColumn}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Số người</Text>
              <Text style={styles.infoValue}>2</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ID Number</Text>
              <Text style={styles.infoValue}>NG1011163</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Check-out</Text>
              <Text style={styles.infoValue}>30.12.24 - 14:30</Text>
            </View>
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.passwordContainer}>
          {isShowingPassword ? (
            <>
              <Text style={styles.passwordText}>{password}</Text>
              <CustomButton
                title="Ẩn mật khẩu"
                onPress={onHidePassword}
                backgroundColor="#1E293B"
                variant="filled"
                size="medium"
                style={styles.passwordButton}
              />
            </>
          ) : (
            <CustomButton
              title="Hiện mật khẩu"
              onPress={onShowPassword}
              backgroundColor="#1E293B"
              variant="filled"
              size="medium"
              style={[styles.passwordButton, styles.showPasswordButton]}
            />
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoLabel}>Họ tên</Text>
          <Text style={styles.userInfoValue}>Zane Pham</Text>

          <Text style={styles.userInfoLabel}>Tổng</Text>
          <Text style={styles.userInfoValue}>550.000đ</Text>
        </View>

        <QRCodeComponent
          value={`TICKET:NG1011163:${password}`}
          size={80}
          enableLinearGradient={false}
          color="#000"
          backgroundColor="#FFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomInfo: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 4,
  },
  tagContainer: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#4E72E3",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 24,
  },
  infoColumn: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  passwordContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  passwordText: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 20,
    color: "#1F2937",
  },
  passwordButton: {
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  showPasswordButton: {
    // Add a blue glow/shadow effect for the "Hiện mật khẩu" button
    shadowColor: "#4E72E3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16, // Reduced from 70 since we're not adding the bottom nav
  },
  userInfo: {
    flex: 1,
  },
  userInfoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
});

export default TicketCard;
