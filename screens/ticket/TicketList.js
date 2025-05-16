import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import CustomButton from "../../components/buttons/Button";
import CardInMyTicket from "../../components/cards/CardInMyTicket";
import { useSelector } from "react-redux";
import {
  useGetAllBookingByCustomerIdQuery,
  useUpdateBookingMutation,
} from "../../api/bookingApi";
import { useGetCustomerByUserIdQuery } from "../../api/authApi";
import ReviewModal from "./modals/ReviewModal";
import { useTranslation } from "react-i18next";
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
});
import { useCreateFeedbackMutation } from "../../api/feedbackApi";
import NotAuth from "../auth/NotAuth";

export default function TicketList() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState({ key: "all", value: "0" });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [localBookings, setLocalBookings] = useState([]);
  const imageTest =
    "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const authData = useSelector((state) => state.auth);
  const userAuth = useSelector((state) => state.auth?.userId);
  const parseCustomDate = (dateStr) => {
    const [day, month, yearAndTime] = dateStr.split("/");
    const [year, time] = yearAndTime.split(" ");
    return new Date(`${year}-${month}-${day}T${time}`);
  };
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const { data: customerData } = useGetCustomerByUserIdQuery(authData.userId);
  const [createFeedback] = useCreateFeedbackMutation();
  const {
    data: bookingData,
    isLoading,
    refetch,
  } = useGetAllBookingByCustomerIdQuery(customerData?.id);
  const mapStatusToFilterCategory = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.PENDING:
        return "upcoming";
      case BOOKING_STATUS.CHECKEDIN:
      case BOOKING_STATUS.NEEDCHECKIN:
      case BOOKING_STATUS.NEEDCHECKOUT:
        return "current";
      case BOOKING_STATUS.COMPLETED:
        return "completed";
      case BOOKING_STATUS.CANCELLED:
        return "cancelled";
      case BOOKING_STATUS.CHECKEDOUT:
        return "completed";
      default:
        return "upcoming";
    }
  };

  const mapStatusToUiCode = (status) => {
    if (status === BOOKING_STATUS.CANCELLED) {
      return "-1"; // Cancelled - Show "Đặt lại" button
    } else if (
      status === BOOKING_STATUS.PENDING ||
      status === BOOKING_STATUS.CONFIRMED ||
      status === BOOKING_STATUS.NEEDCHECKIN ||
      status === BOOKING_STATUS.CHECKEDIN ||
      status === BOOKING_STATUS.NEEDCHECKOUT
    ) {
      return "0"; // Current or Upcoming - Show "Hủy" + "Xem chi tiết" buttons
    } else if (
      status === BOOKING_STATUS.COMPLETED ||
      status === BOOKING_STATUS.CHECKEDOUT
    ) {
      return "1"; // Completed - Show "Đánh giá" button
    } else {
      return "0"; // Default
    }
  };

  // Function to convert booking data - defined BEFORE it's used
  const convertBookingsData = (bookings) => {
    return bookings.map((booking) => ({
      id: booking.id,
      imageUrl: booking.accommodationId.image[0] || imageTest,
      nameRoom: booking?.accommodationId?.accommodationTypeId.name,
      placeName: booking?.accommodationId?.rentalLocationId?.city,
      maxPeople: booking.adultNumber + booking.childNumber,
      price: booking.basePrice.toLocaleString("vi-VN") + " VND",
      dateCompleted: booking.checkOutHour,
      dateCheckin: booking.checkInHour,
      dateBooked: booking.createdAt,
      status: mapStatusToUiCode(booking.status),
      bookingStatus: mapStatusToFilterCategory(booking.status),
      paymentStatus: booking.paymentStatus,
      feedbackId: booking.feedbackId,
    }));
  };

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    if (bookingData?.bookings) {
      setLocalBookings(convertBookingsData(bookingData.bookings));
    }
  }, [bookingData]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error(t("data_refresh_error"), error);
    }
    setRefreshing(false);
  };

  const handleSubmitReview = async (reviewData) => {
    console.log("Submit review", reviewData);
    const requestData = {
      bookingId: reviewData.bookingId,
      content: reviewData.content,
      rating: reviewData.rating,
      replyBy: null,
      contentReply: null,
      isHidden: false,
      images: [],
    };

    try {
      const result = await createFeedback({ data: requestData });
      const updatedBookingData = {
        ...bookingData,
        status: BOOKING_STATUS.COMPLETED,
      };
      console.log("Updated booking data", updatedBookingData);

      await updateBooking({
        id: reviewData.bookingId,
        data: updatedBookingData,
      }).unwrap();
      setLocalBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === reviewData.bookingId
            ? { ...booking, feedbackId: result.data.id }
            : booking
        )
      );

      setReviewModalVisible(false);
      alert(t("review_submitted"));
      refetch();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const tabColors = {
    all: "#4E72E3",
    upcoming: "#F59E0B",
    current: "#10B981",
    cancelled: "#EF4444",
    completed: "#6366F1",
  };

  const convertedBookings =
    localBookings.length > 0
      ? localBookings
      : bookingData?.bookings
      ? convertBookingsData(bookingData.bookings)
      : [];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>{t("my_tickets")}</Text>
    </View>
  );

  const handleViewDetail = (id) => {
    console.log("View detail", id);
    //Navigate to details page
    navigation.navigate("BookingDetail", { bookingId: id });
    //navigation.navigate("TicketDetail", { bookingId: id });
  };

  const handleCancel = (id) => {
    console.log("Cancel booking", id);
    // Implement cancel logic
  };

  const handleReview = (id) => {
    console.log("Review booking", id);
    setSelectedBookingId(id);
    setReviewModalVisible(true);
  };

  const handleRebooking = (id) => {
    console.log("Rebooking", id);
    // Navigate to rebooking page
    // navigation.navigate("RebookingPage", { bookingId: id });
  };

  // Filter bookings based on active tab
  const filteredBookings =
    activeTab.value === "0"
      ? convertedBookings
      : convertedBookings.filter(
          (booking) => booking.bookingStatus === activeTab.key
        );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            colors={["#FF5733", "#33FF57", "#3357FF"]}
            tintColor="#3357FF"
            title={t("loading")}
            titleColor="#3357FF"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.navigationContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navigationBar}
          >
            {[
              { title: t("all"), key: "all", value: "0" },
              { title: t("upcoming"), key: "upcoming" },
              { title: t("current"), key: "current" },
              { title: t("cancelled"), key: "cancelled" },
              { title: t("completed"), key: "completed" },
            ].map((tab) => {
              const isActive = activeTab.key === tab.key;
              const bgColor = isActive ? tabColors[tab.key] : "#fff";
              const titleColor = isActive ? "#FFFFFF" : "#6B7280";
              const borderColor = isActive ? tabColors[tab.key] : "#E5E7EB";
              const fontWeight = isActive ? "bold" : "normal";

              return (
                <CustomButton
                  key={tab.key}
                  title={tab.title}
                  style={[
                    styles.buttonNav,
                    {
                      backgroundColor: bgColor,
                      borderWidth: 2,
                      borderColor: borderColor,
                    },
                  ]}
                  titleStyle={{ fontWeight }}
                  titleColor={titleColor}
                  onPress={() =>
                    setActiveTab({ key: tab.key, value: tab.value })
                  }
                />
              );
            })}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t("loading")}</Text>
            </View>
          ) : filteredBookings.length > 0 ? (
            [...filteredBookings]
              .sort((a, b) => {
                const parseCustomDate = (dateStr) => {
                  const [day, month, yearAndTime] = dateStr.split("/");
                  const [year, time] = yearAndTime.split(" ");
                  return new Date(`${year}-${month}-${day}T${time}`);
                };

                if (activeTab.key === "upcoming") {
                  return (
                    parseCustomDate(b.dateCheckin) -
                    parseCustomDate(a.dateCheckin)
                  );
                } else if (activeTab.key === "current") {
                  return (
                    parseCustomDate(b.dateCompleted) -
                    parseCustomDate(a.dateCompleted)
                  );
                } else {
                  return (
                    parseCustomDate(b.dateBooked) -
                    parseCustomDate(a.dateBooked)
                  );
                }
              })
              .map((booking) => (
                <View key={booking.id} style={styles.cardWrapper}>
                  <CardInMyTicket
                    imageUrl={{ uri: booking.imageUrl }}
                    nameRoom={booking.nameRoom}
                    placeName={booking.placeName}
                    maxPeople={booking.maxPeople}
                    price={booking.price}
                    dateCompleted={booking.dateCompleted}
                    status={booking.status}
                    feedbackId={booking.feedbackId}
                    onViewDetail={() => handleViewDetail(booking.id)}
                    onCancelAction={() => handleCancel(booking.id)}
                    onReviewAction={() => handleReview(booking.id)}
                    onRebookingAction={() => handleRebooking(booking.id)}
                  />
                </View>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t("no_bookings")}</Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        bookingId={selectedBookingId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  arrowBack: {
    marginRight: 10,
    color: "#4E72E3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
  },

  navigationContainer: {
    paddingVertical: 10,
  },
  navigationBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  buttonNav: {
    borderWidth: 1,
    borderColor: "#4E72E3",
    paddingVertical: 10,
    marginHorizontal: 5, // Tạo khoảng cách giữa các nút
  },
});
