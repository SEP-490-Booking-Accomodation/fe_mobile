import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import TicketScreen from "../../components/TicketComponents/TicketScreen";

const TicketDetail = ({ route, navigation }) => {
  const [mode, setMode] = useState("checked-in"); // 'checked-in', 'show-password', 'not-checked-in', 'help'

  // You can get ticket data from route params
  // const { ticketData } = route.params;

  const handleHelpPress = () => {
    setMode("help");
  };

  const handleCloseHelp = () => {
    setMode("checked-in");
  };

  const handleShowPassword = () => {
    setMode("show-password");
  };

  const handleHidePassword = () => {
    setMode("checked-in");
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <TicketScreen
        mode={mode}
        onHelpPress={handleHelpPress}
        onShowPassword={handleShowPassword}
        onHidePassword={handleHidePassword}
        onClose={handleClose}
        password="TDOXPLAR20103"
      />
    </SafeAreaView>
  );
};

export default TicketDetail;
