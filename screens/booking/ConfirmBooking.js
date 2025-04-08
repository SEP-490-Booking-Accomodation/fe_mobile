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
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import CustomButton from "../../components/buttons/Button";
import PaymentConfirm from "./components/PaymentConfirm";
import { useCreateBookingMutation } from "../../api/bookingApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useGetCustomerByUserIdQuery } from "../../api/authApi";
import CouponSelector from "./components/CouponSelector";
import { useGetPolicyHashTagQuery } from "../../api/policySystemApi";

export default function ConfirmBooking() {
  const authData = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const { data: customerData } = useGetCustomerByUserIdQuery(authData.userId);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const { data: policyDataLoiNhuan } = useGetPolicyHashTagQuery("loinhuan");
  const [createBooking] = useCreateBookingMutation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params || {};
  const [phiDuyTri, setPhiDuyTri] = useState(0);

  const loinhuan = policyDataLoiNhuan?.data?.[0];
  const loinhuanbandau = loinhuan?.values?.[0];
  console.log(loinhuanbandau);

  useEffect(() => {
    if (bookingData) {
      calculateTotal();
    }
  }, [bookingData, selectedVoucher, loinhuanbandau]);

  useEffect(() => {
    if (
      bookingData?.totalPrice &&
      loinhuanbandau?.val1 &&
      loinhuanbandau?.unit == "percent"
    ) {
      const fee =
        (bookingData.totalPrice * parseFloat(loinhuanbandau.val1)) / 100;
      setPhiDuyTri(fee);
    } else if (
      bookingData?.totalPrice &&
      loinhuanbandau?.val1 &&
      loinhuanbandau?.unit == "vnd"
    ) {
      const fee = loinhuanbandau.val1;

      setPhiDuyTri(fee);
    }
  }, [bookingData, loinhuanbandau]);
  console.log(phiDuyTri);

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
        // Fixed discount
        discount = selectedVoucher?.amount;

        // Make sure discount doesn't exceed the total
        if (discount > originalTotal) {
          discount = originalTotal;
        }
      }
    }

    const priceAfterDiscount = originalTotal - discount;
    let fee = 0;
    if (loinhuanbandau?.val1 && loinhuanbandau.unit == "percent") {
      fee = (priceAfterDiscount * parseFloat(loinhuanbandau.val1)) / 100;
      setPhiDuyTri(fee);
    } else if (loinhuanbandau?.val1 && loinhuanbandau.unit == "vnd") {
      fee = parseFloat(loinhuanbandau.val1);
      setPhiDuyTri(fee);
    }
    setDiscountAmount(discount);
    setFinalTotal(priceAfterDiscount + fee);
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Không có dữ liệu đặt phòng</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Quay lại</Text>
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

  const handleConfirm = async () => {
    const formBooking = {
      policySystemIds: bookingData.policySystemIds || [
        "67ebf15d828b69a4d279d960",
      ],
      customerId: customerData.id,
      accommodationTypeId: typeRoom.id,
      couponId: selectedVoucher?.id || null,
      feedbackId: null,
      basePrice: typeRoom.basePrice,
      overtimeHourlyPrice: typeRoom.overtimeHourlyPrice,
      checkInHour: checkInDateTime,
      checkOutHour: checkOutDateTime,
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
      discountAmount: discountAmount, // Add discount amount to the booking data
      finalTotal: finalTotal, // Add final total after discount
    };

    try {
      const response = await createBooking({
        data: formBooking,
      }).unwrap();

      navigation.navigate("BookingDetail", {
        bookingData: {
          ...bookingData,
          discountAmount,
          finalTotal,
        },
        bookingId: response.booking.id,
      });
    } catch (error) {
      Alert.alert(
        "Failed",
        error.data?.message || "Đặt phòng thất bại, vui lòng thử lại sau"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Xác nhận Đặt phòng</Text>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Địa điểm:</Text>
            <Text style={{ fontSize: 18 }}>{rentalData.name}</Text>
            <View>
              <Text style={styles.value}>{address}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Loại phòng:</Text>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              {typeRoom?.name ?? "Không có thông tin"}
            </Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Giá giờ đầu: </Text>
              <Text>{formatMoney(typeRoom?.basePrice)}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Giá giờ tiếp theo: </Text>
              <Text>{formatMoney(typeRoom?.overtimeHourlyPrice)}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Tổng thời gian: </Text>
              <Text>{bookingData?.duration}h</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Thời gian thuê:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Ngày: </Text>
              <Text>{bookingData?.date}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Thời gian:</Text>
              <Text>
                {bookingData?.time} - {bookingData?.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Số khách:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Người lớn:</Text>
              <Text>{bookingData?.guests?.adults}</Text>
            </View>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Trẻ em:</Text>
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
            <Text style={styles.label}>Tổng thanh toán:</Text>
            <View style={styles.jusBetween}>
              <Text style={styles.value}>Đơn giá phòng:</Text>
              <Text>{formatMoney(bookingData.totalPrice)}</Text>
            </View>

            {selectedVoucher && (
              <View style={styles.jusBetween}>
                <Text style={[styles.value, styles.discountText]}>
                  Giảm giá:
                </Text>
                <Text style={styles.discountText}>
                  - {formatMoney(discountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.jusBetween}>
              {loinhuanbandau?.unit == "percent" ? (
                <Text style={styles.value}>
                  Phí duy trì ({loinhuanbandau.val1}%)
                </Text>
              ) : loinhuanbandau?.unit == "vnd" ? (
                <Text style={styles.value}>
                  Phí duy trì ({loinhuanbandau.val1} VND)
                </Text>
              ) : null}
              <Text>{formatMoney(phiDuyTri)}</Text>
            </View>

            <View style={[styles.jusBetween, styles.totalRow]}>
              <Text style={styles.totalText}>Thành tiền:</Text>
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
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View>
          <Text>Tổng</Text>
          <Text style={styles.totalAmount}>{formatMoney(finalTotal)}</Text>
        </View>
        <CustomButton
          onPress={handleConfirm}
          style={{ width: "40%" }}
          title="Thanh toán"
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
