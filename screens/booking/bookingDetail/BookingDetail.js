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
import { useTranslation } from 'react-i18next';

import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "../../../api/bookingApi";
import { useProcessMomoPaymentMutation } from "../../../api/momoPayment";
import { BOOKING_STATUS, PAYMENT_STATUS } from "./Constants";

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
import dayjs from "dayjs";

export default function BookingDetail() {
  const { t } = useTranslation();
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

    const description = t('payment_description', {
      id: bookingData.id,
      price: totalPrice
    });

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
        }).unwrap();

        if (response.payUrl) {
          Linking.openURL(response.deeplink);
          setTimeout(() => {
            refetch();
          }, 3000);
        } else {
          Alert.alert(t('error'), t('payment_create_failed'));
        }
      } catch (error) {
        console.error("Thanh toán thất bại:", error);
        Alert.alert(t('error'), t('payment_failed'));
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      t('cancel_confirmation_title'),
      t('cancel_confirmation_message'),
      [
        { text: t('no'), style: "cancel" },
        {
          text: t('yes_cancel_booking'),
          onPress: async () => {
            try {
              // Kiểm tra nếu hoàn tiền
              const isPaid = bookingData?.paymentStatus === PAYMENT_STATUS.PAID;
              const refundDeadline = bookingData?.timeExpireRefund;
              const now = dayjs();
              const isRefundAvailable =
                refundDeadline && now.isBefore(dayjs(refundDeadline));

              const updatedBookingData = {
                ...bookingData,
                status: BOOKING_STATUS.CANCELLED,

                paymentStatus:
                  isPaid && isRefundAvailable
                    ? PAYMENT_STATUS.REFUND
                    : BOOKING_STATUS.PAID,
              };

              await updateBooking({
                id: bookingId,
                data: updatedBookingData,
              }).unwrap();

              Alert.alert(
                t('success'),
                isRefundAvailable
                  ? t('cancel_refund_success')
                  : t('cancel_success'),
                [{ text: "OK", onPress: () => refetch() }]
              );
            } catch (error) {
              console.error("Error cancelling booking:", error);
              Alert.alert(
                t('error'),
                error.data?.message || t('cancel_failed')
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
      <BookingHeader />

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
