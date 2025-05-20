"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ReportModal from "../modals/ReportModal"; // Adjust the import path as necessary

export default function BookingHeader({
  rentalName = "",
  bookingId = "",
  accommodationType = "",
  roomNo = "",
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const handleReportPress = () => {
    setReportModalVisible(true);
  };

  const handleReportSubmit = (reportData) => {
    console.log("Report submitted:", reportData);
    // Here you would typically send the report to your backend
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("TicketList")}
        >
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>{t("booking_details")}</Text>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReportPress}
        >
          <MaterialIcons name="report-problem" size={24} color="#4e72e3" />
        </TouchableOpacity>
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
        t={t}
        rentalName={rentalName}
        bookingId={bookingId}
        accommodationType={accommodationType}
        roomNo={roomNo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
  },
  reportButton: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
