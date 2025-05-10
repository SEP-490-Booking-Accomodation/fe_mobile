import React from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import dayjs from "dayjs";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants";
import CustomButton from "../../../components/buttons/Button";
import { useTranslation } from 'react-i18next';

export default function BookingFooter({
  bookingData,
  onCancel,
  onPayment,
  onGoHome,
  isUpdating,
}) {
  const { t } = useTranslation();
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
          t('refund_cancel_title'),
          t('refund_cancel_message', { time: refundTime }),
          [
            { text: t('no'), style: "cancel" },
            { text: t('yes'), onPress: onCancel },
          ]
        );
      } else {
        Alert.alert(
          t('refund_overdue_title'),
          t('refund_overdue_message', { time: refundTime }),
          [
            { text: t('no'), style: "cancel" },
            { text: t('cancel_anyway'), onPress: onCancel },
          ]
        );
      }
    } else {
      onCancel();
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
              title={t('refund_cancel_button')}
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
                title={t('cancel_button')}
                onPress={handleCancelPress}
                titleColor="#4E72E3"
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
            )
          )}

          {shouldShowPayNow() && (
            <CustomButton
              title={t('pay_now_button')}
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
            ? t('refund_note_available', {
              time: dayjs(refundDeadline).format("HH:mm DD/MM")
            })
            : t('refund_note_overdue', {
              time: dayjs(refundDeadline).format("HH:mm DD/MM")
            })}
        </Text>
      )}

      {shouldShowViewTicket() && (
        <CustomButton
          title={t('view_ticket_button')}
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
    backgroundColor: "#4E72E3",
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
    borderColor: "#4E72E3",
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E72E3",
  },
  homeButton: {
    backgroundColor: "#4E72E3",
    height: 50,
    borderRadius: 12,
    marginTop: 10,
  },
  refundNote: {
    marginTop: 8,
    color: "#4E72E3",
    fontSize: 13,
    fontStyle: "italic",
  },
});
