import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { InfoText, InfoSecondaryText } from "./InfoContent";
import { useTranslation } from 'react-i18next';

export default function LocationInfo({ rentalData }) {
  const { t } = useTranslation();
  const address = `${rentalData.address} ${rentalData.ward}, ${rentalData.district}, ${rentalData.city}`;

  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
  };
  
  return (
    <InfoCard 
      icon={<AntDesign name="enviromento" size={20} color="#4E72E3" />} 
      title={t('location')}
    >
      <TouchableOpacity style={styles.container} onPress={handleOpenMap}>
        <View style={styles.contentContainer}>
          <View style={styles.mainInfo}>
            <InfoText style={styles.name}>{rentalData.name}</InfoText>
            <InfoSecondaryText style={styles.address} numberOfLines={2}>
              {address}
            </InfoSecondaryText>
          </View>
          
          <View style={styles.iconContainer}>
            <AntDesign name="right" size={16} color="#4E72E3" />
          </View>
        </View>

        {/* <View style={styles.mapHint}>
          <AntDesign name="enviromento" size={14} color="#718096" />
          <InfoSecondaryText style={styles.mapText}>
            {t('view_on_map')}
          </InfoSecondaryText>
        </View> */}
      </TouchableOpacity>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: "#2D3748",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  address: {
    color: "#718096",
    fontSize: 14,
    lineHeight: 20,
  },
  // iconContainer: {
  //   width: 32,
  //   height: 32,
  //   backgroundColor: "#EDF2F7",
  //   borderRadius: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  mapHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  mapText: {
    color: "#718096",
    fontSize: 13,
    marginLeft: 6,
    fontStyle: "italic",
  },
});
