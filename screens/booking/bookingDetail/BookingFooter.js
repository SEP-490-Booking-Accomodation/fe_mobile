import { View, StyleSheet, Alert, Text } from "react-native"
import dayjs from "dayjs"
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants"
import CustomButton from "../../../components/buttons/Button"
import { useTranslation } from "react-i18next"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useGetPolicyHashTagQuery } from "../../../api/policySystemApi"

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
        console.log("Invalid refund deadline format:", refundDeadline)
        return false
      }

      return now.isBefore(deadline)
    } catch (error) {
      console.log("Error parsing refund deadline:", error)
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
      console.log(`Parsing ${dateTimeString}:`, parsed.format(), parsed.isValid())
      
      if (parsed.isValid()) {
        return parsed
      }
      
      console.log("Could not parse date:", dateTimeString)
      return null
    } catch (error) {
      console.log("Error parsing date:", dateTimeString, error)
      return null
    }
  }

  const isCheckInButtonEnabled = () => {
    const checkInTime = parseDateTime(bookingData?.checkInHour)
    const checkOutTime = parseDateTime(bookingData?.checkOutHour)
    
    console.log("=== CHECK-IN BUTTON ENABLED CHECK ===")
    console.log("Check-in time:", checkInTime ? checkInTime.format() : "NULL")
    console.log("Check-out time:", checkOutTime ? checkOutTime.format() : "NULL")
    
    if (!checkInTime) {
      console.log("No valid check-in time")
      return false
    }
    
    const currentDate = dayjs().format("YYYY-MM-DD")
    const checkInDate = checkInTime.format("YYYY-MM-DD")
    
    console.log("Current date:", currentDate)
    console.log("Check-in date:", checkInDate)
    
    if (currentDate !== checkInDate) {
      console.log("Not check-in date")
      return false
    }

    const currentTime = dayjs()
    const policyValues = checkInPolicyData?.data?.[0]?.values || []
    const checkInMinutes = policyValues.length > 0 ? parseInt(policyValues[0].val) : 20 

    console.log("Policy minutes:", checkInMinutes)
    
    const checkInAvailableTime = checkInTime.subtract(checkInMinutes, 'minute')

    console.log("Current time:", currentTime.format())
    console.log("Check-in time:", checkInTime.format())
    console.log("Available time:", checkInAvailableTime.format())
    
    const isEnabled = (
      currentTime.isAfter(checkInAvailableTime) ||
      currentTime.isSame(checkInAvailableTime) ||
      (checkOutTime && currentTime.isAfter(checkInTime) && currentTime.isBefore(checkOutTime))
    )
    
    console.log("Button enabled:", isEnabled)
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
      return `${t('check_in')} (${remainingMinutes}${t('min')})`
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
    if (paymentStatus === PAYMENT_STATUS.PAID && refundDeadline) {
      const formattedTime = (() => {
        try {
          const deadline = dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss")
          return deadline.isValid() ? deadline.format("HH:mm DD/MM/YYYY") : refundDeadline
        } catch {
          return refundDeadline
        }
      })()

      if (isRefundAvailable()) {
        Alert.alert(
          t("refund_cancel_title"),
          t("refund_cancel_message", { time: formattedTime }),
          [
            { text: t("no"), style: "cancel" },
            { text: t("yes"), onPress: onCancel },
          ],
        )
      } else {
        Alert.alert(
          t("refund_overdue_title"),
          t("refund_overdue_message", { time: formattedTime }),
          [
            { text: t("no"), style: "cancel" },
            { text: t("cancel_anyway"), onPress: onCancel },
          ],
        )
      }
    } else {
      onCancel()
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
              onPress={isCheckInButtonEnabled() ? onCheckIn : handleDisabledCheckInPress}
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
                onPress={onCheckOut}
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
  multilineButtonText: {
    textAlign: "center",
    flexWrap: "wrap",
    lineHeight: 20,
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