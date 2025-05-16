"use client";

import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomButton from "../buttons/Button";

const TicketCard = ({ isPasswordViewable, password, bookingData }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!bookingData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>No booking data available</Text>
      </View>
    );
  }

  const handleShowPassword = () => {
    setShowPassword(true);
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split(" ")[0];
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return dateString.split(" ")[1];
  };

  return (
    <View style={styles.container}>
      {/* Main Card */}
      <View style={styles.card}>
        {/* Room Info */}
        <View style={styles.roomInfo}>
          {/* Line 1: Rental Name */}
          <Text style={styles.roomName}>
            {bookingData.accommodationId?.rentalLocationId?.name || ""}
          </Text>

          {/* Line 2: Full Address */}
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color="#4E72E3" />
            <Text style={styles.locationText}>
              {`${
                bookingData.accommodationId?.rentalLocationId?.address || ""
              }, ${
                bookingData.accommodationId?.rentalLocationId?.ward || ""
              }, ${
                bookingData.accommodationId?.rentalLocationId?.district || ""
              }, ${bookingData.accommodationId?.rentalLocationId?.city || ""}`}
            </Text>
          </View>

          {/* Line 3: Room Type */}
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>
              {bookingData.accommodationId?.accommodationTypeId?.name || ""}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoSection}>
          {/* Line 5: Booking Date - Number of people */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ngày đặt</Text>
              <Text style={styles.infoValue}>
                {formatDate(bookingData.createdAt)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Số người</Text>
              <View style={styles.peopleContainer}>
                <Icon name="person" size={14} color="#4E72E3" />
                <Text style={styles.infoValue}>
                  {bookingData.adultNumber || 0}
                </Text>
                <Text style={styles.infoValue}>/</Text>
                <Icon name="child-care" size={14} color="#4E72E3" />
                <Text style={styles.infoValue}>
                  {bookingData.childNumber || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Line 6: Check-in Check-out */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Check-in</Text>
              <Text style={styles.infoValue}>
                {formatDate(bookingData.checkInHour)} -{" "}
                {formatTime(bookingData.checkInHour)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Check-out</Text>
              <Text style={styles.infoValue}>
                {formatDate(bookingData.checkOutHour)} -{" "}
                {formatTime(bookingData.checkOutHour)}
              </Text>
            </View>
          </View>

          {/* Line 7: Duration - Room No */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Thời hạn ở</Text>
              <Text style={styles.infoValue}>
                {bookingData.durationBookingHour || 0} tiếng
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Room No.</Text>
              <Text style={styles.infoValue}>
                {bookingData.accommodationId?.roomNo || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.passwordContainer}>
          {showPassword ? (
            <>
              <Text style={styles.passwordText}>{password}</Text>
              <CustomButton
                title="Ẩn mật khẩu"
                onPress={handleHidePassword}
                backgroundColor="#1E293B"
                variant="filled"
                size="medium"
                style={styles.passwordButton}
              />
            </>
          ) : (
            <CustomButton
              title="Hiện mật khẩu"
              onPress={handleShowPassword}
              backgroundColor="#1E293B"
              variant="filled"
              size="medium"
              disabled={!isPasswordViewable}
              style={styles.passwordButton}
            />
          )}
        </View>
      </View>

      {/* User Info Card */}
      <View style={styles.userInfoCard}>
        <Text style={styles.userInfoLabel}>Họ và tên</Text>
        <Text style={styles.userInfoValue}>
          {bookingData.customerId?.userId?.fullName || ""}
        </Text>

        <Text style={styles.userInfoLabel}>SĐT:</Text>
        <Text style={styles.userInfoValue}>
          {/* Phone number would be here if available in the API response */}
        </Text>
      </View>

      {/* Total Amount Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalValue}>
          {new Intl.NumberFormat("vi-VN")
            .format(bookingData.totalPrice || 0)
            .replace(".", ",") + " đ"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
    marginBottom: 16,
  },
  roomInfo: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
    flex: 1,
    flexWrap: "wrap",
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
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
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
  peopleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    borderRadius: 100,
    backgroundColor: "#1E293B",
  },
  userInfoCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  totalCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
});

export default TicketCard;
