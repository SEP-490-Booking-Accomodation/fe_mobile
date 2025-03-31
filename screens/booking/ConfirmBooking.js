import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomInput from "../../components/TextInput";
import CustomButton from "../../components/buttons/Button";
import GuestSelectionModal from "./modals/GuestSelectionModal";

export default function ConfirmBooking({ route, navigation }) {
  const { accommodationTypeData, rentalData } = route.params || {};

  // Set isOverNight property from accommodationTypeData
  const isOverNight = accommodationTypeData?.data?.isOverNight || false;

  // Operating hours
  const OPENING_HOUR = rentalData?.data?.openHour || 8; // Default 8:00 AM
  const CLOSING_HOUR = rentalData?.data?.closeHour || 22; // Default 10:00 PM
  const MAX_PEOPLE = accommodationTypeData?.data?.maxPeopleNumber || 3;
  console.log(rentalData);

  // State for pickers and modals
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);

  // Initialize with current date and time
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedTime, setSelectedTime] = useState(now);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [guestCount, setGuestCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [endTime, setEndTime] = useState(null);

  // Form validation
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    updateEndTime();
  }, [selectedTime, selectedDuration]);

  useEffect(() => {
    validateForm();
  }, [selectedDate, selectedTime, selectedDuration, guestCount, formData]);

  const validateForm = () => {
    const isDateTimeValid = selectedDate && selectedTime && isValidDateTime();
    const isGuestValid = guestCount.adults + guestCount.children > 0;
    // const isUserInfoValid =
    //   formData.name.trim() !== "" &&
    //   formData.phone.trim() !== "" &&
    //   formData.email.includes("@");

    // setIsFormValid(isDateTimeValid && isGuestValid && isUserInfoValid);
    setIsFormValid(isDateTimeValid && isGuestValid);
  };

  const isValidDateTime = () => {
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    return selectedDateTime > now;
  };

  const updateEndTime = () => {
    if (selectedTime) {
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      const endDateTime = new Date(combinedDateTime);
      endDateTime.setHours(endDateTime.getHours() + selectedDuration);
      setEndTime(endDateTime);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Xác nhận đặt phòng</Text>
    </View>
  );

  const durations = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
  };

  // Format date display
  const formatDate = useCallback((date) => {
    if (!date) return "";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }, []);

  // Format time display
  const formatTime = useCallback((date) => {
    if (!date) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }, []);

  // Handle date selection
  const handleDateSelect = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày từ hôm nay trở đi.");
      return;
    }

    setSelectedDate(date);
    closeDatePicker();
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.getHours(), time.getMinutes());

    // Check if selected datetime is in the past
    if (selectedDateTime < now) {
      Alert.alert("Lỗi", "Vui lòng chọn thời gian trong tương lai.");
      return;
    }

    const hour = time.getHours();

    // Check if time is within operating hours
    if (hour < OPENING_HOUR || hour >= CLOSING_HOUR) {
      // If not overnight, show error
      if (!isOverNight) {
        Alert.alert(
          "Lỗi",
          `Thời gian hoạt động chỉ từ ${OPENING_HOUR}:00 đến ${CLOSING_HOUR}:00.`
        );
        return;
      }
      // If overnight, allow booking
    }

    // Calculate expected end time
    const endDateTime = new Date(selectedDateTime);
    endDateTime.setHours(endDateTime.getHours() + selectedDuration);

    // Check if end time exceeds closing time for non-overnight bookings
    if (!isOverNight && endDateTime.getHours() > CLOSING_HOUR) {
      Alert.alert(
        "Lỗi",
        `Thời gian kết thúc không được vượt quá ${CLOSING_HOUR}:00.`
      );
      return;
    }

    setSelectedTime(time);
    closeTimePicker();
  };

  // Close date picker modal
  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  // Close time picker modal
  const closeTimePicker = useCallback(() => {
    setTimePickerVisible(false);
  }, []);

  // Open date picker
  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Open time picker
  const openTimePicker = () => {
    setTimePickerVisible(true);
  };

  const handleGuestSelection = (guests) => {
    setGuestCount(guests);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
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

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate total price based on booking time and duration
  const calculateTotalPrice = () => {
    if (!accommodationTypeData?.data) return 0;

    const basePrice = accommodationTypeData.data.basePrice || 0;
    const overtimePrice = accommodationTypeData.data.overtimeHourlyPrice || 0;

    // First hour at base price, subsequent hours at overtime price
    return basePrice + (selectedDuration - 1) * overtimePrice;
  };

  const handleContinue = () => {
    if (!isFormValid) {
      let errorMessage = "";

      if (!isValidDateTime()) {
        errorMessage = "Vui lòng chọn thời gian trong tương lai.";
      } else if (guestCount.adults + guestCount.children === 0) {
        errorMessage = "Vui lòng chọn số lượng khách.";
      } else {
        errorMessage = "Vui lòng điền đầy đủ thông tin cá nhân.";
      }

      Alert.alert("Thiếu thông tin", errorMessage);
      return;
    }

    // Navigate to payment confirmation
    navigation.navigate("PaymentConfirm", {
      bookingData: {
        accommodationType: accommodationTypeData?.data?.name,
        date: formatDate(selectedDate),
        time: formatTime(selectedTime),
        duration: selectedDuration,
        endTime: formatTime(endTime),
        endDate: formatDate(endTime),
        guests: guestCount,
        contact: formData,
        totalPrice: calculateTotalPrice(),
      },
    });
  };

  const renderTypeInfo = () => {
    if (!accommodationTypeData?.data) return null;

    return (
      <View style={styles.typeInfoContainer}>
        <Image
          source={{
            uri:
              accommodationTypeData?.data?.image?.[0] ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1ank-wR_C1doFKGVu5XKmO5bg6RTaVub5A&s",
          }}
          style={styles.mainImage}
        />

        <Text style={styles.typeName}>{accommodationTypeData?.data?.name}</Text>
        <Text style={styles.infoText}>
          {OPENING_HOUR} - {CLOSING_HOUR}
        </Text>
        <Text style={styles.infoText}>
          Số người tối đa: {accommodationTypeData?.data?.maxPeopleNumber}
        </Text>
        <Text style={styles.infoText}>
          Giá giờ đầu: {formatMoney(accommodationTypeData?.data?.basePrice)} /
          giờ
        </Text>
        <Text style={styles.infoText}>
          Giá giờ tiếp theo:{" "}
          {formatMoney(accommodationTypeData?.data?.overtimeHourlyPrice)} / giờ
        </Text>
        {isOverNight && (
          <Text style={styles.specialTag}>Cho phép đặt qua đêm</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} bounces={true}>
          <View style={styles.content}>
            <View style={styles.cardSmallContainer}>{renderTypeInfo()}</View>

            {/* Date selection */}
            <Text style={styles.sectionHeader}>Ngày nhận phòng</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={openDatePicker}
            >
              <Text style={styles.dateTimeText}>
                {formatDate(selectedDate)}
              </Text>
              <Calendar style={styles.icon} size={24} color="#666" />
            </TouchableOpacity>

            {/* Time selection */}
            <Text style={styles.sectionHeader}>Giờ nhận phòng</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={openTimePicker}
            >
              <Text style={styles.dateTimeText}>
                {formatTime(selectedTime)}
              </Text>
              <Clock style={styles.icon} size={24} color="#666" />
            </TouchableOpacity>

            {/* Display expected end time */}
            {endTime && (
              <View style={styles.endTimeContainer}>
                <Text style={styles.endTimeLabel}>
                  Thời gian kết thúc dự kiến:
                </Text>
                <Text style={styles.endTimeValue}>
                  {formatTime(endTime)} ngày {formatDate(endTime)}
                </Text>
              </View>
            )}

            {/* Duration selection */}
            <Text style={styles.sectionHeader}>Thời lượng sử dụng</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.durationScrollView}
            >
              {durations.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.durationButton,
                    selectedDuration === hour && styles.selectedDurationButton,
                  ]}
                  onPress={() => handleSelectDuration(hour)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === hour && styles.selectedDurationText,
                    ]}
                  >
                    {hour} giờ
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Guest count */}
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

            {/* Contact information */}
            {/* <View>
              <Text style={styles.sectionHeader}>Thông tin người đại diện</Text>
              <Text style={styles.sectionHeader2}>Họ tên</Text>
              <CustomInput
                placeholder="Nhập họ tên"
                keyboardType="default"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
              <View style={styles.breakLine}></View>
              <Text style={styles.sectionHeader2}>Số điện thoại</Text>
              <CustomInput
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
              <View style={styles.breakLine}></View>
              <Text style={styles.sectionHeader2}>Email</Text>
              <CustomInput
                placeholder="Nhập email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>Tổng</Text>
          <Text style={styles.price}>{formatMoney(calculateTotalPrice())}</Text>
        </View>
        <CustomButton
          style={[{ width: "45%" }, !isFormValid && styles.disabledButton]}
          title="Xác nhận"
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateSelect}
        onCancel={closeDatePicker}
        date={selectedDate}
        textColor="black"
        presentationStyle="overFullScreen"
        animationType="fade"
        locale="vi"
        minimumDate={new Date()} // Cannot select dates in the past
      />

      {/* Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeSelect}
        onCancel={closeTimePicker}
        date={selectedTime}
        textColor="black"
        presentationStyle="overFullScreen"
        animationType="fade"
        locale="vi"
      />

      {/* Guest selection modal */}
      <GuestSelectionModal
        visible={isGuestModalVisible}
        onClose={() => setGuestModalVisible(false)}
        onConfirm={handleGuestSelection}
        maxPeople={MAX_PEOPLE}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    padding: 14,
    borderRadius: 20,
    marginBottom: 24,
  },
  dateTimeText: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  endTimeContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  endTimeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 5,
  },
  endTimeValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  peopleRoom: {
    marginTop: 10,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
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
    alignItems: "flex-start",
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
  durationScrollView: {
    flexDirection: "row",
    marginBottom: 20,
  },
  durationButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    minWidth: 80,
    alignItems: "center",
  },
  selectedDurationButton: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  durationText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDurationText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typeInfoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  typeName: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  mainImage: {
    borderRadius: 10,
    height: 150,
    width: "100%",
    objectFit: "cover",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  specialTag: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#333",
  },
});
