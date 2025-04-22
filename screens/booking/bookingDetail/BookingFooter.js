import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants";
import CustomButton from "../../../components/buttons/Button";

export default function BookingFooter({
  bookingData,
  onCancel,
  onPayment,
  onGoHome,
  isUpdating,
}) {
  const shouldShowCancel = () => {
    const status = Number(bookingData?.status);
    const paymentStatus = Number(bookingData?.paymentStatus);
    return (
      [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) &&
      [
        PAYMENT_STATUS.BOOKING,
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.PAID,
      ].includes(paymentStatus)
    );
  };

  const shouldShowPayNow = () => {
    const status = Number(bookingData?.status);
    const paymentStatus = Number(bookingData?.paymentStatus);
    return (
      [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) &&
      paymentStatus === PAYMENT_STATUS.PENDING
    );
  };

  const shouldShowViewTicket = () => {
    return !shouldShowCancel() && !shouldShowPayNow();
  };

  return (
    <View style={styles.footer}>
      {shouldShowCancel() || shouldShowPayNow() ? (
        <View style={styles.buttonRow}>
          {shouldShowCancel() && (
            <CustomButton
              title="Hủy"
              onPress={onCancel}
              titleColor="#EF4444"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              loading={isUpdating}
              disabled={isUpdating}
            />
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
      ) : (
        shouldShowViewTicket() && (
          <CustomButton
            title="Xem vé"
            onPress={onGoHome}
            style={styles.homeButton}
          />
        )
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
  },
});
