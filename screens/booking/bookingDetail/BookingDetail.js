import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Constants from "expo-constants";

import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "../../../api/bookingApi";
import { useProcessMomoPaymentMutation } from "../../../api/momoPayment";
import { BOOKING_STATUS } from "./Constants";

import BookingHeader from "./BookingHeader";
import BookingStatusBar from "./BookingStatusBar";
import BookingImage from "./BookingImage";
import LocationInfo from "./LocationInfo";
import RoomTypeInfo from "./RoomTypeInfo";
import TimeInfo from "./TimeInfo";
import GuestsInfo from "./GuestsInfo";
import NoteInfo from "./NoteInfo";
import PaymentInfo from "./PaymentInfo";
import BookingFooter from "./BookingFooter";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

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
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handlePayment = async () => {
    if (!bookingData) return;
    const totalPrice =
      bookingData.basePrice +
      (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;
    const devUrl = `exp://${Constants.expoConfig.hostUri}/--/payment/callback?status=success&orderId=${bookingData.id}`;
    const prodUrl = `mean://payment/callback?status=success&orderId=${bookingData.id}`;
    const returnUrl = process.env.NODE_ENV === "development" ? devUrl : prodUrl;

    if (bookingData.paymentMethod === 1) {
      try {
        const response = await processMomoPayment({
          data: {
            bookingId: bookingData.id,
            amount: totalPrice,
            description: `Thanh toán đặt phòng ${bookingData.id} qua Momo ${totalPrice}`,
            returnUrlFE: returnUrl,
            orderIdFE: "MOMO" + new Date().getTime(),
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
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Xác nhận hủy đặt phòng",
      "Bạn có chắc chắn muốn hủy đặt phòng này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có, hủy đặt phòng",
          onPress: async () => {
            try {
              const updatedBookingData = {
                ...bookingData,
                status: BOOKING_STATUS.CANCELLED,
              };
              await updateBooking({
                id: bookingId,
                data: updatedBookingData,
              }).unwrap();
              Alert.alert("Thành công", "Đã hủy đặt phòng thành công", [
                { text: "OK", onPress: () => refetch() },
              ]);
            } catch (error) {
              console.error("Error cancelling booking:", error);
              Alert.alert(
                "Lỗi",
                error.data?.message ||
                  "Không thể hủy đặt phòng. Vui lòng thử lại sau."
              );
            }
          },
        },
      ]
    );
  };

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: { index: 0, routes: [{ name: "HomeScreen" }] },
          },
        ],
      })
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!bookingData) {
    return <EmptyState onGoBack={() => navigation.goBack()} />;
  }

  const rentalData = bookingData.accommodationId.rentalLocationId;
  const typeRoom = bookingData.accommodationId.accommodationTypeId;

  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader navigation={navigation} />

      <BookingStatusBar
        status={bookingData.status}
        paymentStatus={bookingData.paymentStatus}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <BookingImage
          imageUrl={
            rentalData.image && rentalData.image.length > 0
              ? rentalData.image[0]
              : null
          }
        />

        <LocationInfo rentalData={rentalData} />
        <RoomTypeInfo typeRoom={typeRoom} />
        <TimeInfo bookingData={bookingData} />

        <GuestsInfo
          adultNumber={bookingData.adultNumber}
          childNumber={bookingData.childNumber}
        />

        <NoteInfo note={bookingData.note} />
        <PaymentInfo bookingData={bookingData} />
      </ScrollView>

      <BookingFooter
        bookingData={bookingData}
        onCancel={handleCancel}
        onPayment={handlePayment}
        onGoHome={handleGoHome}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  );
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
});
