import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, Clock } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePicker = ({
  selectedDate,
  selectedTime,
  endTime,
  formatDate,
  formatTime,
  openDatePicker,
  openTimePicker,
  isDatePickerVisible,
  isTimePickerVisible,
  handleDateSelect,
  handleTimeSelect,
  closeDatePicker,
  closeTimePicker,
}) => {
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
        <Calendar style={styles.icon} size={24} color="#666" />
      </TouchableOpacity>

      {/* Time selection */}
      <Text style={styles.sectionHeader}>Giờ nhận phòng</Text>
      <TouchableOpacity style={styles.dateTimeButton} onPress={openTimePicker}>
        <Text
          style={[styles.dateTimeText, !selectedTime && styles.placeholderText]}
        >
          {selectedTime ? formatTime(selectedTime) : "Chọn giờ"}
        </Text>
        <Clock style={styles.icon} size={24} color="#666" />
      </TouchableOpacity>

      {/* Display expected end time */}
      {endTime && (
        <View style={styles.endTimeContainer}>
          <Text style={styles.endTimeLabel}>Thời gian kết thúc dự kiến:</Text>
          <Text style={styles.endTimeValue}>
            {formatTime(endTime)} ngày {formatDate(endTime)}
          </Text>
        </View>
      )}

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
});

export default DateTimePicker;
