import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import CustomButton from "../../../components/buttons/Button";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const imageTest = "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const mockData = [
    {
      id: 1,
      imageUrl: imageTest,
      nameRoom: "Phòng 1",
      placeName: "Vũng Tàu",
      maxPeople: "2",
      price: "500.000",
      dateCompleted: "23/12/2024",
      status: "0",
      bookingStatus: "upcoming"
    },
    {
      id: 2,
      imageUrl: imageTest,
      nameRoom: "Phòng 1",
      placeName: "Vũng Tàu",
      maxPeople: "2",
      price: "500.000",
      dateCompleted: "23/12/2024",
      status: "-1",
      bookingStatus: "past"
    },
    {
      id: 3,
      imageUrl: imageTest,
      nameRoom: "Phòng 1",
      placeName: "Vũng Tàu",
      maxPeople: "2",
      price: "500.000",
      dateCompleted: "23/12/2024",
      status: "1",
      bookingStatus: "cancelled"
    },
    {
      id: 4,
      imageUrl: imageTest,
      nameRoom: "Phòng 1",
      placeName: "Vũng Tàu",
      maxPeople: "2",
      price: "500.000",
      dateCompleted: "23/12/2024",
      status: "1",
      bookingStatus: "cancelled"
    },
    {
      id: 5,
      imageUrl: imageTest,
      nameRoom: "Phòng 1",
      placeName: "Vũng Tàu",
      maxPeople: "2",
      price: "500.000",
      dateCompleted: "23/12/2024",
      status: "1",
      bookingStatus: "cancelled"
    }
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>Về phòng của tôi</Text>
    </View>
  );

  const handleViewDetail = (id) => {
    console.log("View detail", id);
  };

  const handleCancel = (id) => {
    console.log("Cancel booking", id);
  };

  const filteredBookings = mockData.filter(booking => booking.bookingStatus === activeTab);

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.roomName}>Phòng 1</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Imperial</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color="#4E72E3" />
            <Text style={styles.detailText}>Vũng Tàu</Text>
            <Text style={styles.dateText}>23/12/2024</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color="#4E72E3" />
            <Text style={styles.detailText}>2 người lớn</Text>
          </View>

          <Text style={styles.priceText}>500.000đ</Text>
        </View>

        <View style={styles.cardActions}>
          {activeTab === 'upcoming' && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(booking.id)}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          )}

          {activeTab === 'past' && (
            <TouchableOpacity style={styles.rateButton} onPress={() => { }}>
              <Text style={styles.rateButtonText}>Đánh giá</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.detailButton} onPress={() => handleViewDetail(booking.id)}>
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <View style={styles.tabButtonsContainer}>
        <CustomButton
          title="Sắp tới"
          variant={activeTab === "upcoming" ? "filled" : "outlined"}
          backgroundColor="#4E72E3"
          titleColor={activeTab === "upcoming" ? "#FFFFFF" : "#4E72E3"}
          onPress={() => setActiveTab("upcoming")}
          style={styles.tabButton}
          size="small"
        />

        <View style={styles.tabSpacer} />

        <CustomButton
          title="Hiện tại"
          variant={activeTab === "past" ? "filled" : "outlined"}
          backgroundColor="#4E72E3"
          titleColor={activeTab === "past" ? "#FFFFFF" : "#4E72E3"}
          onPress={() => setActiveTab("past")}
          style={styles.tabButton}
          size="small"
        />

        <View style={styles.tabSpacer} />

        <CustomButton
          title="Đã qua"
          variant={activeTab === "cancelled" ? "filled" : "outlined"}
          backgroundColor="#4E72E3"
          titleColor={activeTab === "cancelled" ? "#FFFFFF" : "#4E72E3"}
          onPress={() => setActiveTab("cancelled")}
          style={styles.tabButton}
          size="small"
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => renderBookingCard(booking))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Không có đơn đặt phòng nào
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  arrowBack: {
    marginRight: 10,
    color: "#4E72E3",
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  tabContainer: {
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  tabButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    height: 36,
    borderRadius: 100,
  },
  tabSpacer: {
    width: 16,
  },
  firstTabButton: {
    marginRight: 8,
  },
  middleTabButton: {
    marginHorizontal: 8,
  },
  lastTabButton: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 8,
  },
  tagContainer: {
    backgroundColor: "#EBF2FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
    color: "#4E72E3",
    fontWeight: "500",
  },
  cardDetails: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#4E72E3",
    marginLeft: 4,
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#4E72E3",
    textAlign: "right",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4E72E3",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 90,
  },
  cancelButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
  },
  rateButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 100, 
    paddingVertical: 8,
    paddingHorizontal: 24, 
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  rateButtonText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
  },
  detailButton: {
    backgroundColor: "#111827",
    borderRadius: 100, 
    paddingVertical: 8,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 110, 
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 12, 
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
});