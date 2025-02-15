
import { useState, useCallback } from "react"
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Calendar, Users, ArrowLeft } from "lucide-react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import HorizontalCardSmall from "../../components/cards/HorizontalCardSmall"
// import DateTimePicker from "../../components/DateTimePicker/DateTimePicker";
import GuestSelectionModal from "./modals/GuestSelectionModal"
import CustomInput from "../../components/TextInput"
import CustomButton from "../../components/buttons/Button"

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingTop: 60, // Adjust this value based on your header height
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  closeButton: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "500",
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
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
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
    alignItems: "left",
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
  bookButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  durationScrollView: { flexDirection: "row", marginBottom: 20 },
  durationButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  selectedDurationButton: { backgroundColor: "#1a1a1a", borderColor: "#1a1a1a" },
  durationText: { fontSize: 16, color: "#333" },
  selectedDurationText: { color: "#fff", fontWeight: "bold" },
})

export default function ConfirmBooking({ route, navigation }) {
  const { roomData } = route.params || {}

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [guestCount, setGuestCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  })

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Xác nhận đặt phòng</Text>
    </View>
  )

  const handleReturnBack = () => {
    //navigation.navigate("DetailAccomodation", { roomData })
  }
  const durations = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
  };
  const formatDateTime = useCallback((date) => {
    if (!date) return ""
    if (date instanceof Date) {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    }
    return date
  }, [])

  const handleDateTimeSelect = useCallback(
    (dateTime) => {
      const formattedDateTime = formatDateTime(dateTime)
      setSelectedDateTime(formattedDateTime)
      setDatePickerVisible(false)
    },
    [formatDateTime],
  )

  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false)
  }, [])

  const openDatePicker = () => {
    setDatePickerVisible(true)
  }

  const handleGuestSelection = (guests) => {
    setGuestCount(guests)
    setGuestModalVisible(false)
  }

  const formatGuestCount = () => {
    const total = guestCount.adults + guestCount.children + guestCount.infants
    if (total === 0) return "Chọn số lượng khách"

    const parts = []
    if (guestCount.adults > 0) {
      parts.push(`${guestCount.adults} người lớn`)
    }
    if (guestCount.children > 0) {
      parts.push(`${guestCount.children} trẻ em`)
    }
    if (guestCount.infants > 0) {
      parts.push(`${guestCount.infants} trẻ sơ sinh`)
    }
    return parts.join(", ")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={styles.container} bounces={true}>
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
            <TouchableOpacity style={styles.dateTimeButton} onPress={openDatePicker}>
              <Text style={styles.dateTimeText}>{formatDateTime(selectedDateTime)}</Text>
              <Calendar style={styles.icon} size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.sectionHeader}>Thời lượng sử dụng </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationScrollView}>
              {durations.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[styles.durationButton, selectedDuration === hour && styles.selectedDurationButton]}
                  onPress={() => handleSelectDuration(hour)}
                >
                  <Text style={[styles.durationText, selectedDuration === hour && styles.selectedDurationText]}>
                    {hour} giờ
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.peopleRoom}>
              <Text style={styles.sectionHeader}>Số lượng người ở phòng</Text>
              <TouchableOpacity style={styles.selectionButton} onPress={() => setGuestModalVisible(true)}>
                <Text style={styles.selectionText}>{formatGuestCount()}</Text>
                <Users size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Thông tin người đại diện */}
            <View>
              <Text style={styles.sectionHeader}>Thông tin người đại diện</Text>
              <Text style={styles.sectionHeader2}>Họ tên</Text>
              <CustomInput placeholder="Nhập họ tên" keyboardType="default" />
              <View style={styles.breakLine}></View>
              <Text style={styles.sectionHeader2}>Số điện thoại</Text>
              <CustomInput placeholder="Nhập số điện thoại" keyboardType="phone-pad" />
              <View style={styles.breakLine}></View>
              <Text style={styles.sectionHeader2}>Email</Text>
              <CustomInput placeholder="Nhập email" keyboardType="email-address" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>Tổng</Text>
          <Text style={styles.price}>500.000đ</Text>
        </View>
        <CustomButton style={{ width: "45%" }} title="Xác nhận" onPress={() => navigation.navigate("PaymentConfirm")} />
      </View>

      {/* Commented out custom DateTimePicker */}
      {/* <Modal
        visible={isDatePickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeDatePicker}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {isDatePickerVisible && (
              <DateTimePicker
                onSelect={handleDateTimeSelect}
                initialDate={selectedDateTime ? new Date(selectedDateTime) : new Date()}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeDatePicker}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal> */}

      {/* New DateTimePickerModal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateTimeSelect}
        onCancel={closeDatePicker}
        date={selectedDateTime instanceof Date ? selectedDateTime : new Date()}
      />

      <GuestSelectionModal
        visible={isGuestModalVisible}
        onClose={() => setGuestModalVisible(false)}
        onConfirm={handleGuestSelection}
      />
    </SafeAreaView>
  )
}
