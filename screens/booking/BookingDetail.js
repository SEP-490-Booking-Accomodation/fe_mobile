import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image, Linking } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { AntDesign } from '@expo/vector-icons'
import CustomButton from "../../components/buttons/Button"
import { useGetBookingByIdQuery, useUpdateBookingMutation } from "../../api/bookingApi"
import { useProcessMomoPaymentMutation } from "../../api/momoPayment"
import Constants from "expo-constants"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { CommonActions } from "@react-navigation/native"
import { useTranslation } from "react-i18next";

// Define payment status constants
const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,
})

// Define booking status constants
const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
  PENDING: 8,
})

export default function BookingDetail() {
  const { t } = useTranslation();
  const navigation = useNavigation()
  const route = useRoute()
  const { bookingId } = route.params || {}
  const { data: bookingData, isLoading, refetch } = useGetBookingByIdQuery(bookingId)
  const [processMomoPayment] = useProcessMomoPaymentMutation()
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation()
  const [showCancel, setShowCancel] = useState(false)

  // Check if we should show the cancel button whenever bookingData changes
  useEffect(() => {
    if (bookingData) {
      const shouldShowCancel =
        Number(bookingData.status) === BOOKING_STATUS.PENDING &&
        (Number(bookingData.paymentStatus) === PAYMENT_STATUS.BOOKING ||
          Number(bookingData.paymentStatus) === PAYMENT_STATUS.PENDING)

      console.log("Setting showCancel to:", shouldShowCancel)
      setShowCancel(shouldShowCancel)
    }
  }, [bookingData])

  useFocusEffect(
    useCallback(() => {
      refetch() // Refetch API mỗi khi quay lại màn hình
    }, [refetch]),
  )

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)

  const getStatusText = (status) => {
    const statusMap = {
      1: t("status_confirmed"),
      2: t("status_need_checkin"),
      3: t("status_checked_in"),
      4: t("status_need_checkout"),
      5: t("status_checked_out"),
      6: t("status_cancelled"),
      7: t("status_completed"),
      8: t("status_pending"),
    }
    return statusMap[status] || t("status_unknown")
  }

  const getPaymentMethodText = (method) => {
    const methodMap = {
      1: t("payment_method_mean"),
      2: t("payment_method_momo"),
      3: t("payment_method_test"),
    }
    return methodMap[method] || t("payment_method_unknown")
  }

  const getPaymentStatusText = (status) => {
    const statusMap = {
      1: t("payment_status_pending"),
      2: t("payment_status_pending"),
      3: t("payment_status_paid"),
      4: t("payment_status_refund"),
      5: t("payment_status_failed"),
    }
    return statusMap[status] || t("payment_status_unknown")
  }

  const handlePayment = async () => {
    if (!bookingData) return

    const totalPrice = bookingData.basePrice + (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice
    const devUrl = `exp://${Constants.expoConfig.hostUri}/--/payment/callback?status=success&orderId=${bookingData.id}`
    const prodUrl = `mean://payment/callback?status=success&orderId=${bookingData.id}`
    const returnUrl = process.env.NODE_ENV === "development" ? devUrl : prodUrl

    const paymentMethod = bookingData.paymentMethod

    if (paymentMethod === 1) {
      try {
        const response = await processMomoPayment({
          data: {
            bookingId: bookingData.id,
            amount: totalPrice,
            description: t("payment_description", { id: bookingData.id, price: totalPrice }),
            returnUrlFE: returnUrl,
            orderIdFE: "MOMO" + new Date().getTime(),
          },
        }).unwrap()

        if (response.payUrl) {
          Linking.openURL(response.deeplink)
          setTimeout(() => {
            refetch()
          }, 3000)
        } else {
          Alert.alert(t("error"), t("payment_create_failed"))
        }
      } catch (error) {
        Alert.alert(t("error"), t("payment_failed"))
      }
    }
  }

  const handleCancel = () => {
    Alert.alert(
      t("cancel_confirmation_title"),
      t("cancel_confirmation_message"),
      [
        {
          text: t("no"),
          style: "cancel",
        },
        {
          text: t("yes_cancel_booking"),
          onPress: async () => {
            try {
              const updatedBookingData = {
                ...bookingData,
                status: BOOKING_STATUS.CANCELLED,
              }

              const result = await updateBooking({
                id: bookingId,
                data: updatedBookingData,
              }).unwrap()

              Alert.alert(
                t("success"),
                t("cancel_success"),
                [
                  {
                    text: "OK",
                    onPress: () => {
                      refetch()
                    },
                  },
                ]
              )
            } catch (error) {
              Alert.alert(
                t("error"),
                error.data?.message || t("cancel_failed")
              )
            }
          },
        },
      ]
    )
  }


  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: {
              index: 0,
              routes: [
                {
                  name: "Home",
                  state: {
                    index: 0,
                    routes: [{ name: "HomeScreen" }],
                  },
                },
              ],
            },
          },
        ],
      }),
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>{t("loading")}</Text>
      </SafeAreaView>
    )
  }

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>{t("no_booking_data")}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#000" />
          <Text style={styles.backText}>{t("go_back")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const rentalData = bookingData.accommodationId.rentalLocationId
  const typeRoom = bookingData.accommodationId.accommodationTypeId
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`
  const totalPrice = bookingData.basePrice + (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice

  // Debug logs
  console.log("Booking Status:", bookingData.status)
  console.log("Payment Status:", bookingData.paymentStatus)
  console.log("showCancel state:", showCancel)

  // Determine which buttons to show
  const isPendingPayment = Number(bookingData.paymentStatus) === PAYMENT_STATUS.PENDING

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>{t("booking_details")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {t("status")}:
          <Text style={styles.statusValue}>{getStatusText(bookingData.status)}</Text>
        </Text>
        <Text style={styles.statusText}>
          {t("payment")}:
          <Text style={styles.statusValue}>{getPaymentStatusText(bookingData.paymentStatus)}</Text>
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {rentalData.image && rentalData.image.length > 0 && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: rentalData.image[0] }} style={styles.image} />
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="enviroment" size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>{t("location")}</Text>
          </View>
          <Text style={styles.value}>{rentalData.name}</Text>
          <Text style={styles.valueSecondary}>{address}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="home" size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>{t("room_type")}</Text>
          </View>
          <Text style={styles.value}>{typeRoom?.name ?? t("no_info")}</Text>
          <Text style={styles.valueSecondary}>{typeRoom?.description ?? ""}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="clockcircle" size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>{t("rental_time")}</Text>
          </View>
          <Text style={styles.value}>{t("check_in")}: {bookingData.checkInHour}</Text>
          <Text style={styles.value}>{t("check_out")}: {bookingData.checkOutHour}</Text>
          <Text style={styles.value}>{t("rental_duration")}: {bookingData.durationBookingHour} {t("hours_text")}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="user" size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>{t("guests")}</Text>
          </View>
          <Text style={styles.value}>{t("adults")}: {bookingData.adultNumber}</Text>
          <Text style={styles.value}>{t("children")}: {bookingData.childNumber}</Text>
        </View>

        {bookingData.note && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t("notes")}</Text>
            </View>
            <Text style={styles.value}>{bookingData.note}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AntDesign name="creditcard" size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>{t("payment_info")}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("payment_method")}:</Text>
            <Text style={styles.paymentValue}>{getPaymentMethodText(bookingData.paymentMethod)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("base_price_text")}:</Text>
            <Text style={styles.paymentValue}>{formatMoney(bookingData.basePrice)} / {t("hour")}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("overtime_price")}:</Text>
            <Text style={styles.paymentValue}>{formatMoney(bookingData.overtimeHourlyPrice)} / {t("hour")}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("rental_hours")}:</Text>
            <Text style={styles.paymentValue}>{bookingData.durationBookingHour} {t("hours")}</Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t("total")}:</Text>
            <Text style={styles.totalValue}>{formatMoney(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isPendingPayment && showCancel && (
          <View style={styles.buttonRow}>
            <CustomButton
              title={t("cancel")}
              onPress={handleCancel}
              titleColor={"#EF4444"}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              loading={isUpdating}
              disabled={isUpdating}
            />
            <CustomButton
              title={t("pay_now")}
              onPress={handlePayment}
              style={styles.payButton}
              textStyle={styles.payButtonText}
              loading={false}
              disabled={isUpdating}
            />
          </View>
        )}

        {isPendingPayment && !showCancel && (
          <CustomButton
            title={t("pay_now")}
            onPress={handlePayment}
            style={styles.payButton}
            textStyle={styles.payButtonText}
          />
        )}

        {!isPendingPayment && (
          <CustomButton
            title={t("go_home")}
            onPress={handleGoHome}
            style={styles.homeButton}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  statusValue: {
    fontWeight: "bold",
    color: "#ff385c",
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  value: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  valueSecondary: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 15,
    color: "#666",
  },
  paymentValue: {
    fontSize: 15,
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff385c",
  },
  footer: {
    marginTop: 16,
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
    flex: 2, // Takes up 2/3 of the space
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
    flex: 1, // Takes up 1/3 of the space
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
})
