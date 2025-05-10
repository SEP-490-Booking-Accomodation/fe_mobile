import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next'; 

export default function BookingHeader() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>{t('booking_details')}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
