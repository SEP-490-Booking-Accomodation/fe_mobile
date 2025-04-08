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
import { useGetAllBookingByCustomerIdQuery } from "../../api/bookingApi";
import { useGetCustomerByUserIdQuery } from "../../api/authApi";

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

export default function TicketList() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState({ key: "all", value: "0" });
  const imageTest =
    "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const authData = useSelector((state) => state.auth);
  const { data: customerData } = useGetCustomerByUserIdQuery(authData.userId);

  const {
    data: bookingData,
    isLoading,
    refetch,
  } = useGetAllBookingByCustomerIdQuery(customerData?.id);
  console.log(bookingData);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Lỗi tải lại dữ liệu:", error);
    }

    setRefreshing(false);
  };

  const mapStatusToFilterCategory = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.NEEDCHECKIN:
      case BOOKING_STATUS.PENDING:
        return "upcoming";
      case BOOKING_STATUS.CHECKEDIN:
      case BOOKING_STATUS.NEEDCHECKOUT:
        return "current";
      case BOOKING_STATUS.CHECKEDOUT:
      case BOOKING_STATUS.COMPLETED:
        return "completed";
      case BOOKING_STATUS.CANCELLED:
        return "cancelled";
      default:
        return "upcoming";
    }
  };

  // Function to map status to UI display status code
  const mapStatusToUiCode = (status) => {
    if (status === BOOKING_STATUS.CANCELLED) {
      return "-1"; // Review + View detail
    } else if (
      status === BOOKING_STATUS.PENDING ||
      status === BOOKING_STATUS.CONFIRMED ||
      status === BOOKING_STATUS.NEEDCHECKIN
    ) {
      return "0"; // Cancel + View detail
    } else {
      return "1"; // Only rebooking
    }
  };

  // Convert booking data to the format expected by CardInMyTicket
  const convertedBookings =
    bookingData?.bookings.map((booking) => ({
      id: booking.id,
      imageUrl: booking.accommodationId.image[0] || imageTest,
      nameRoom: booking?.accommodationId?.accommodationTypeId.name,
      placeName: booking?.accommodationId?.rentalLocationId?.city,
      // placeName: booking?.accommodationId?.rentalLocationId?.name,
      maxPeople: booking.adultNumber + booking.childNumber,
      price: booking.basePrice.toLocaleString("vi-VN") + " VND",
      dateCompleted: booking.checkOutHour,
      status: mapStatusToUiCode(booking.status),
      bookingStatus: mapStatusToFilterCategory(booking.status),
    })) || [];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Vé phòng của tôi</Text>
    </View>
  );

  const handleViewDetail = (id) => {
    console.log("View detail", id);
    // Navigate to details page
    navigation.navigate("BookingDetail", { bookingId: id });
  };

  const handleCancel = (id) => {
    console.log("Cancel booking", id);
    // Implement cancel logic
  };

  const handleReview = (id) => {
    console.log("Review booking", id);
    // Navigate to review page
    // navigation.navigate("ReviewBooking", { bookingId: id });
  };

  const handleRebooking = (id) => {
    console.log("Rebooking", id);
    // Navigate to rebooking page
    // navigation.navigate("RebookingPage", { bookingId: id });
  };

  // Filter bookings based on active tab
  const filteredBookings =
    activeTab.value === "0"
      ? convertedBookings // Nếu là "Tất cả", hiển thị toàn bộ
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
            title="Loading..."
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
              { title: "Tất cả", key: "all", value: "0" },
              { title: "Sắp tới", key: "upcoming" },
              { title: "Hiện tại", key: "current" },
              { title: "Đã hủy", key: "cancelled" },
              { title: "Hoàn tất", key: "completed" },
            ].map((tab) => (
              <CustomButton
                key={tab.key}
                title={tab.title}
                style={styles.buttonNav}
                backgroundColor={activeTab.key === tab.key ? "#4E72E3" : "#fff"}
                titleColor={activeTab.key === tab.key ? "#FFFFFF" : "#6B7280"}
                onPress={() => setActiveTab({ key: tab.key, value: tab.value })}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Đang tải...</Text>
            </View>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <View key={booking.id} style={styles.cardWrapper}>
                <CardInMyTicket
                  imageUrl={{ uri: booking.imageUrl }}
                  nameRoom={booking.nameRoom}
                  placeName={booking.placeName}
                  maxPeople={booking.maxPeople}
                  price={booking.price}
                  dateCompleted={booking.dateCompleted}
                  status={booking.status}
                  onViewDetail={() => handleViewDetail(booking.id)}
                  onCancelAction={() => handleCancel(booking.id)}
                  onReviewAction={() => handleReview(booking.id)}
                  onRebookingAction={() => handleRebooking(booking.id)}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Không có đơn đặt phòng nào
              </Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
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
