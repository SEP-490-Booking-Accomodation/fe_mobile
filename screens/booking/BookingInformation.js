import { useState, useCallback, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import BookingHeader from "./components/BookingHeader";
import AccommodationInfo from "./components/AccommodationInfo";
import DateTimePicker from "./components/DateTimePicker";
import DurationSelector from "./components/DurationSelector";
import GuestSelector from "./components/GuestSelector";
import BookingFooter from "./components/BookingFooter";
import GuestSelectionModal from "./modals/GuestSelectionModal";
import { useCheckAvailableRoomMutation } from "../../api/bookingApi";
import { useTranslation } from "react-i18next";

export default function BookingInformation({ route, navigation }) {
  const { t } = useTranslation();
  const { accommodationTypeData, rentalData } = route.params || {};
  console.log("accommodationTypeData", accommodationTypeData);
  console.log("rentalData", rentalData);
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 0, minute: 0 };
    const [hour, minute] = timeStr.split(":").map(Number);
    return { hour, minute };
  };
  const [checkAvailable] = useCheckAvailableRoomMutation();

  // Operating hours
  const { hour: OPENING_HOUR, minute: OPENING_MINUTE } = parseTime(
    rentalData?.data?.openHour || "08:00"
  );
  const { hour: CLOSING_HOUR, minute: CLOSING_MINUTE } = parseTime(
    rentalData?.data?.closeHour || "22:00"
  );

  const MAX_PEOPLE = accommodationTypeData?.data?.maxPeopleNumber || 3;
  const isOverNight = rentalData?.data?.isOverNight;

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [guestCount, setGuestCount] = useState({
    adults: 0,
    children: 0,
  });
  const [endTime, setEndTime] = useState(null);

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

  const formatDate = useCallback((date) => {
    if (!date) return "";
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }, []);

  const formatTime = useCallback((date) => {
    if (!date) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }, []);

  const handleDateSelect = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today || selectedDay > tomorrow) {
      Alert.alert(t("error"), t("date_selection_error"));
      closeDatePicker();
      return;
    }
    closeDatePicker();
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
  const now = new Date();
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0);

  if (selectedDateTime < now) {
    Alert.alert(t("error"), t("future_time_error"));
    closeTimePicker();
    return;
  }

    if (!isOverNight) {
      const selectedHour = time.getHours();
      const selectedMinute = time.getMinutes();

      if (
        selectedHour < OPENING_HOUR ||
        (selectedHour === OPENING_HOUR && selectedMinute < OPENING_MINUTE)
      ) {
        Alert.alert(
          t("error"),
          t("check_in_time_error", {
            openHour: OPENING_HOUR,
            openMinute: String(OPENING_MINUTE).padStart(2, "0"),
            closeHour: CLOSING_HOUR,
            closeMinute: String(CLOSING_MINUTE).padStart(2, "0")
          })
        );
        closeTimePicker();
        return;
      }

      if (
        selectedHour > CLOSING_HOUR ||
        (selectedHour === CLOSING_HOUR && selectedMinute < CLOSING_MINUTE)
      ) {
        Alert.alert(
          t("error"),
          t("check_in_time_error", {
            openHour: OPENING_HOUR,
            openMinute: String(OPENING_MINUTE).padStart(2, "0"),
            closeHour: CLOSING_HOUR,
            closeMinute: String(CLOSING_MINUTE).padStart(2, "0")
          })
        );
        closeTimePicker();
        return;
      }

      const endDateTime = new Date(selectedDateTime);
      endDateTime.setHours(endDateTime.getHours() + selectedDuration);

      if (
        endDateTime.getHours() > CLOSING_HOUR ||
        (endDateTime.getHours() === CLOSING_HOUR &&
          endDateTime.getMinutes() > CLOSING_MINUTE)
      ) {
        Alert.alert(
          t("error"),
          t("check_in_end_time_error", {
            closeHour: CLOSING_HOUR,
            closeMinute: String(CLOSING_MINUTE).padStart(2, "0")
          })
        );
        closeTimePicker();
        return;
      }
    }
    
    closeTimePicker();
    setSelectedTime(time);
  };

  const closeDatePicker = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const closeTimePicker = useCallback(() => {
    setTimePickerVisible(false);
  }, []);

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const openTimePicker = () => {
    setTimePickerVisible(true);
  };

  const handleGuestSelection = (guests) => {
    setGuestCount(guests);
  };

  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
  };

  const formatGuestCount = () => {
    const total = guestCount.adults + guestCount.children + guestCount.infants;
    if (total === 0) return t("select_guest_count");

    const parts = [];
    if (guestCount.adults > 0) {
      parts.push(t("adults_count", { count: guestCount.adults }));
    }
    if (guestCount.children > 0) {
      parts.push(t("children_count", { count: guestCount.children }));
    }
    if (guestCount.infants > 0) {
      parts.push(t("infants_count", { count: guestCount.infants }));
    }
    return parts.join(", ");
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateTotalPrice = () => {
    if (!accommodationTypeData?.data) return 0;

    const basePrice = accommodationTypeData?.data.basePrice || 0;
    const overtimePrice = accommodationTypeData?.data.overtimeHourlyPrice || 0;

    return basePrice + (selectedDuration - 1) * overtimePrice;
  };

  const handleContinue = async () => {
    if (!isFormValid) {
      let errorMessage = "";

      if (!isValidDateTime()) {
        errorMessage = t("future_time_error");
      } else if (guestCount.adults + guestCount.children === 0) {
        errorMessage = t("guest_count_error");
      } else {
        errorMessage = t("missing_info_error");
      }

      Alert.alert(t("missing_info_title"), errorMessage);
      return;
    }
    const checkInDateTime = `${formatDate(selectedDate)} ${formatTime(
      selectedTime
    )}:00`;
    const checkOutDateTime = `${formatDate(endTime)} ${formatTime(endTime)}:00`;
    const formCheckAvailable = {
      rentalLocationId: rentalData?.data?.id,
      accommodationTypeId: accommodationTypeData?.data?.id,
      checkIn: checkInDateTime,
      checkOut: checkOutDateTime,
    };
    try {
      const response = await checkAvailable({
        data: formCheckAvailable,
      }).unwrap();
      if (response.isAvailable) {
        navigation.navigate("ConfirmBooking", {
          bookingData: {
            accommodationType: accommodationTypeData?.data,
            date: formatDate(selectedDate),
            time: formatTime(selectedTime),
            duration: selectedDuration,
            endTime: formatTime(endTime),
            endDate: formatDate(endTime),
            guests: guestCount,
            totalPrice: calculateTotalPrice(),
            rentalData: rentalData,
          },
        });
      } else {
        Alert.alert(t("sorry"), t("no_available_rooms"));
      }
    } catch (error) {
      Alert.alert(t("failed"), error.data?.message || t("booking_failed"));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BookingHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} bounces={true}>
          <View style={styles.content}>
            <View style={styles.cardSmallContainer}>
              <AccommodationInfo
                accommodationTypeData={accommodationTypeData}
                formatMoney={formatMoney}
                rentalData={rentalData}
                isOverNight={isOverNight}
              />
            </View>

            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              endTime={endTime}
              formatDate={formatDate}
              formatTime={formatTime}
              openDatePicker={openDatePicker}
              openTimePicker={openTimePicker}
              isDatePickerVisible={isDatePickerVisible}
              isTimePickerVisible={isTimePickerVisible}
              handleDateSelect={handleDateSelect}
              handleTimeSelect={handleTimeSelect}
              closeDatePicker={closeDatePicker}
              closeTimePicker={closeTimePicker}
            />

            <DurationSelector
              selectedDuration={selectedDuration}
              handleSelectDuration={handleSelectDuration}
              selectedTime={selectedTime}
              isOverNight={isOverNight}
              closingHour={CLOSING_HOUR}
              closingMinute={CLOSING_MINUTE}
            />

            <GuestSelector
              formatGuestCount={formatGuestCount}
              setGuestModalVisible={setGuestModalVisible}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BookingFooter
        navigation={navigation}
        formatMoney={formatMoney}
        calculateTotalPrice={calculateTotalPrice}
        handleContinue={handleContinue}
        isFormValid={isFormValid}
      />

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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardSmallContainer: {
    marginBottom: 20,
  },
});
