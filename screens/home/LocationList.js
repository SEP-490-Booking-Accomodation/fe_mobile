import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import VerticalCard from "../../components/cards/VerticalCard";
import ButtonGroup from "../../components/buttons/ButtonGroup"; // Import ButtonGroup
import * as Location from "expo-location";

const filters = ["Tất cả", "Gợi ý ", "Yêu thích ", "Phổ biến ", "Gần bạn "];

export default function LocationList({ rentalData, onViewAllPress }) {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  // console.log(rentalData);
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // distance in km
  };

  const rentalDisplay = rentalData.data.map((item) => {
    const latitude = item.latitude;
    const longitude = item.longitude;

    const distance =
      userLocation && latitude && longitude
        ? getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            latitude,
            longitude
          )
        : null;

    return {
      id: item._id,
      imageUrl:
        item.image?.[0] ||
        `https://ui-avatars.com/api/?name=${item.name}&background=random`,
      openHour: item.openHour,
      closeHour: item.closeHour,
      placeName: item.name,
      isOverNight: item.isOverNight,
      status: item.status,
      minPrice: item.minPrice || 0,
      maxPrice: item.maxPrice || 0,
      address: item.address,
      ward: item.ward,
      district: item.district,
      city: item.city,
      location: `${item.address}, ${item.ward}, ${item.district}, ${item.city}`,
      ratingPoint: item.averageRating,
      numberOfReview: item.totalFeedbacks,
      distance: distance, // Thêm distance vào đây
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.jusSpace, styles.paddingVertical]}>
        <Text style={styles.h4}>Khám phá các thành phố</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      {/* ButtonGroup thay thế ScrollView filter */}
      <ButtonGroup
        items={filters}
        selectedIndex={selectedFilterIndex}
        onChange={setSelectedFilterIndex}
        containerStyle={styles.filterContainer}
        buttonStyle={styles.filterButton}
        activeButtonStyle={styles.selectedFilter}
        inactiveButtonStyle={styles.unselectedFilter}
        textStyle={styles.filterText}
        activeTextStyle={styles.selectedText}
        inactiveTextStyle={styles.unselectedText}
      />
      {/* //TODO: 1. Lấy list yêu thích từ async storage //Get list trong async
      storage rồi check lại với rentalData nếu rentalData có tồn tại trong async
      thì set initFavourite = true //Nếu không thì set initFavourite = false */}
      {/* Danh sách địa điểm */}
      <ScrollView style={styles.paddingVerticalCard}>
        {rentalDisplay.map((item) => (
          <VerticalCard
            key={item.id}
            {...item}
            onFavouritePress={(isFav) =>
              console.log(
                `Đã ${isFav ? "thêm" : "bỏ"} yêu thích:`,
                item.placeName
              )
            }
            onCardPress={() => onLocationPress(item._id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  filterContainer: {
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedFilter: {
    backgroundColor: "#3B82F6",
    borderColor: "transparent",
  },
  paddingVertical: { paddingHorizontal: 20 },
  paddingVerticalCard: { paddingHorizontal: 5 },
  unselectedFilter: {
    backgroundColor: "white",
    borderColor: "#E5E7EB",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedText: {
    color: "white",
  },
  unselectedText: {
    color: "#374151",
  },
  jusSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  h4: {
    fontSize: 18,
    fontWeight: "500",
  },
  viewAllText: { color: "#4E72E3", fontWeight: "600" },
});
