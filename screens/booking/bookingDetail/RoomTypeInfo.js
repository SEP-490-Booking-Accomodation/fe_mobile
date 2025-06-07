import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";
import { useTranslation } from "react-i18next";

export default function RoomTypeInfo({ typeRoom, password }) {
  const { t } = useTranslation();

  return (
    <InfoCard
      icon={<AntDesign name="home" size={20} color="#4E72E3" />}
      title={t("room_type")}
    >
      <View style={styles.container}>
        <InfoText style={styles.roomName}>
          {typeRoom?.name ?? t("no_info")}
        </InfoText>
        {typeRoom?.description && (
          <InfoSecondaryText style={styles.description}>
            {typeRoom.description}
          </InfoSecondaryText>
        )}
        {/* {password && (
          <InfoSecondaryText style={styles.password}>
            {t("password")}: {password}
          </InfoSecondaryText>
        )} */}
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roomName: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "#718096",
    fontSize: 14,
    lineHeight: 20,
  },
  password: {
    color: "#4A5568",
    fontSize: 14,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
});
