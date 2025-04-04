import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const DurationSelector = ({ selectedDuration, handleSelectDuration }) => {
  const durations = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <View>
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