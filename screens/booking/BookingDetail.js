import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Bed,
  CreditCard,
} from "lucide-react-native";
import CustomButton from "../../components/buttons/Button";
import dayjs from "dayjs";
import { useGetBookingByIdQuery } from "../../api/bookingApi";
import { useProcessMomoPaymentMutation } from "../../api/momoPayment";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function BookingDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params || {};
  const {
    data: bookingData,
    isLoading,
    refetch,
  } = useGetBookingByIdQuery(bookingId);
  const [processMomoPayment] = useProcessMomoPaymentMutation();
  // console.log(bookingData);

  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch API mỗi khi quay lại màn hình
    }, [refetch])
  );

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getStatusText = (status) => {
    const statusMap = {
      1: "Xác nhận",
      2: "Cần Check-in",
      3: "Check-in",
      4: "Cần Check-out",
      5: "Check-out",
      6: "Đã hủy",
      7: "Hoàn thành",
      8: "Chờ",
    };

    return statusMap[status] || "Không xác định";
  };

  const getPaymentMethodText = (method) => {
    const methodMap = {
      1: "Ví Mean",
      2: "Momo",
      3: "Test",
    };
    return methodMap[method] || "Không xác định";
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      1: "Chờ thanh toán",
      2: "Chờ thanh toán",
      3: "Đã thanh toán",
      4: "Hoàn tiền",
      5: "Thất bại",
    };

    return statusMap[status] || "Không xác định";
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    const totalPrice =
      bookingData.basePrice +
      (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;

    // Định nghĩa URL ở đây, trong hàm handlePayment nơi chắc chắn bookingData đã tồn tại
    const devUrl = `exp://${Constants.expoConfig.hostUri}/--/payment/callback?status=success&orderId=${bookingData.id}`;
    const prodUrl = `mean://payment/callback?status=success&orderId=${bookingData.id}`;
    const returnUrl = __DEV__ ? devUrl : prodUrl;

    const paymentMethod = bookingData.paymentMethod;
    if (paymentMethod === "1") {
      //   navigation.navigate("BankTransfer", {
      //     bookingId: bookingData.id,
      //     amount: bookingData.basePrice * bookingData.durationBookingHour,
      //   });
      Alert.alert("Ví Mean");
    } else if (paymentMethod === "2") {
      try {
        const response = await processMomoPayment({
          data: {
            bookingId: bookingData.id,
            amount: totalPrice,
            description: `Thanh toán đặt phòng ${bookingData.id} qua Momo ${totalPrice}`,
            returnUrlFE: returnUrl,
            // orderIdFE: "MOMO " + bookingData.id + " " + new Date().getTime(), // Thêm timestamp để tránh trùng lặp
            orderIdFE: "MOMO " + new Date().getTime(), // Thêm timestamp để tránh trùng lặp
          },
        }).unwrap();

        if (response.payUrl) {
          Linking.openURL(response.deeplink);

          setTimeout(() => {
            refetch();
          }, 3000);
        } else {
          Alert.alert("Lỗi", "Không thể tạo thanh toán Momo");
        }
      } catch (error) {
        console.error("Thanh toán thất bại:", error);
        Alert.alert("Lỗi", "Thanh toán Momo thất bại");
      }
    } else if (paymentMethod === "3") {
      //   navigation.navigate("ZaloPayment", {
      //     bookingId: bookingData.id,
      //     amount: bookingData.basePrice * bookingData.durationBookingHour,
      //   });>
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Không có dữ liệu đặt phòng</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const rentalData = bookingData.accommodationId.rentalLocationId;
  const typeRoom = bookingData.accommodationId.accommodationTypeId;
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;
  const totalPrice =
    bookingData.basePrice +
    (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Chi tiết đặt phòng</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Trạng thái:
          <Text style={styles.statusValue}>
            {getStatusText(bookingData.status)}
          </Text>
        </Text>
        <Text style={styles.statusText}>
          Thanh toán:
          <Text style={styles.statusValue}>
            {bookingData.paymentStatus}
            {getPaymentStatusText(bookingData.paymentStatus)}
          </Text>
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
            <MapPin size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>Địa điểm</Text>
          </View>
          <Text style={styles.value}>{rentalData.name}</Text>
          <Text style={styles.valueSecondary}>{address}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Bed size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>Loại phòng</Text>
          </View>
          <Text style={styles.value}>
            {typeRoom?.name ?? "Không có thông tin"}
          </Text>
          <Text style={styles.valueSecondary}>
            {typeRoom?.description ?? ""}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>Thời gian thuê</Text>
          </View>
          {/* <Text style={styles.value}>Ngày: {bookingData.checkInHour}</Text> */}
          <Text style={styles.value}>Check-in: {bookingData.checkInHour}</Text>
          <Text style={styles.value}>
            Check-out: {bookingData.checkOutHour}
          </Text>
          <Text style={styles.value}>
            Thời gian thuê: {bookingData.durationBookingHour} giờ
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>Số khách</Text>
          </View>
          <Text style={styles.value}>Người lớn: {bookingData.adultNumber}</Text>
          <Text style={styles.value}>Trẻ em: {bookingData.childNumber}</Text>
        </View>

        {bookingData.note && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Ghi chú</Text>
            </View>
            <Text style={styles.value}>{bookingData.note}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CreditCard size={20} color="#ff385c" />
            <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Phương thức:</Text>
            <Text style={styles.paymentValue}>
              {getPaymentMethodText(bookingData.paymentMethod)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Giá giờ đầu:</Text>
            <Text style={styles.paymentValue}>
              {formatMoney(bookingData.basePrice)} / giờ
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Giá giờ sau:</Text>
            <Text style={styles.paymentValue}>
              {formatMoney(bookingData.overtimeHourlyPrice)} / giờ
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Số giờ thuê:</Text>
            <Text style={styles.paymentValue}>
              {bookingData.durationBookingHour} giờ
            </Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{formatMoney(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {bookingData.paymentStatus === 2 ? (
          <CustomButton
            title="Thanh toán ngay"
            onPress={handlePayment}
            style={styles.payButton}
            textStyle={styles.payButtonText}
          />
        ) : (
          <CustomButton
            title="Về trang chủ"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            }
            style={styles.homeButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
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
  payButton: {
    backgroundColor: "#ff385c",
    height: 50,
    borderRadius: 12,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
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
});
