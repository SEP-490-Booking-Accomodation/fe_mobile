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
  Linking,
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

import { useGetAllPolicySystemsByCategoryQuery } from "../../api/policySystemApi";
import { useCreateNotificationMutation } from "../../api/notificationApi";

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
  const [createNotification] = useCreateNotificationMutation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const values = getTimeRefundData?.data?.[0]?.values || [];
  let refundMinutes = values[0]?.val || 20; // mặc định nếu không có
  const bookingTime = dayjs(); // thời điểm tạo booking
  const refundDeadline = bookingTime.add(refundMinutes, "minute");
  // const refundDeadlineISO = refundDeadline.toISOString();
  const date = new Date(refundDeadline);
  const { data: policyData } = useGetAllPolicySystemsByCategoryQuery("System");

  const policySystemIds = policyData?.map((item) => item.id);

  // Hàm định dạng số thành 2 chữ số
  const pad = (n) => n.toString().padStart(2, "0");

  // Tạo chuỗi định dạng dd-MM-yyyy HH:mm:ss
  const deadlineFormatted = `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;

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
  const checkOutDateTime = `${bookingData.endDate} ${bookingData.endTime}:00`;

  const handleConfirm = async () => {
    setIsLoading(true);

    const formBooking = {
      policySystemIds: policySystemIds,
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
      timeExpireRefund: deadlineFormatted,
      totalPrice: finalTotal,
    };

    try {
      const response = await createBooking({
        data: formBooking,
      }).unwrap();

      try {
        await createNotification({
          userId: customerData.id,
          bookingId: response.booking.id,
          title: t("booking_success"),
          content: `${t("booking_confirmed_for")} ${rentalData.name} ${t(
            "on"
          )} ${bookingData.date} ${t("at")} ${bookingData.time}`,
          isRead: false,
          type: 1,
        }).unwrap();
      } catch (notificationError) {}

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
      Alert.alert(t("failed"), error.data?.message || t("booking_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t("confirm_booking_title")}</Text>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Location Section - exact match with LocationInfo.js */}
          <View style={styles.card}>
            <Text style={styles.label}>
              <AntDesign name="enviromento" size={20} color="#4E72E3" style={{ marginRight: 8 }} />
              {t("location")}
            </Text>
            <TouchableOpacity style={styles.locationContainer} onPress={handleOpenMap}>
              <View style={styles.contentContainer}>
                <View style={styles.mainInfo}>
                  <Text style={styles.name}>{rentalData.name}</Text>
                  <Text style={styles.address} numberOfLines={2}>
                    {address}
                  </Text>
                </View>
                <View>
                  <AntDesign name="right" size={16} color="#4E72E3" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Room Type Section - exact match with RoomTypeInfo.js */}
          <View style={styles.card}>
            <Text style={styles.label}>
              <AntDesign name="home" size={20} color="#4E72E3" style={{ marginRight: 8 }} />
              {t("room_type")}
            </Text>
            <View style={styles.roomContainer}>
              <Text style={styles.roomName}>
                {typeRoom?.name ?? t("no_info")}
              </Text>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{t("base_price_text")}</Text>
                <Text style={styles.timeValue}>{formatMoney(typeRoom?.basePrice)}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{t("overtime_price")}</Text>
                <Text style={styles.timeValue}>{formatMoney(typeRoom?.overtimeHourlyPrice)}</Text>
              </View>
              <View style={[styles.timeRow, styles.durationRow]}>
                <Text style={styles.timeLabel}>{t("total_duration")}</Text>
                <Text style={styles.timeValue}>
                  {bookingData?.duration} {t("h")}
                </Text>
              </View>
            </View>
          </View>

          {/* Time Section - exact match with TimeInfo.js */}
          <View style={styles.card}>
            <Text style={styles.label}>
              <AntDesign name="clockcircle" size={20} color="#4E72E3" style={{ marginRight: 8 }} />
              {t("rental_time")}
            </Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{t("check_in")}:</Text>
                <Text style={styles.timeValue}>{bookingData?.date} {bookingData?.time}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{t("check_out")}:</Text>
                <Text style={styles.timeValue}>
                  {bookingData?.endDate} {bookingData?.endTime}
                </Text>
              </View>
              <View style={[styles.timeRow, styles.durationRow]}>
                <Text style={styles.timeLabel}>{t("rental_duration")}:</Text>
                <Text style={styles.timeValue}>
                  {bookingData?.duration} {t("hours_text")}
                </Text>
              </View>
            </View>
          </View>

          {/* Guests Section - exact match with GuestsInfo.js */}
          <View style={styles.card}>
            <Text style={styles.label}>
              <AntDesign name="team" size={20} color="#4E72E3" style={{ marginRight: 8 }} />
              {t("guests")}
            </Text>
            <View style={styles.guestsContainer}>
              <View style={styles.guestRow}>
                <View style={styles.guestType}>
                  <View style={styles.iconContainer}>
                    <AntDesign name="user" size={16} color="#4E72E3" />
                  </View>
                  <Text style={styles.guestLabel}>{t("adults")}</Text>
                </View>
                <Text style={styles.guestCount}>{bookingData?.guests?.adults}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.guestRow}>
                <View style={styles.guestType}>
                  <View style={styles.iconContainer}>
                    <AntDesign name="user" size={14} color="#4E72E3" />
                  </View>
                  <Text style={styles.guestLabel}>{t("children")}</Text>
                </View>
                <Text style={styles.guestCount}>{bookingData?.guests?.children}</Text>
              </View>
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

          {/* Payment Summary Section */}
          <View style={styles.card}>
            <Text style={styles.label}>{t("payment_summary")}</Text>
            <View style={styles.timeContainer}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>{t("room_price")}</Text>
                <Text style={styles.timeValue}>{formatMoney(bookingData.totalPrice)}</Text>
              </View>

              {selectedVoucher && (
                <View style={styles.timeRow}>
                  <Text style={[styles.timeLabel, { color: "#e63946" }]}>
                    {t("discount")}
                  </Text>
                  <Text style={{ color: "#e63946", fontSize: 14, fontWeight: "600" }}>
                    - {formatMoney(discountAmount)}
                  </Text>
                </View>
              )}

              <View style={[styles.timeRow, styles.durationRow]}>
                <Text style={[styles.timeLabel, { fontSize: 15, fontWeight: "600" }]}>
                  {t("total_amount")}
                </Text>
                <Text style={styles.totalAmount}>{formatMoney(finalTotal)}</Text>
              </View>
            </View>

            {finalTotal <= 10000 && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  {t("minimum_payment_warning")}
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="#4E72E3" />
        </TouchableOpacity>
        <View>
          <Text>{t("total")}</Text>
          <Text style={styles.totalAmount}>{formatMoney(finalTotal)}</Text>
        </View>
        <CustomButton
          onPress={handleConfirm}
          style={{ width: "40%" }}
          title={t("book_now")}
          disabled={isLoading || finalTotal <= 10000}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  // Location styles - exact match with LocationInfo.js
  locationContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  address: {
    color: "#718096",
    fontSize: 14,
    lineHeight: 20,
  },
  // Room type styles - exact match with RoomTypeInfo.js
  roomContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roomName: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "#718096",
    fontSize: 14,
    lineHeight: 20,
  },
  // Time styles - exact match with TimeInfo.js
  timeContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  timeLabel: {
    color: "#718096",
    fontSize: 14,
    fontWeight: "500",
  },
  timeValue: {
    color: "#2D3748",
    fontSize: 14,
    fontWeight: "600",
  },
  durationRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  // Guests styles - exact match with GuestsInfo.js
  guestsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  guestType: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F7FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  guestLabel: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "500",
  },
  guestCount: {
    color: "#4E72E3",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#EDF2F7",
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
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffeaa7",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
