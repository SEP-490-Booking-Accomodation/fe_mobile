import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {useGetAccommodationTypeByIdQuery} from "../../../api/accommodationTypeApi"
const AccommodationInfo = ({
  accommodationTypeData,
  formatMoney,
  rentalData,
  isOverNight,
}) => {

  const {data: accommodationTypeDataApi} = useGetAccommodationTypeByIdQuery(accommodationTypeData?.data?.id);
  const { t } = useTranslation();
  if (!accommodationTypeData?.data) return null;
  const loadingGif = "https://i.gifer.com/WMDx.gif";
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải ảnh
  const imageReplace = accommodationTypeDataApi?.data?.image?.[0] || accommodationTypeData?.data?.image?.[0];
  return (
    <View style={styles.typeInfoContainer}>
      <Image
        source={{ uri: accommodationTypeData?.data?.image?.[0] || imageReplace}}
        style={styles.mainImage}
        resizeMode="contain"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Text style={styles.typeName}>{accommodationTypeData?.data?.name}</Text>
        {isOverNight && (
          <Text style={styles.specialTag}>{t("allow_overnight_booking")}</Text>
        )}
      </View>
      <Text style={styles.infoText}>
        {rentalData?.data.openHour} - {rentalData?.data.closeHour}
      </Text>
      <Text style={styles.infoText}>
        {t("max_people_count", {
          count: accommodationTypeData?.data?.maxPeopleNumber
        })}
      </Text>
      <Text style={styles.infoText}>
        {t("base_price", {
          price: formatMoney(accommodationTypeData?.data?.basePrice),
          unit: t("hour")
        })}
      </Text>
      <Text style={styles.infoText}>
        {t("overtime_price_unit", {
          price: formatMoney(accommodationTypeData?.data?.overtimeHourlyPrice),
          unit: t("hour") 
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typeInfoContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  typeName: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  mainImage: {
    borderRadius: 10,
    height: 150,
    width: "100%",
    objectFit: "cover",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  specialTag: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#333",
  },
});

export default AccommodationInfo;
