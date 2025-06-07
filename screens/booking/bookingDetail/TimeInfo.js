import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function TimeInfo({ bookingData }) {
  const { t } = useTranslation();
  return (
    <InfoCard 
      icon={<AntDesign name="clockcircle" size={20} color="#4E72E3" />} 
      title={t('rental_time')}
    >
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <InfoText style={styles.timeLabel}>{t('check_in')}:</InfoText>
          <InfoText style={styles.timeValue}>{bookingData.checkInHour}</InfoText>
        </View>
        
        <View style={styles.timeRow}>
          <InfoText style={styles.timeLabel}>{t('check_out')}:</InfoText>
          <InfoText style={styles.timeValue}>{bookingData.checkOutHour}</InfoText>
        </View>
        
        <View style={[styles.timeRow, styles.durationRow]}>
          <InfoText style={styles.timeLabel}>{t('rental_duration')}:</InfoText>
          <InfoText style={styles.timeValue}>
            {bookingData.durationBookingHour} {t('hours_text')}
          </InfoText>
        </View>
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  durationRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  timeLabel: {
    color: "#718096",
    fontSize: 14,
    fontWeight: "500",
  },
  timeValue: {
    color: "#2D3748",
    fontSize: 14,
    fontWeight: "600",
  },
});

