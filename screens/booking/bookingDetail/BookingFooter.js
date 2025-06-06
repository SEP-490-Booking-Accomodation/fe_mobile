import { View, StyleSheet, Alert, Text } from "react-native"
import dayjs from "dayjs"
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants"
import CustomButton from "../../../components/buttons/Button"
import { useTranslation } from "react-i18next"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useGetPolicyHashTagQuery } from "../../../api/policySystemApi"
import { useCreateNotificationMutation } from "../../../api/notificationApi"

dayjs.extend(customParseFormat)
import { useRoute } from "@react-navigation/native"

export default function BookingFooter({
  bookingData,
  onCancel,
  onPayment,
  onViewTicketDetail,
  onCheckIn,
  onCheckOut,
  isLoadingBtn,
  isUpdating,
}) {
  const { t } = useTranslation()
  const [createNotification] = useCreateNotificationMutation()
  const status = Number(bookingData?.status)
  const paymentStatus = Number(bookingData?.paymentStatus)
  const refundDeadline = bookingData?.timeExpireRefund
  const route = useRoute()
  const { bookingId } = route.params || {}
  
  const { data: checkInPolicyData } = useGetPolicyHashTagQuery("thoigiancheckin")
  
  const shouldShowCancel = () =>
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) &&
    [PAYMENT_STATUS.BOOKING, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID].includes(paymentStatus)

  const shouldShowPayNow = () =>
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(status) && paymentStatus === PAYMENT_STATUS.PENDING
  const shouldShowViewTicket = () => !shouldShowCancel() && !shouldShowPayNow()

  const isRefundAvailable = () => {
    if (!refundDeadline) return false

    try {
      const deadline = dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss")
      const now = dayjs()

      if (!deadline.isValid()) {
        return false
      }

      return now.isBefore(deadline)
    } catch (error) {
      return false
    }
  }

  const shouldShowCheckIn = () => {
    return status === BOOKING_STATUS.CONFIRMED && paymentStatus === PAYMENT_STATUS.PAID
  }

  const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) return null
    
    try {
      const parsed = dayjs(dateTimeString, "DD/MM/YYYY HH:mm:ss")
      
      if (parsed.isValid()) {
        return parsed
      }
      
      return null
    } catch (error) {
      return null
    }
  }

  const isCheckInButtonEnabled = () => {
    const checkInTime = parseDateTime(bookingData?.checkInHour)
    const checkOutTime = parseDateTime(bookingData?.checkOutHour)
    
    if (!checkInTime) {
      return false
    }
    
    const currentDate = dayjs().format("YYYY-MM-DD")
    const checkInDate = checkInTime.format("YYYY-MM-DD")
    
    if (currentDate !== checkInDate) {
      return false
    }

    const currentTime = dayjs()
    const policyValues = checkInPolicyData?.data?.[0]?.values || []
    const checkInMinutes = policyValues.length > 0 ? parseInt(policyValues[0].val) : 20 

    
    const checkInAvailableTime = checkInTime.subtract(checkInMinutes, 'minute')
    
    const isEnabled = (
      currentTime.isAfter(checkInAvailableTime) ||
      currentTime.isSame(checkInAvailableTime) ||
      (checkOutTime && currentTime.isAfter(checkInTime) && currentTime.isBefore(checkOutTime))
    )
    
    return isEnabled
  }

  const getCheckInButtonText = () => {
    const checkInTime = parseDateTime(bookingData?.checkInHour)
    
    if (!checkInTime) {
      return t('check_in')
    }
    
    const currentDate = dayjs().format("YYYY-MM-DD")
    const checkInDate = checkInTime.format("YYYY-MM-DD")
    
    if (currentDate !== checkInDate) {
      const daysUntilCheckIn = dayjs(checkInDate).diff(dayjs(currentDate), 'day')
      if (daysUntilCheckIn > 0) {
        return `${t('check_in')} (${daysUntilCheckIn} ${t('days')})`
      }
    }
    
    if (isCheckInButtonEnabled()) {
      return t('check_in')
    }

    const currentTime = dayjs()
    const policyValues = checkInPolicyData?.data?.[0]?.values || []
    const checkInMinutes = policyValues.length > 0 ? parseInt(policyValues[0].val) : 20
    const checkInAvailableTime = checkInTime.subtract(checkInMinutes, 'minute')
    
    const remainingMinutes = checkInAvailableTime.diff(currentTime, 'minute')
    
    if (remainingMinutes > 0) {
      return `${t('check_in')}`
    }
    
    return t('check_in')
  }

  const handleDisabledCheckInPress = () => {
    const checkInTime = parseDateTime(bookingData?.checkInHour)
    
    if (!checkInTime) {
      Alert.alert(t('check_in_not_available'), "Invalid check-in time", [
        { text: t('yes'), style: "default" }
      ])
      return
    }
    
    const currentDate = dayjs().format("YYYY-MM-DD")
    const checkInDate = checkInTime.format("YYYY-MM-DD")
    const currentTime = dayjs()
    
    const policyValues = checkInPolicyData?.data?.[0]?.values || []
    const checkInMinutes = policyValues.length > 0 ? parseInt(policyValues[0].val) : 20
    const policyDescription = policyValues.length > 0 ? policyValues[0].description : "Được checkin sớm trước 20 phút trở đi"
    
    let alertTitle = t('check_in_not_available')
    let alertMessage = ""
    
    if (currentDate !== checkInDate) {
      const daysUntilCheckIn = dayjs(checkInDate).diff(dayjs(currentDate), 'day')
      alertMessage = t('check_in_date_not_reached', { 
        days: daysUntilCheckIn,
        date: checkInTime.format("DD/MM/YYYY")
      })
    } else {
      const checkInAvailableTime = checkInTime.subtract(checkInMinutes, 'minute')
      const remainingMinutes = checkInAvailableTime.diff(currentTime, 'minute')
      
      if (remainingMinutes > 0) {
        alertMessage = t('check_in_policy_message', {
          minutes: checkInMinutes,
          remainingMinutes: remainingMinutes,
          availableTime: checkInAvailableTime.format("HH:mm"),
          policyDescription: policyDescription
        })
      }
    }
    
    Alert.alert(alertTitle, alertMessage, [
      { text: t('yes'), style: "default" }
    ])
  }

  const shouldShowCheckOut = () => {
    return status === BOOKING_STATUS.CHECKEDIN
  }

  const handleCancelPress = () => {
    onCancel();
  }

  const handleCheckIn = async () => {
    try {
      await onCheckIn();
      await createNotification({
        userId: bookingData.accommodationId.rentalLocationId.ownerId.userId._id,
        bookingId: bookingId,
        title: t("customer_checked_in"),
        content: `${t("customer_checked_in_for")} ${bookingData.rentalLocation.name} ${t("on")} ${dayjs(bookingData.checkInHour).format("DD/MM/YYYY")} ${t("at")} ${dayjs(bookingData.checkInHour).format("HH:mm")}`,
        isRead: false,
        type: 1
      }).unwrap();
    } catch (error) {
    }
  }

  const handleCheckOut = async () => {
    try {
      await onCheckOut();
      await createNotification({
        userId: bookingData.accommodationId.rentalLocationId.ownerId.userId._id,
        bookingId: bookingId,
        title: t("customer_checked_out"),
        content: `${t("customer_checked_out_for")} ${bookingData.rentalLocation.name} ${t("on")} ${dayjs(bookingData.checkOutHour).format("DD/MM/YYYY")} ${t("at")} ${dayjs(bookingData.checkOutHour).format("HH:mm")}`,
        isRead: false,
        type: 1
      }).unwrap();
    } catch (error) {
    }
  }

  return (
    <View style={styles.footer}>
      {(shouldShowCancel() || shouldShowPayNow() || shouldShowCheckIn()) && (
        <View style={styles.buttonRow}>
          {/* Cancel button */}
          {shouldShowCancel() && paymentStatus === PAYMENT_STATUS.PAID && isRefundAvailable() ? (
            <CustomButton
              title={t("refund_cancel_button")}
              onPress={handleCancelPress}
              titleColor="#EF4444"
              style={[styles.cancelButton, shouldShowCheckIn() && { flex: 1 }]}
              textStyle={[styles.cancelButtonText, styles.multilineButtonText]}
              loading={isUpdating}
              disabled={isUpdating}
              numberOfLines={2}
              adjustsFontSizeToFit={true}
            />
          ) : (
            shouldShowCancel() && (
              <CustomButton
                title={t("cancel_button")}
                onPress={handleCancelPress}
                titleColor="#4E72E3"
                style={[styles.cancelButton, shouldShowCheckIn() && { flex: 1 }]}
                textStyle={styles.cancelButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
            )
          )}

          {shouldShowCheckIn() && (
            <CustomButton
              title={getCheckInButtonText()}
              onPress={isCheckInButtonEnabled() ? handleCheckIn : handleDisabledCheckInPress}
              style={[styles.checkInButton, !isCheckInButtonEnabled() && styles.disabledCheckInButton]}
              textStyle={[styles.checkInButtonText, !isCheckInButtonEnabled() && styles.disabledCheckInButtonText]}
              disabled={false}
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
          {(() => {
            const formattedTime = (() => {
              try {
                const deadline = dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss")
                return deadline.isValid() ? deadline.format("HH:mm DD/MM/YYYY") : refundDeadline
              } catch {
                return refundDeadline
              }
            })()

            return isRefundAvailable()
              ? t("refund_note_available", { time: formattedTime })
              : t("refund_note_overdue", { time: formattedTime })
          })()}
        </Text>
      )}

      {shouldShowViewTicket() && (
        <>
          {shouldShowCheckOut() ? (
            <View style={styles.buttonRow}>
              <CustomButton
                title={t("check_out")}
                onPress={handleCheckOut}
                style={styles.checkOutButton}
                textStyle={styles.checkInButtonText}
                loading={isUpdating}
                disabled={isUpdating}
              />
              <CustomButton
                title={t("view_ticket_button")}
                onPress={onViewTicketDetail}
                style={styles.viewTicketButton}
              />
            </View>
          ) : (
            <CustomButton title={t("view_ticket_button")} onPress={onViewTicketDetail} style={styles.homeButton} />
          )}
        </>
      )}
    </View>
  )
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
    height: 'auto',
    minHeight: 50,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4E72E3",
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4E72E3",
    textAlign: 'center',
  },
  multilineButtonText: {
    textAlign: "center",
    flexWrap: "wrap",
    lineHeight: 18,
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
    backgroundColor: "#708de8",
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  disabledCheckInButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.7,
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
})