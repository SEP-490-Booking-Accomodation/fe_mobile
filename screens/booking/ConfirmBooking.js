import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import CustomButton from "../../components/buttons/Button";
import { Entypo } from "@expo/vector-icons";

export default function ConfirmBooking() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params || {};

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có ngày";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
  console.log(bookingData);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Xác nhận Đặt phòng</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Địa điểm:</Text>
          <Text style={{ fontSize: 18 }}>{rentalData.name}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Entypo name="location-pin" size={24} color="black" />
            <Text style={styles.value}> {address}</Text>
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
      </KeyboardAvoidingView>

      <View style={styles.cardTotal}>
        <Text style={styles.totalLabel}>Thành tiền:</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalValue}>
            {formatMoney(bookingData?.totalPrice ?? 0)}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <CustomButton style={{ width: "60%" }} title="Xác nhận" />
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 10,
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
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 16,
    fontWeight: 400,
    marginRight: 30,
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
