"use client";

import { useState } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TicketCard from "./TicketCard";
import IconButton from "./IconButton";
import HelpModal from "./HelpModal";

const TicketScreen = ({
  onClose,
  isPasswordViewable = false,
  password = "",
  bookingData,
}) => {
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const handleHelpPress = () => {
    setHelpModalVisible(true);
  };

  const handleCloseHelp = () => {
    setHelpModalVisible(false);
  };

  if (!bookingData) {
    return (
      <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle="light-content" backgroundColor="#7B9EF0" />
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "#FFFFFF" }}>No booking data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="light-content" backgroundColor="#7B9EF0" />

      <View style={styles.content}>
        <View style={styles.header}>
          <IconButton
            name="help-circle"
            onPress={handleHelpPress}
            style={styles.helpButton}
          />
          <IconButton name="x" onPress={onClose} style={styles.closeButton} />
        </View>

        <TicketCard
          isPasswordViewable={isPasswordViewable}
          password={password}
          bookingData={bookingData}
        />
      </View>

      <HelpModal visible={helpModalVisible} onClose={handleCloseHelp} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B9EF0",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TicketScreen;
