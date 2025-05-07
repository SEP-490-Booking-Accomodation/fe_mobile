import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Combined DateTimePicker and DurationSelector for better cohesion
const ImprovedDateTimePicker = ({
  selectedDate,
  selectedTime,
  endTime,
  formatDate,
  formatTime,
  isOverNight,
  openingHour,
  openingMinute,
  closingHour,
  closingMinute,
  handleDateSelect,
  handleTimeSelect,
  handleSelectDuration,
  selectedDuration,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [availableDurations, setAvailableDurations] = useState([]);

  const openDatePicker = () => setDatePickerVisible(true);
  const closeDatePicker = () => setDatePickerVisible(false);
  const openTimePicker = () => setTimePickerVisible(true);
  const closeTimePicker = () => setTimePickerVisible(false);

  // Calculate max allowed date (today + 1 day for 48h advance booking)
  const getMaxAllowedDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 1);
    return maxDate;
  };

  console.log(isOverNight);
  // This effect updates available durations based on selected time and closing hour
  useEffect(() => {
    if (!selectedTime) {
      // If no time selected, show all durations up to 12 hours
      setAvailableDurations(Array.from({ length: 12 }, (_, i) => i + 1));
      return;
    }

    // For overnight stays, always allow all durations
    if (isOverNight) {
      const overnightDurations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24];
      setAvailableDurations(overnightDurations);
      return;
    }

    // For regular bookings, calculate remaining hours until closing
    const remainingHours = calculateRemainingHours(selectedTime);
    const maxDuration = Math.max(1, Math.floor(remainingHours));

    setAvailableDurations(
      Array.from({ length: Math.min(maxDuration, 12) }, (_, i) => i + 1)
    );

    // If current selected duration exceeds available time, reset it
    if (selectedDuration > maxDuration) {
      handleSelectDuration(maxDuration);
    }
  }, [selectedTime, isOverNight]);

  // Calculate hours remaining until closing time
  const calculateRemainingHours = (time) => {
    if (!time) return 12;

    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();

    // Calculate total minutes for both times
    const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
    const closingTotalMinutes = closingHour * 60 + closingMinute;

    // Calculate difference in hours
    return (closingTotalMinutes - selectedTotalMinutes) / 60;
  };

  // Handle internal date selection with validation
  const onDateSelect = (date) => {
    // Check if date is within allowed range (today or tomorrow)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Format for comparison (ignoring time)
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today || selectedDay > tomorrow) {
      Alert.alert(
        "Lỗi",
        "Chỉ có thể đặt phòng trong vòng 48 giờ (hôm nay hoặc ngày mai)."
      );
      return;
    }

    handleDateSelect(date);
    closeDatePicker();
  };

  // Handle internal time selection with validation
  const onTimeSelect = (time) => {
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0);

    // Check if selected time is in the past
    if (selectedDateTime < now) {
      Alert.alert("Lỗi", "Vui lòng chọn thời gian trong tương lai.");
      return;
    }

    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();

    // Check if selected time is before opening hours
    if (
      selectedHour < openingHour ||
      (selectedHour === openingHour && selectedMinute < openingMinute)
    ) {
      Alert.alert(
        "Lỗi",
        `Thời gian hoạt động chỉ từ ${openingHour}:${String(
          openingMinute
        ).padStart(2, "0")} đến ${closingHour}:${String(closingMinute).padStart(
          2,
          "0"
        )}.`
      );
      return;
    }

    // Check if selected time is after closing hours
    if (
      selectedHour > closingHour ||
      (selectedHour === closingHour && selectedMinute > closingMinute)
    ) {
      Alert.alert(
        "Lỗi",
        `Thời gian hoạt động chỉ từ ${openingHour}:${String(
          openingMinute
        ).padStart(2, "0")} đến ${closingHour}:${String(closingMinute).padStart(
          2,
          "0"
        )}.`
      );
      return;
    }

    handleTimeSelect(time);
    closeTimePicker();
  };

  // Get a friendly label for the end time
  const getEndTimeLabel = () => {
    if (!endTime) return "";

    const endDate = new Date(endTime);
    const startDate = new Date(selectedDate);

    // Check if end date is different from start date
    if (endDate.toDateString() !== startDate.toDateString()) {
      return `${formatTime(endTime)} ngày ${formatDate(endTime)}`;
    }

    return formatTime(endTime);
  };

  return (
    <View>
      {/* Date selection */}
      <Text style={styles.sectionHeader}>Ngày nhận phòng</Text>
      <TouchableOpacity style={styles.dateTimeButton} onPress={openDatePicker}>
        <Text
          style={[styles.dateTimeText, !selectedDate && styles.placeholderText]}
        >
          {selectedDate ? formatDate(selectedDate) : "Chọn ngày"}
        </Text>
        <AntDesign name="calendar" size={24} color="black" />
      </TouchableOpacity>

      {/* Time selection */}
      <Text style={styles.sectionHeader}>Giờ nhận phòng</Text>
      <TouchableOpacity style={styles.dateTimeButton} onPress={openTimePicker}>
        <Text
          style={[styles.dateTimeText, !selectedTime && styles.placeholderText]}
        >
          {selectedTime ? formatTime(selectedTime) : "Chọn giờ"}
        </Text>
        <AntDesign name="clockcircleo" size={24} color="black" />
      </TouchableOpacity>

      {/* Duration selection */}
      <Text style={styles.sectionHeader}>
        {isOverNight
          ? "Thời lượng sử dụng (bao gồm qua đêm)"
          : "Thời lượng sử dụng"}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.durationScrollView}
      >
        {availableDurations.map((hours) => (
          <TouchableOpacity
            key={hours}
            style={[
              styles.durationButton,
              selectedDuration === hours && styles.selectedDurationButton,
              hours === 24 && styles.overnightButton,
            ]}
            onPress={() => handleSelectDuration(hours)}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === hours && styles.selectedDurationText,
              ]}
            >
              {hours === 24 ? "Qua đêm" : `${hours} giờ`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Display expected end time */}
      {endTime && (
        <View style={styles.endTimeContainer}>
          <Text style={styles.endTimeLabel}>Thời gian kết thúc dự kiến:</Text>
          <Text style={styles.endTimeValue}>{getEndTimeLabel()}</Text>
        </View>
      )}

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={onDateSelect}
        onCancel={closeDatePicker}
        date={selectedDate || new Date()}
        maximumDate={getMaxAllowedDate()}
        minimumDate={new Date()}
        textColor="black"
        presentationStyle="overFullScreen"
        animationType="fade"
        locale="vi"
      />

      {/* Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={onTimeSelect}
        onCancel={closeTimePicker}
        date={selectedTime || new Date()}
        textColor="black"
        presentationStyle="overFullScreen"
        animationType="fade"
        locale="vi"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
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
  placeholderText: {
    color: "#999",
  },
  icon: {
    marginLeft: 10,
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
  overnightButton: {
    backgroundColor: "#f0f8ff",
    borderColor: "#4682b4",
  },
  durationText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDurationText: {
    color: "#fff",
    fontWeight: "bold",
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
});

export default ImprovedDateTimePicker;
