import { SafeAreaView, StyleSheet, ScrollView, Alert, Linking } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import Constants from "expo-constants"
import { useTranslation } from "react-i18next"
import { RefreshControl } from "react-native"
import { useState } from "react"
import dayjs from "dayjs"

import { useGetBookingByIdQuery, useUpdateBookingMutation } from "../../../api/bookingApi"
import { useProcessMomoPaymentMutation } from "../../../api/momoPayment"
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants"

import BookingHeader from "./BookingHeader"
import BookingStatusBar from "./BookingStatusBar"
import BookingImage from "./BookingImage"
import LocationInfo from "./LocationInfo"
import RoomTypeInfo from "./RoomTypeInfo"
import TimeInfo from "./TimeInfo"
import GuestsInfo from "./GuestsInfo"
import NoteInfo from "./NoteInfo"
import PaymentInfo from "./PaymentInfo"
import BookingFooter from "./BookingFooter"
import LoadingState from "./LoadingState"
import EmptyState from "./EmptyState"

export default function BookingDetail() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const { bookingId } = route.params || {}
  const [refreshing, setRefreshing] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const { data: bookingData, isLoading, refetch } = useGetBookingByIdQuery(bookingId)

  const [processMomoPayment] = useProcessMomoPaymentMutation()
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation()

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  const handlePayment = async () => {
    setIsLoadingBtn(true)

    if (!bookingData) return
    const totalPrice = bookingData.basePrice + (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice
    const devUrl = `exp://${Constants.expoConfig.hostUri}/--/payment/callback?status=success&orderId=${bookingData.id}`
    const prodUrl = `mean://payment/callback?status=success&orderId=${bookingData.id}`
    const returnUrl = process.env.NODE_ENV === "development" ? devUrl : prodUrl

    const description = t("payment_description", {
      id: bookingData.id,
      price: totalPrice,
    })

    if (bookingData.paymentMethod === 1) {
      try {
        const response = await processMomoPayment({
          data: {
            bookingId: bookingData.id,
            amount: bookingData.totalPrice,
            description: description,
            returnUrlFE: returnUrl,
            orderIdFE: "MOMO" + new Date().getTime(),
          },
        }).unwrap()

        if (response.payUrl) {
          Linking.openURL(response.deeplink)
          setTimeout(() => {
            refetch()
            setIsLoadingBtn(false)
          }, 3000)
        } else {
          Alert.alert(t("error"), t("payment_create_failed"))
          setIsLoadingBtn(false)
        }
        // console.log(response);
      } catch (error) {
        console.error("Thanh toán thất bại:", error)
        Alert.alert(t("error"), t("payment_failed"))
        // setIsLoadingBtn(false);
      } finally {
        // setIsLoadingBtn(false);
      }
    }
  }

  const handleCancel = () => {
    Alert.alert(t("cancel_confirmation_title"), t("cancel_confirmation_message"), [
      { text: t("no"), style: "cancel" },
      {
        text: t("yes_cancel_booking"),
        onPress: async () => {
          try {
            // Kiểm tra nếu hoàn tiền
            const isPaid = bookingData?.paymentStatus === PAYMENT_STATUS.PAID
            const refundDeadline = bookingData?.timeExpireRefund
            const now = dayjs()
            const isRefundAvailable = refundDeadline && now.isBefore(dayjs(refundDeadline))

            const updatedBookingData = {
              ...bookingData,
              status: BOOKING_STATUS.CANCELLED,
              paymentStatus: isPaid && isRefundAvailable ? PAYMENT_STATUS.REFUND : bookingData.paymentStatus,
            }

            await updateBooking({
              id: bookingId,
              data: updatedBookingData,
            }).unwrap()

            Alert.alert(t("success"), isRefundAvailable ? t("cancel_refund_success") : t("cancel_success"), [
              { text: "OK", onPress: () => refetch() },
            ])
          } catch (error) {
            console.error("Error cancelling booking:", error)
            Alert.alert(t("error"), error.data?.message || t("cancel_failed"))
          }
        },
      },
    ])
  }

  const handleViewTicketDetail = () => {
    navigation.navigate("TicketDetail", {
      bookingId: bookingData.id,
    })
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    try {
      const updatedBookingData = {
        ...bookingData,
        status: BOOKING_STATUS.CHECKEDIN,
      }

      await updateBooking({
        id: bookingId,
        data: updatedBookingData,
      }).unwrap()
      Alert.alert(t("success"), t("check_in_success"), [{ text: "OK", onPress: () => refetch() }])
    } catch (error) {
      console.error("Error checking in:", error)
      Alert.alert(t("error"), error.data?.message || t("check_in_failed"))
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    // Check if current time is before checkout time
    const currentTime = new Date()
    const checkOutTime = bookingData.checkOutHour ? new Date(bookingData.checkOutHour) : null

    // If checkout time exists and current time is before checkout time
    if (checkOutTime && currentTime < checkOutTime) {
      // Calculate remaining time
      const remainingMs = checkOutTime.getTime() - currentTime.getTime()
      const remainingMinutes = Math.floor(remainingMs / (1000 * 60))
      const remainingHours = Math.floor(remainingMinutes / 60)
      const mins = remainingMinutes % 60

      // Format remaining time message
      let timeMessage = ""
      if (remainingHours > 0) {
        timeMessage = `${remainingHours} ${remainingHours === 1 ? t("hour") : t("hours")}`
        if (mins > 0) {
          timeMessage += ` ${mins} ${mins === 1 ? t("minute") : t("minutes")}`
        }
      } else {
        timeMessage = `${mins} ${mins === 1 ? t("minute") : t("minutes")}`
      }

      // Show confirmation dialog
      Alert.alert(
        t("early_checkout_title") || "Early Checkout",
        t("early_checkout_message", { time: timeMessage }) ||
          `You still have ${timeMessage} remaining. Are you sure you want to check out now?`,
        [
          {
            text: t("cancel") || "Cancel",
            style: "cancel",
          },
          {
            text: t("proceed") || "Proceed",
            onPress: () => performCheckout(),
          },
        ],
        { cancelable: true },
      )
    } else {
      // If current time is after checkout time or checkout time doesn't exist, proceed directly
      performCheckout()
    }
  }

  // Extracted the actual checkout logic to a separate function
  const performCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const updatedBookingData = {
        ...bookingData,
        status: BOOKING_STATUS.CHECKEDOUT,
      }

      await updateBooking({
        id: bookingId,
        data: updatedBookingData,
      }).unwrap()
      Alert.alert(t("success"), t("check_out_success"), [{ text: "OK", onPress: () => refetch() }])
    } catch (error) {
      console.error("Error checking out:", error)
      Alert.alert(t("error"), error.data?.message || t("check_out_failed"))
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (!bookingData) {
    return <EmptyState onGoBack={() => navigation.goBack()} />
  }

  const rentalData = bookingData?.accommodationId?.rentalLocationId;
  const typeRoom = bookingData?.accommodationId?.accommodationTypeId;
  const password = bookingData?.passwordRoom;
  const bId = bookingData?.id;
  const rentalName = rentalData?.name;
  const accommodationType =
    bookingData?.accommodationId?.accommodationTypeId?.name || "";
  const roomNo = bookingData?.accommodationId?.roomNo || "";
  console.log("room", roomNo);
  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader
        bookingId={bId}
        rentalName={rentalName}
        accommodationType={accommodationType}
        roomNo={roomNo}
      />

      <BookingStatusBar status={bookingData.status} paymentStatus={bookingData.paymentStatus} note={bookingData.note} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {typeRoom.image && typeRoom.image.length > 0 && <BookingImage imageUrl={typeRoom.image[0]} />}

        <LocationInfo rentalData={rentalData} />
        <RoomTypeInfo typeRoom={typeRoom} password={password} />
        <TimeInfo bookingData={bookingData} />

        <GuestsInfo adultNumber={bookingData.adultNumber} childNumber={bookingData.childNumber} />

        <NoteInfo note={bookingData.note} />
        <PaymentInfo bookingData={bookingData} />
      </ScrollView>

      <BookingFooter
        bookingData={bookingData}
        onCancel={handleCancel}
        onPayment={handlePayment}
        onViewTicketDetail={handleViewTicketDetail}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isUpdating={isUpdating || isCheckingIn || isCheckingOut}
        isLoadingBtn={isLoadingBtn}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollView: {
    padding: 16,
  },
})
