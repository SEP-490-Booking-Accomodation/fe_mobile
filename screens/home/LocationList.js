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

const locations = [
  {
    id: 1,
    imageUrl:
      "https://media.vneconomy.vn/w800/images/upload/2021/10/10/bds5.png",
    openHour: "3:00",
    closeHour: "20:00",
    placeName: "Nhà con nhộng Bình Thạnh giá rẻ",
    minPrice: "300.000",
    maxPrice: "1.200.000",
    location: "Bình Thạnh, HCM",
    ratingPoint: "5",
    numberOfReview: "3.5k",
    initFavourite: false,
  },
  {
    id: 2,
    imageUrl:
      "https://media.vneconomy.vn/w800/images/upload/2021/10/10/bds5.png",
    openHour: "5:00",
    closeHour: "22:00",
    placeName: "Khách sạn view biển đẹp",
    minPrice: "500.000",
    maxPrice: "2.000.000",
    location: "Vũng Tàu",
    ratingPoint: "4.7",
    numberOfReview: "1.2k",
    initFavourite: true,
  },
];

export default function LocationList() {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.jusSpace}>
        <Text style={styles.h4}>Khám phá các thành phố</Text>
        <TouchableOpacity>
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

      {/* Danh sách địa điểm */}
      <ScrollView style={{ marginTop: 10 }}>
        {locations.map((item) => (
          <VerticalCard
            key={item.id}
            {...item}
            onFavouritePress={(isFav) =>
              console.log(
                `Đã ${isFav ? "thêm" : "bỏ"} yêu thích:`,
                item.placeName
              )
            }
            onCardPress={() => console.log("Đã nhấn vào card:", item.placeName)}
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
