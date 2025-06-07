import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InfoCard from "./InfoCard";
import { InfoText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function NoteInfo({ note }) {
  const { t } = useTranslation();
  if (!note) return null;

  return (
    <InfoCard
      icon={<AntDesign name="filetext1" size={20} color="#4E72E3" />}
      title={t("note")}
    >
      <View style={styles.noteContainer}>
        <InfoText style={styles.noteText}>{note}</InfoText>
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  noteText: {
    color: "#2D3748",
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
});

