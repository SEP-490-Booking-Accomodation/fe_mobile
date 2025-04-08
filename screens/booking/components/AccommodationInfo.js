import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const AccommodationInfo = ({
  accommodationTypeData,
  formatMoney,
  rentalData,
  isOverNight,
}) => {
  if (!accommodationTypeData?.data) return null;
  const loadingGif = "https://i.gifer.com/XOsX.gif";
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải ảnh
  console.log(rentalData);

  return (
    <View style={styles.typeInfoContainer}>
      {isLoading && (
        <Image
          source={{ uri: loadingGif }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Image
        source={{
          uri: accommodationTypeData?.data?.image?.[0],
        }}
        style={styles.mainImage}
        resizeMode="contain"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Nếu lỗi, ẩn GIF
      />

      <Text style={styles.typeName}>{accommodationTypeData?.data?.name}</Text>
      <Text style={styles.infoText}>
        {rentalData?.data.openHour} - {rentalData?.data.closeHour}
      </Text>
      <Text style={styles.infoText}>
        Số người tối đa: {accommodationTypeData?.data?.maxPeopleNumber}
      </Text>
      <Text style={styles.infoText}>
        Giá giờ đầu: {formatMoney(accommodationTypeData?.data?.basePrice)} / giờ
      </Text>
      <Text style={styles.infoText}>
        Giá giờ tiếp theo:{" "}
        {formatMoney(accommodationTypeData?.data?.overtimeHourlyPrice)} / giờ
      </Text>
      {isOverNight && (
        <Text style={styles.specialTag}>Cho phép đặt qua đêm</Text>
      )}
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
