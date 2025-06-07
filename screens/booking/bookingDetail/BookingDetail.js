import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import { useState } from "react";
import dayjs from "dayjs";

import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "../../../api/bookingApi";
import { useProcessMomoPaymentMutation } from "../../../api/momoPayment";
import { useCreateNotificationMutation } from "../../../api/notificationApi";
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
import { formatMoney, getPaymentMethodText } from "../../../utils/formatters";
import { useProcessPayOSPaymentMutation } from "../../../api/payOSPayment";

export default function BookingDetail() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [createNotification] = useCreateNotificationMutation();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const {
    data: bookingData,
    isLoading,
    refetch,
  } = useGetBookingByIdQuery(bookingId);
  console.log(bookingData);

  const [processMomoPayment] = useProcessMomoPaymentMutation();
  const [processPayOSPayment] = useProcessPayOSPaymentMutation();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handlePayment = async () => {
    setIsLoadingBtn(true);

    if (!bookingData) return;
    const totalPrice =
      bookingData.basePrice +
      (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;
    const devUrl = `exp://${Constants.expoConfig.hostUri}/--/payment/callback?status=success&orderId=${bookingData.id}`;
    const prodUrl = `mean://payment/callback?status=success&orderId=${bookingData.id}`;
    const returnUrl = process.env.NODE_ENV === "development" ? devUrl : prodUrl;

    const description = t("payment_description", {
      id: bookingData.id,
      price: totalPrice,
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
            setIsLoadingBtn(false);
          }, 3000);
        } else {
          Alert.alert(t("error"), t("payment_create_failed"));
          setIsLoadingBtn(false);
        }
      } catch (error) {
        Alert.alert(t("error"), t("payment_failed"));
        // setIsLoadingBtn(false);
      } finally {
        // setIsLoadingBtn(false);
      }
    } else if (bookingData.paymentMethod === 2) {
      const data = {
        bookingId: bookingData.id,
        amount: 2000,
        description: bookingData.id,
        successRedirectUrl: returnUrl,
        failRedirectUrl: returnUrl,
        // returnUrlFE: returnUrl,
        orderIdFE: new Date().getTime(),
      };
      console.log(data);

      try {
        const response = await processPayOSPayment({
          data: data,
        }).unwrap();
        // console.log(response);

        if (response.payUrl) {
          Linking.openURL(response.payUrl);
          setTimeout(() => {
            refetch();
            setIsLoadingBtn(false);
          }, 3000);
        } else {
          // Alert.alert(t("error"), t("payment_create_failed"));
          // setIsLoadingBtn(false);
          console.error("Payment URL not found in response", response);
        }
      } catch (error) {
        Alert.alert(t("error"), t("payment_failed"));
        console.error("Payment error:", error);
        // setIsLoadingBtn(false);
      } finally {
        // setIsLoadingBtn(false);
      }
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    return dayjs(dateTimeStr, "DD/MM/YYYY HH:mm:ss").format(
      "DD/MM/YYYY [lúc] HH:mm"
    );
  };

  const getCurrentDateTime = () => {
    return dayjs().format("DD/MM/YYYY [lúc] HH:mm");
  };

  const handleCancel = () => {
    // Check if refund is available
    const isPaid = bookingData?.paymentStatus === PAYMENT_STATUS.PAID;
    const refundDeadline = bookingData?.timeExpireRefund;
    const now = dayjs();
    const isRefundAvailable =
      refundDeadline &&
      now.isBefore(dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss"));

    let title = t("cancel_confirmation_title");
    let message = t("cancel_confirmation_message");

    if (isPaid && refundDeadline) {
      const formattedTime = (() => {
        try {
          const deadline = dayjs(refundDeadline, "DD/MM/YYYY HH:mm:ss");
          return deadline.isValid()
            ? deadline.format("HH:mm DD/MM/YYYY")
            : refundDeadline;
        } catch {
          return refundDeadline;
        }
      })();

      if (isRefundAvailable) {
        title = t("refund_cancel_title");
        message = t("refund_cancel_message", { time: formattedTime });
      } else {
        title = t("refund_overdue_title");
        message = t("refund_overdue_message", { time: formattedTime });
      }
    }

    Alert.alert(title, message, [
      { text: t("no"), style: "cancel" },
      {
        text: isRefundAvailable ? t("yes") : t("cancel_anyway"),
        onPress: async () => {
          try {
            const updatedBookingData = {
              ...bookingData,
              status: BOOKING_STATUS.CANCELLED,
              paymentStatus:
                isPaid && isRefundAvailable
                  ? PAYMENT_STATUS.REFUND
                  : bookingData.paymentStatus,
            };

            await updateBooking({
              id: bookingId,
              data: updatedBookingData,
            }).unwrap();

            // Create notification based on cancellation type
            try {
              let notificationData = {
                userId:
                  bookingData?.accommodationId?.rentalLocationId?.ownerId
                    ?.userId?._id,
                bookingId: bookingId,
                isRead: false,
                type: 1,
              };

              const currentDateTime = getCurrentDateTime();
              const bookingDateTime = formatDateTime(bookingData?.checkInHour);

              if (isPaid && isRefundAvailable) {
                notificationData = {
                  ...notificationData,
                  title: t("customer_cancelled_with_refund_request"),
                  content: `${t("booking_cancelled_with_refund_request_for")} ${
                    bookingData?.accommodationId?.rentalLocationId?.name
                  } ${t("for_date")} ${bookingDateTime}. ${t(
                    "cancelled_at"
                  )} ${currentDateTime}. ${t(
                    "requested_refund_amount"
                  )}: ${formatMoney(bookingData?.totalPrice)}`,
                };
              } else {
                notificationData = {
                  ...notificationData,
                  title: t("booking_cancelled"),
                  content: `${t("booking_cancelled_for")} ${
                    bookingData?.accommodationId?.rentalLocationId?.name
                  } ${t("for_date")} ${bookingDateTime}. ${t(
                    "cancelled_at"
                  )} ${currentDateTime}`,
                };
              }

              await createNotification(notificationData).unwrap();
            } catch (error) {}

            Alert.alert(
              t("success"),
              isRefundAvailable
                ? t("cancel_refund_success")
                : t("cancel_success"),
              [{ text: "OK", onPress: () => refetch() }]
            );
          } catch (error) {
            Alert.alert(t("error"), error.data?.message || t("cancel_failed"));
          }
        },
      },
    ]);
  };

  const handleViewTicketDetail = () => {
    navigation.navigate("TicketDetail", {
      bookingId: bookingData.id,
    });
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const updatedBookingData = {
        ...bookingData,
        status: BOOKING_STATUS.CHECKEDIN,
      };

      await updateBooking({
        id: bookingId,
        data: updatedBookingData,
      }).unwrap();

      try {
        const currentDateTime = getCurrentDateTime();
        const bookingDateTime = formatDateTime(bookingData?.checkInHour);
        await createNotification({
          userId:
            bookingData?.accommodationId?.rentalLocationId?.ownerId?.userId
              ?._id,
          bookingId: bookingId,
          title: t("customer_checked_in"),
          content: `${t("customer_checked_in_for")} ${
            bookingData?.accommodationId?.rentalLocationId?.name
          } ${t("for_date")} ${bookingDateTime}. ${t(
            "checked_in_at"
          )} ${currentDateTime}`,
          isRead: false,
          type: 1,
        }).unwrap();
      } catch (error) {}

      Alert.alert(t("success"), t("check_in_success"), [
        { text: "OK", onPress: () => refetch() },
      ]);
    } catch (error) {
      Alert.alert(t("error"), error.data?.message || t("check_in_failed"));
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    // Check if current time is before checkout time
    const currentTime = new Date();
    const checkOutTime = bookingData.checkOutHour
      ? new Date(bookingData.checkOutHour)
      : null;

    // If checkout time exists and current time is before checkout time
    if (checkOutTime && currentTime < checkOutTime) {
      // Calculate remaining time
      const remainingMs = checkOutTime.getTime() - currentTime.getTime();
      const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
      const remainingHours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;

      // Format remaining time message
      let timeMessage = "";
      if (remainingHours > 0) {
        timeMessage = `${remainingHours} ${
          remainingHours === 1 ? t("hour") : t("hours")
        }`;
        if (mins > 0) {
          timeMessage += ` ${mins} ${mins === 1 ? t("minute") : t("minutes")}`;
        }
      } else {
        timeMessage = `${mins} ${mins === 1 ? t("minute") : t("minutes")}`;
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
        { cancelable: true }
      );
    } else {
      // If current time is after checkout time or checkout time doesn't exist, proceed directly
      performCheckout();
    }
  };

  // Extracted the actual checkout logic to a separate function
  const performCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const updatedBookingData = {
        ...bookingData,
        status: BOOKING_STATUS.CHECKEDOUT,
      };

      await updateBooking({
        id: bookingId,
        data: updatedBookingData,
      }).unwrap();

      try {
        const currentDateTime = getCurrentDateTime();
        const bookingDateTime = formatDateTime(bookingData?.checkOutHour);
        await createNotification({
          userId:
            bookingData?.accommodationId?.rentalLocationId?.ownerId?.userId
              ?._id,
          bookingId: bookingId,
          title: t("customer_checked_out"),
          content: `${t("customer_checked_out_for")} ${
            bookingData?.accommodationId?.rentalLocationId?.name
          } ${t("for_date")} ${bookingDateTime}. ${t(
            "checked_out_at"
          )} ${currentDateTime}`,
          isRead: false,
          type: 1,
        }).unwrap();
      } catch (error) {}

      Alert.alert(t("success"), t("check_out_success"), [
        { text: "OK", onPress: () => refetch() },
      ]);
    } catch (error) {
      Alert.alert(t("error"), error.data?.message || t("check_out_failed"));
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!bookingData) {
    return <EmptyState onGoBack={() => navigation.goBack()} />;
  }

  const rentalData = bookingData?.accommodationId?.rentalLocationId;
  const typeRoom = bookingData?.accommodationId?.accommodationTypeId;
  const password = bookingData?.passwordRoom;
  const bId = bookingData?.id;
  const rentalName = rentalData?.name;
  const accommodationType =
    bookingData?.accommodationId?.accommodationTypeId?.name || "";
  const roomNo = bookingData?.accommodationId?.roomNo || "";
  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader
        bookingId={bId}
        rentalName={rentalName}
        accommodationType={accommodationType}
        roomNo={roomNo}
      />

      <BookingStatusBar
        status={bookingData.status}
        paymentStatus={bookingData.paymentStatus}
        note={bookingData.note}
        style={styles.statusBar}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {typeRoom.image && typeRoom.image.length > 0 && (
          <BookingImage
            imageUrl={typeRoom.image[0]}
            style={styles.bookingImage}
          />
        )}

        <View style={styles.infoSection}>
          <LocationInfo rentalData={rentalData} />
          <RoomTypeInfo typeRoom={typeRoom} password={password} />
          <TimeInfo bookingData={bookingData} />
          <GuestsInfo
            adultNumber={bookingData.adultNumber}
            childNumber={bookingData.childNumber}
          />
          <NoteInfo note={bookingData.note} />
          <PaymentInfo bookingData={bookingData} />
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  bookingImage: {
    marginBottom: 12,
  },
  infoSection: {
    gap: 12,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBar: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
