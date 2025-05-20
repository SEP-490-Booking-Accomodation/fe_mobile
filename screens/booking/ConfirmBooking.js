import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import CustomButton from "../../components/buttons/Button";
import PaymentConfirm from "./components/PaymentConfirm";
import { useCreateBookingMutation } from "../../api/bookingApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useGetCustomerByUserIdQuery } from "../../api/authApi";
import CouponSelector from "./components/CouponSelector";
import { useGetPolicyHashTagQuery } from "../../api/policySystemApi";
import { useTranslation } from "react-i18next";

export default function ConfirmBooking() {
  const { t } = useTranslation();
  const authData = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const { data: customerData } = useGetCustomerByUserIdQuery(authData.userId);
  const { data: getTimeRefundData } = useGetPolicyHashTagQuery("exRefund");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [createBooking] = useCreateBookingMutation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const values = getTimeRefundData?.data?.[0]?.values || [];
  let refundMinutes = values[0]?.val || 20; // mặc định nếu không có
  const bookingTime = dayjs(); // thời điểm tạo booking
  const refundDeadline = bookingTime.add(refundMinutes, "minute");
  const refundDeadlineISO = refundDeadline.toISOString();

  // console.log(refundDeadline);
  // console.log(bookingTime);

  useEffect(() => {
    if (bookingData) {
      calculateTotal();
    }
  }, [bookingData, selectedVoucher]);

  const calculateTotal = () => {
    if (!bookingData) return;
    const originalTotal = bookingData.totalPrice;
    let discount = 0;

    if (selectedVoucher) {
      if (
        selectedVoucher.discountBasedOn === "Percentage" ||
        selectedVoucher.discountBasedOn === "percentage"
      ) {
        discount = (originalTotal * selectedVoucher.amount) / 100;

        if (
          selectedVoucher.maxDiscount &&
          discount > selectedVoucher.maxDiscount
        ) {
          discount = selectedVoucher.maxDiscount;
        }
      } else if (
        selectedVoucher.discountBasedOn === "Fixed" ||
        selectedVoucher.discountBasedOn === "fixed"
      ) {
        discount = selectedVoucher?.amount;

        if (discount > originalTotal) {
          discount = originalTotal;
        }
      }
    }

    const priceAfterDiscount = originalTotal - discount;
    setDiscountAmount(discount);
    setFinalTotal(priceAfterDiscount);
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>{t("no_booking_data")}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{t("go_back")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const rentalData = bookingData.rentalData.data;
  const typeRoom = bookingData.accommodationType;
  const address = `${rentalData.address}, ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;

  const [day, month, year] = bookingData?.date.split("-");
  const [hours, minutes] = bookingData?.time.split(":");
  const checkInHour = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes
  ).toISOString();

  const [dayEnd, monthEnd, yearEnd] = bookingData?.endDate.split("-");
  const [hoursEnd, minutesEnd] = bookingData?.endTime.split(":");
  const checkOutHour = new Date(
    yearEnd,
    monthEnd - 1,
    dayEnd,
    hoursEnd,
    minutesEnd
  ).toISOString();

  const checkInDateTime = `${bookingData.date} ${bookingData.time}:00`;
  const checkOutDateTime = `${bookingData.date} ${bookingData.endTime}:00`;
  // console.log(checkInDateTime);
  // console.log(checkOutDateTime);
  // console.log(finalTotal);

  const handleConfirm = async () => {
    setIsLoading(true);

    const formBooking = {
      // policySystemIds: policyId || ["67ebf15d828b69a4d279d960"],
      customerId: customerData.id,
      accommodationTypeId: typeRoom.id,
      couponId: selectedVoucher?.id || null,
      feedbackId: null,
      basePrice: typeRoom.basePrice,
      overtimeHourlyPrice: typeRoom.overtimeHourlyPrice,
      checkInHour: checkInDateTime,
      checkOutHour: checkOutDateTime,
      rentalLocationId: rentalData.id,
      confirmDate: null,
      paymentMethod: paymentMethod,
      paymentStatus: 2,
      adultNumber: bookingData.guests.adults,
      childNumber: bookingData.guests.children,
      durationBookingHour: bookingData.duration,
      completedDate: null,
      passwordRoom: "",
      note: bookingData.note || "",
      status: 8,
      // timeExpireRefund: refundDeadline,
      timeExpireRefund: refundDeadlineISO,
      // discountAmount: discountAmount, // Add discount amount to the booking data
      totalPrice: finalTotal, // Add final total after discount
    };
    // console.log(formBooking);

    try {
      const response = await createBooking({
        data: formBooking,
      }).unwrap();

      // navigation.navigate("BookingDetail", {
      //   bookingId: response.booking.id,
      // });

      // navigation.reset({
      //   index: 1,
      //   routes: [
      //     {
      //       name: "MainTabs",
      //       params: {
      //         screen: "Ticket",
      //         params: {
      //           screen: "BookingDetail",
      //           params: { bookingId: response.booking.id },
      //         },
      //       },
      //     },
      //   ],
      // });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "MainTabs",
              state: {
                routes: [
                  { name: "Home" },
                  {
                    name: "Ticket",
                    state: {
                      routes: [
                        { name: "TicketList" },
                        {
                          name: "BookingDetail",
                          params: { bookingId: response.booking.id },
                        },
                      ],
                      index: 1,
                    },
                  },
                ],
                index: 1,
              },
            },
          ],
        })
      );
    } catch (error) {
      console.log(error);

      Alert.alert(t("failed"), error.data?.message || t("booking_failed"));
    } finally {
      setIsLoading(false);
    }
  };
  // const handleConfirm1 = async () => {
  //   console.log("Confirm");
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t("confirm_booking_title")}</Text>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.card}>
            <Text style={styles.label}>{t("location")}:</Text>
            <Text style={{ fontSize: 18 }}>{rentalData.name}</Text>
            <View>
              <Text style={styles.value}>{address}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t("room_type")}:</Text>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              {typeRoom?.name ?? t("no_info")}
            </Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("base_price_text")}: </Text>
              <Text>{formatMoney(typeRoom?.basePrice)}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("overtime_price")}: </Text>
              <Text>{formatMoney(typeRoom?.overtimeHourlyPrice)}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("total_duration")}: </Text>
              <Text>
                {bookingData?.duration}
                {t("h")}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t("rental_time")}:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("date")}: </Text>
              <Text>{bookingData?.date}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("time")}:</Text>
              <Text>
                {bookingData?.time} - {bookingData?.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t("guests")}:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("adults")}:</Text>
              <Text>{bookingData?.guests?.adults}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("children")}:</Text>
              <Text>{bookingData?.guests?.children}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <CouponSelector
              selectedVoucher={selectedVoucher}
              setSelectedVoucher={setSelectedVoucher}
            />
          </View>

          <View style={styles.card}>
            <PaymentConfirm setPaymentMethod={setPaymentMethod} />
          </View>

          {/* Summary section */}
          <View style={styles.card}>
            <Text style={styles.label}>{t("payment_summary")}:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>{t("room_price")}:</Text>
              <Text>{formatMoney(bookingData.totalPrice)}</Text>
            </View>

            {selectedVoucher && (
              <View style={styles.jusBetween}>
                <Text style={[styles.value, styles.discountText]}>
                  {t("discount")}:
                </Text>
                <Text style={styles.discountText}>
                  - {formatMoney(discountAmount)}
                </Text>
              </View>
            )}

            <View style={[styles.jusBetween, styles.totalRow]}>
              <Text style={styles.totalText}>{t("total_amount")}:</Text>
              <Text style={styles.totalAmount}>{formatMoney(finalTotal)}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <View>
          <Text>{t("total")}</Text>
          <Text style={styles.totalAmount}>{formatMoney(finalTotal)}</Text>
        </View>
        <CustomButton
          onPress={handleConfirm}
          style={{ width: "40%" }}
          title={t("book_now")}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 5,
    elevation: 3,
  },
  jusBetween: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#222",
  },
  discountText: {
    color: "#e63946",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    padding: 20,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 15,
  },
});
