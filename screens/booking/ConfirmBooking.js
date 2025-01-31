import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatView
} from "react-native";
import { Calendar, Users } from "lucide-react-native";
import HorizontalCardSmall from "../../components/cards/HorizontalCardSmall";
import DateTimePicker from "../../components/DateTimePicker/DateTimePicker";
import GuestSelectionModal from "./modals/GuestSelectionModal";
import CustomInput from "../../components/TextInput";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
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
  breakLine: {
    marginVertical: 10,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  cardSmallContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionHeader2: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  dateTimeText: {
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Changed from "center" to "flex-end"
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 0, // Added to ensure full width
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20, // Added rounded corners at top
    borderTopRightRadius: 20, // Added rounded corners at top
    width: "100%", // Changed from 80% to full width
  },
  closeButton: {
    marginTop: 20,
    marginBottom: 20, // Added bottom margin for better spacing
    alignSelf: "center",
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16, // Added font size for better visibility
    fontWeight: "500", // Added font weight
  },
  peopleRoom: {
    marginTop: 10,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginBottom: 24,
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default function ConfirmBooking({ route, navigation }) {
  const { roomData } = route.params || {};

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [guestCount, setGuestCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Xác nhận đặt phòng</Text>
    </View>
  );

  const formatDateTime = useCallback((date) => {
    if (!date) return "";
    return `${date.day}/${date.month}/${date.year} ${String(date.hour).padStart(
      2,
      "0"
    )}:${String(date.minute).padStart(2, "0")}`;
  }, []);

  const handleDateTimeSelect = useCallback(
    (dateTime) => {
      const formattedDateTime = formatDateTime(dateTime);
      setSelectedDateTime(formattedDateTime);
    },
    [formatDateTime]
  );

  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleGuestSelection = (guests) => {
    setGuestCount(guests);
    setGuestModalVisible(false);
  };

  const formatGuestCount = () => {
    const total = guestCount.adults + guestCount.children + guestCount.infants;
    if (total === 0) return "Chọn số lượng khách";

    const parts = [];
    if (guestCount.adults > 0) {
      parts.push(`${guestCount.adults} người lớn`);
    }
    if (guestCount.children > 0) {
      parts.push(`${guestCount.children} trẻ em`);
    }
    if (guestCount.infants > 0) {
      parts.push(`${guestCount.infants} trẻ sơ sinh`);
    }
    return parts.join(", ");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <View style={styles.content}>
        <View style={styles.cardSmallContainer}>
          <HorizontalCardSmall
            imageUrl={roomData?.images?.[0]?.source}
            roomName={roomData?.name}
            location={roomData?.location}
            rating={roomData?.rating}
            numOfReviews={roomData?.reviewCount}
            tagName={roomData?.tagName || "Imperial"}
          />
        </View>

        <Text style={styles.sectionHeader}>Thời gian nhận phòng</Text>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={openDatePicker}
        >
          <Text style={styles.dateTimeText}>
            {selectedDateTime || "Chọn ngày và giờ"}
          </Text>
          <Calendar style={styles.icon} size={24} color="#666" />
        </TouchableOpacity>

        <View style={styles.peopleRoom}>
          <Text style={styles.sectionHeader}>Số lượng người ở phòng</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setGuestModalVisible(true)}
          >
            <Text style={styles.selectionText}>{formatGuestCount()}</Text>
            <Users size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={isDatePickerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDatePickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={closeDatePicker}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
            >
              {isDatePickerVisible && (
                <DateTimePicker
                  onSelect={handleDateTimeSelect}
                  initialDate={
                    selectedDateTime ? new Date(selectedDateTime) : new Date()
                  }
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDatePicker}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <GuestSelectionModal
          visible={isGuestModalVisible}
          onClose={() => setGuestModalVisible(false)}
          onConfirm={handleGuestSelection}
        />

        <View>
            <Text style={styles.sectionHeader}>Thông tin người đại diện</Text>
            <Text style={styles.sectionHeader2}>Họ tên</Text>
            <CustomInput placeholder="Nhập họ tên" keyboardType="default"  />
            <View style={styles.breakLine}></View>
            <Text style={styles.sectionHeader2}>Số điện thoại</Text>
            <CustomInput placeholder="Nhập số điện thoại" keyboardType="phone-pad"  />
            <View style={styles.breakLine}></View>
            <Text style={styles.sectionHeader2}>Email</Text>
            <CustomInput placeholder="Nhập email" keyboardType="email-address"  />
            

        </View>
      </View>
    </SafeAreaView>
  );
}
