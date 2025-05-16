import { View, StyleSheet, Alert, Text } from "react-native";
import dayjs from "dayjs";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants";
import CustomButton from "../../../components/buttons/Button";
import { useTranslation } from "react-i18next";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function BookingFooter({
  bookingData,
  onCancel,
  onPayment,
  onGoHome,
  onCheckIn,
  onCheckOut,
  isLoadingBtn,
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

    const deadline = dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss");
    const now = dayjs();

    console.log(typeof deadline); // string
    console.log(
      deadline.isValid()
        ? deadline.format("DD/MM/YYYY HH:mm:ss")
        : "Invalid Date"
    );
    console.log(now.format("DD/MM/YYYY HH:mm:ss"));

    return now.isBefore(deadline);
  };

  const shouldShowCheckIn = () => {
    if (
      status !== BOOKING_STATUS.CONFIRMED ||
      paymentStatus !== PAYMENT_STATUS.PAID
    ) {
      return false;
    }

    // Check if current date equals check-in date
    const currentDate = dayjs().format("YYYY-MM-DD");
    const checkInDate = dayjs(bookingData?.checkInTime).format("YYYY-MM-DD");

    return currentDate === checkInDate;
  };

  const isCheckInButtonClickable = () => {
    if (!shouldShowCheckIn()) return false;

    const currentTime = dayjs();
    const checkInTime = dayjs(bookingData?.checkInTime);
    const checkOutTime = dayjs(bookingData?.checkOutTime);

    // Check if current time is between check-in time and check-out time
    return (
      currentTime.isAfter(checkInTime) ||
      currentTime.isSame(checkInTime) ||
      (currentTime.isAfter(checkInTime) && currentTime.isBefore(checkOutTime))
    );
  };

  const shouldShowCheckOut = () => {
    return status === BOOKING_STATUS.CHECKEDIN;
  };

  const handleCancelPress = () => {
    if (paymentStatus === PAYMENT_STATUS.PAID && refundDeadline) {
      const refundTime = dayjs(refundDeadline).format("HH:mm DD/MM/YYYY");

      if (isRefundAvailable()) {
        Alert.alert(
          t("refund_cancel_title"),
          t("refund_cancel_message", { time: refundTime }),
          [
            { text: t("no"), style: "cancel" },
            { text: t("yes"), onPress: onCancel },
          ]
        );
      } else {
        Alert.alert(
          t("refund_overdue_title"),
          t("refund_overdue_message", { time: refundTime }),
          [
            { text: t("no"), style: "cancel" },
            { text: t("cancel_anyway"), onPress: onCancel },
          ]
        );
      }
    } else {
      onCancel();
    }
  };

  return (
    <View style={styles.footer}>
      {(shouldShowCancel() || shouldShowPayNow() || shouldShowCheckIn()) && (
        <View style={styles.buttonRow}>
          {/* Cancel button */}
          {shouldShowCancel() &&
          paymentStatus === PAYMENT_STATUS.PAID &&
          isRefundAvailable() ? (
            <CustomButton
              title={t("refund_cancel_button")}
              onPress={handleCancelPress}
              titleColor="#EF4444"
              style={[styles.cancelButton, shouldShowCheckIn() && { flex: 1 }]}
              textStyle={styles.cancelButtonText}
              loading={isUpdating}
              disabled={isUpdating}
            />
          ) : (
            shouldShowCancel() && (
              <CustomButton
                title={t("cancel_button")}
                onPress={handleCancelPress}
                titleColor="#4E72E3"
                style={[
                  styles.cancelButton,
                  shouldShowCheckIn() && { flex: 1 },
                ]}
                textStyle={styles.cancelButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
            )
          )}

          {/* Check-in button - placed in the button row */}
          {shouldShowCheckIn() && (
            <CustomButton
              title={t("check_in")}
              onPress={isCheckInButtonClickable() ? onCheckIn : undefined}
              style={[
                styles.checkInButton,
                !isCheckInButtonClickable() && styles.disabledCheckInButton,
              ]}
              textStyle={styles.checkInButtonText}
              disabled={!isCheckInButtonClickable()}
            />
          )}

          {/* Pay now button */}
          {shouldShowPayNow() && (
            <CustomButton
              title={t("pay_now_button")}
              onPress={onPayment}
              style={styles.payButton}
              textStyle={styles.payButtonText}
              loading={false}
              disabled={isLoadingBtn}
            />
          )}
        </View>
      )}

      {paymentStatus === PAYMENT_STATUS.PAID && refundDeadline && (
        <Text style={styles.refundNote}>
          {isRefundAvailable()
            ? t("refund_note_available", {
                // time: dayjs(refundDeadline).format("HH:mm DD/MM"),
                time: refundDeadline,
              })
            : t("refund_note_overdue", {
                time: refundDeadline,
                // time: dayjs(refundDeadline).format("HH:mm DD/MM"),
              })}
        </Text>
      )}

      {shouldShowViewTicket() && (
        <>
          {shouldShowCheckOut() ? (
            <View style={styles.buttonRow}>
              <CustomButton
                title={t("check_out")}
                onPress={onCheckOut}
                style={styles.checkOutButton}
                textStyle={styles.checkInButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
              <CustomButton
                title={t("view_ticket_button")}
                onPress={onGoHome}
                style={styles.viewTicketButton}
              />
            </View>
          ) : (
            <CustomButton
              title={t("view_ticket_button")}
              onPress={onGoHome}
              style={styles.homeButton}
            />
          )}
        </>
      )}
    </View>
  );
}

// Update the styles to ensure the buttons look good side by side
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
  checkInButton: {
    backgroundColor: "#4E72E3",
    height: 50,
    borderRadius: 12,
    flex: 1,
  },
  disabledCheckInButton: {
    backgroundColor: "#A0AEC0",
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  checkOutButton: {
    backgroundColor: "#4E72E3",
    height: 50,
    borderRadius: 12,
    flex: 1,
    marginRight: 5,
  },
  viewTicketButton: {
    backgroundColor: "#4E72E3",
    height: 50,
    borderRadius: 12,
    flex: 1,
    marginLeft: 5,
  },
});
