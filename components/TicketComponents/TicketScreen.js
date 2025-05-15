import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TicketCard from "./TicketCard";
import IconButton from "./IconButton";
import HelpModal from "./HelpModal";

const TicketScreen = ({
  mode = "show-password",
  onShowPassword,
  onHidePassword,
  onClose,
  password = "TDOXPLAR20103",
}) => {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleHelpPress = () => {
    setHelpModalVisible(true);
  };

  const handleCloseHelp = () => {
    setHelpModalVisible(false);
  };

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
          mode={mode}
          onShowPassword={onShowPassword}
          onHidePassword={onHidePassword}
          password={password}
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
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default TicketScreen;
