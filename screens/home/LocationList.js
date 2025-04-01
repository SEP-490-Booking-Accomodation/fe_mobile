import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import VerticalCard from "../../components/cards/VerticalCard";
import ButtonGroup from "../../components/buttons/ButtonGroup"; // Import ButtonGroup

const filters = ["Tất cả", "Gợi ý ", "Yêu thích ", "Phổ biến ", "Gần bạn "];

export default function LocationList({ rentalData, onViewAllPress }) {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  // console.log(rentalData);

  const rentalDisplay = rentalData.data.map((item) => ({
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
  }));

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
