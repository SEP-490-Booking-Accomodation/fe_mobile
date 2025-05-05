import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";

const DurationSelector = ({
  selectedTime,
  selectedDuration,
  handleSelectDuration,
  isOverNight,
  closingHour,
  closingMinute,
}) => {
  const { t } = useTranslation(); 
  const [availableDurations, setAvailableDurations] = useState([]);

  useEffect(() => {
    if (isOverNight) {
      // For overnight stays, allow durations up to 24 hours
      setAvailableDurations([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24]);
      return;
    }

    // If no time is selected, show durations from 1 to 12
    if (!selectedTime) {
      setAvailableDurations(Array.from({ length: 12 }, (_, i) => i + 1));
      return;
    }

    // For regular bookings, calculate the remaining hours until closing
    const remainingHours = calculateRemainingHours(selectedTime);
    const maxDuration = Math.max(1, Math.floor(remainingHours));

    setAvailableDurations(
      Array.from({ length: Math.min(maxDuration, 12) }, (_, i) => i + 1)
    );
  }, [selectedTime, isOverNight]);

  // Calculate the remaining hours until closing time
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

  const isDurationValid = (hour) => {
    if (isOverNight || !selectedTime) return true;

    const utcDate = new Date(selectedTime);
    const localDate = new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
    );

    const endTime = new Date(localDate);
    endTime.setHours(endTime.getHours() + hour);

    return (
      endTime.getHours() < closingHour ||
      (endTime.getHours() === closingHour &&
        endTime.getMinutes() <= closingMinute)
    );
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>{t("usage_duration")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.durationScrollView}
      >
        {availableDurations
          .filter(isDurationValid)
          .map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.durationButton,
                selectedDuration === hour && styles.selectedDurationButton,
                hour === 24 && styles.overnightButton,
              ]}
              onPress={() => handleSelectDuration(hour)}
            >
              <Text
                style={[
                  styles.durationText,
                  selectedDuration === hour && styles.selectedDurationText,
                ]}
              >
                {hour === 24 
                  ? t("overnight") 
                  : t("hours", { count: hour })}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
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
});

export default DurationSelector;
