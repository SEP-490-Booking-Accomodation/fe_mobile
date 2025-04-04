import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import CustomButton from "../../components/buttons/Button";
import { Entypo } from "@expo/vector-icons";
import PaymentConfirm from "./components/PaymentConfirm";
import { useCreateBookingMutation } from "../../api/bookingApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useGetCustomerByUserIdQuery } from "../../api/authApi";

export default function ConfirmBooking() {
  const authData = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState(1); // Add state for payment method
  const { data: customerData } = useGetCustomerByUserIdQuery(authData.userId);

  const [createBooking] = useCreateBookingMutation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params || {};
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
  const startDateFormat = dayjs(checkInHour).format("DD-MM-YYYY HH:mm:ss");
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
      // couponId: bookingData?.couponId||,
      couponId: null,
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
      passwordRoom: "", // Có thể cập nhật nếu cần
      note: bookingData.note || "",
      status: 8,
    };

    try {
      const response = await createBooking({
        data: formBooking,
      }).unwrap();

      // if (response) {
      //   if (paymentMethod === 1) {
      //     // Alert.alert("Chưa hỗ trợ");
      //   } else if (paymentMethod === 2) {
      //     // Alert.alert("Momo");
      //   } else if (paymentMethod === 3) {
      //     Alert.alert("Đi thẳng");
      //   }
      // }
      navigation.navigate("BookingDetail", {
        bookingData: bookingData,
        bookingId: response.booking.id,
      });

      // navigation.navigate("PaymentConfirm");
    } catch (error) {
      // console.error("Booking failed:", error);
      Alert.alert("Failed", error.data.message);
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
            <PaymentConfirm setPaymentMethod={setPaymentMethod} />
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
          <Text style={styles.totalAmount}>
            {formatMoney(bookingData.totalPrice)}
          </Text>
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
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
  },
  value: {
    fontSize: 16,
    fontWeight: 400,
    color: "#222",
    marginTop: 5,
  },
  cardTotal: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  backButton: {
    padding: 15,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    padding: 20,
    // backgroundColor: "#fff",
    // borderTopWidth: 1,
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
  currencySymbol: {
    fontSize: 16,
    color: "#666",
    marginRight: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
