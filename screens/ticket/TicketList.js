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
import CustomButton from "../../components/buttons/Button";
import CardInMyTicket from "../../components/cards/CardInMyTicket";

export default function TicketList() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("current"); 
  const imageTest = "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Mock data with different status
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
      bookingStatus: "current"
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
        bookingStatus: "current"
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
        bookingStatus: "current"
      }
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Vé phòng của tôi</Text>
    </View>
  );

  const handleViewDetail = (id) => {
    console.log("View detail", id);
  };

  const handleCancel = (id) => {
    console.log("Cancel booking", id);
  };

  // Filter bookings based on active tab
  const filteredBookings = mockData.filter(booking => booking.bookingStatus === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        <View style={styles.navigationBar}>
          <CustomButton 
            title="Sắp tới"
            style={styles.buttonNav}
            backgroundColor={activeTab === "upcoming" ? "#4E72E3" : "#fff"}
            titleColor={activeTab === "upcoming" ? "#FFFFFF" : "#6B7280"}
            onPress={() => setActiveTab("upcoming")}
          />
          <CustomButton 
            title="Hiện tại"
            style={styles.buttonNav}
            backgroundColor={activeTab === "current" ? "#4E72E3" : "#fff"}
            titleColor={activeTab === "current" ? "#FFFFFF" : "#6B7280"}
            onPress={() => setActiveTab("current")}
          />
          <CustomButton 
            title="Đã qua"
            style={styles.buttonNav}
            backgroundColor={activeTab === "past" ? "#4E72E3" : "#fff"}
            titleColor={activeTab === "past" ? "#FFFFFF" : "#6B7280"}
            onPress={() => setActiveTab("past")}
          />
        </View>

        <ScrollView style={styles.scrollView}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <View key={booking.id} style={styles.cardWrapper}>
                <CardInMyTicket
                  imageUrl={booking.imageUrl}
                  nameRoom={booking.nameRoom}
                  placeName={booking.placeName}
                  maxPeople={booking.maxPeople}
                  price={booking.price}
                  dateCompleted={booking.dateCompleted}
                  status={booking.status}
                  onViewDetail={() => handleViewDetail(booking.id)}
                  onCancelAction={() => handleCancel(booking.id)}
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
      </View>
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
  navigationBar: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  buttonNav : {
    borderWidth: 1,
    borderColor: "#4E72E3",
    paddingVertical: 10,
  }
});