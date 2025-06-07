import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function GuestsInfo({ adultNumber, childNumber }) {
  const { t } = useTranslation();
  return (
    <InfoCard 
      icon={<AntDesign name="team" size={20} color="#4E72E3" />} 
      title={t('guests')}
    >
      <View style={styles.container}>
        <View style={styles.guestRow}>
          <View style={styles.guestType}>
            <View style={styles.iconContainer}>
              <AntDesign name="user" size={16} color="#4E72E3" />
            </View>
            <InfoText style={styles.guestLabel}>{t('adults')}</InfoText>
          </View>
          <InfoText style={styles.guestCount}>{adultNumber}</InfoText>
        </View>

        <View style={styles.separator} />

        <View style={styles.guestRow}>
          <View style={styles.guestType}>
            <View style={styles.iconContainer}>
              <AntDesign name="user" size={14} color="#4E72E3" />
            </View>
            <InfoText style={styles.guestLabel}>{t('children')}</InfoText>
          </View>
          <InfoText style={styles.guestCount}>{childNumber}</InfoText>
        </View>
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  guestType: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F7FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  guestLabel: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "500",
  },
  guestCount: {
    color: "#4E72E3",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#EDF2F7",
  },
});
