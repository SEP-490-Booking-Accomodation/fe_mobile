import React from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import dayjs from "dayjs";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants";
import CustomButton from "../../../components/buttons/Button";

export default function BookingFooter({
  bookingData,
  onCancel,
  onPayment,
  onGoHome,
  isUpdating,
}) {
  const status = Number(bookingData?.status);
  const paymentStatus = Number(bookingData?.paymentStatus);
  const refundDeadline = bookingData?.timeExpireRefund;

  const shouldShowCancel = () =>
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) &&
    [
      PAYMENT_STATUS.BOOKING,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.PAID,
    ].includes(paymentStatus);

  const shouldShowPayNow = () =>
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) &&
    paymentStatus === PAYMENT_STATUS.PENDING;

  const shouldShowViewTicket = () => !shouldShowCancel() && !shouldShowPayNow();

  const isRefundAvailable = () => {
    if (!refundDeadline) return false;
    const now = dayjs();
    const deadline = dayjs(refundDeadline);
    return now.isBefore(deadline);
  };

  const handleCancelPress = () => {
    if (paymentStatus === PAYMENT_STATUS.PAID && refundDeadline) {
      const refundTime = dayjs(refundDeadline).format("HH:mm DD/MM/YYYY");

      if (isRefundAvailable()) {
        Alert.alert(
          "Hoàn và Hủy đặt phòng",
          `Bạn sẽ được hoàn tiền nếu hủy trước ${refundTime}. Bạn chắc chắn muốn hủy?`,
          [
            { text: "Không", style: "cancel" },
            { text: "Có", onPress: onCancel },
          ]
        );
      } else {
        Alert.alert(
          "Đã quá hạn hoàn tiền",
          `Bạn đã quá hạn hoàn tiền (sau ${refundTime}). Bạn vẫn muốn hủy?`,
          [
            { text: "Không", style: "cancel" },
            { text: "Hủy vẫn tiếp tục", onPress: onCancel },
          ]
        );
      }
    } else {
      onCancel(); // Chưa thanh toán thì hủy bình thường
    }
  };

  return (
    <View style={styles.footer}>
      {(shouldShowCancel() || shouldShowPayNow()) && (
        <View style={styles.buttonRow}>
          {/* Nếu đã thanh toán và còn hoàn tiền thì hiện nút "Hoàn và Hủy" */}
          {shouldShowCancel() &&
          paymentStatus === PAYMENT_STATUS.PAID &&
          isRefundAvailable() ? (
            <CustomButton
              title="Hoàn và Hủy đặt phòng"
              onPress={handleCancelPress}
              titleColor="#EF4444"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              loading={isUpdating}
              disabled={isUpdating}
            />
          ) : (
            shouldShowCancel() && (
              <CustomButton
                title="Hủy"
                onPress={handleCancelPress}
                titleColor="#EF4444"
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
            )
          )}

          {shouldShowPayNow() && (
            <CustomButton
              title="Thanh toán ngay"
              onPress={onPayment}
              style={styles.payButton}
              textStyle={styles.payButtonText}
              loading={false}
              disabled={isUpdating}
            />
          )}
        </View>
      )}

      {paymentStatus === PAYMENT_STATUS.PAID && refundDeadline && (
        <Text style={styles.refundNote}>
          {isRefundAvailable()
            ? `* Hủy trước ${dayjs(refundDeadline).format(
                "HH:mm DD/MM"
              )} sẽ được hoàn tiền.`
            : `* Đã quá hạn hoàn tiền (sau ${dayjs(refundDeadline).format(
                "HH:mm DD/MM"
              )}).`}
        </Text>
      )}

      {shouldShowViewTicket() && (
        <CustomButton
          title="Xem vé"
          onPress={onGoHome}
          style={styles.homeButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  payButton: {
    backgroundColor: "#ff385c",
    height: 50,
    borderRadius: 12,
    flex: 2,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF4444",
  },
  homeButton: {
    backgroundColor: "#2196F3",
    height: 50,
    borderRadius: 12,
    marginTop: 10,
  },
  refundNote: {
    marginTop: 8,
    color: "#EF4444",
    fontSize: 13,
    fontStyle: "italic",
  },
});
