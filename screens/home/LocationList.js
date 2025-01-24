import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import HorizontalCardMedium from "../../components/cards/HorizontalCardMedium";
import VerticalCard from "../../components/cards/VerticalCard";
export default function LocationList() {
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");

  const filters = ["Tất cả", "Gợi ý", "Yêu thích", "Phổ biến", "Gần bạn"];
  // const filteredData = data.filter((item) => {
  //   if (selectedFilter === "Tất cả") return true;
  //   // Bạn có thể thêm các điều kiện lọc khác ở đây dựa trên loại bộ lọc
  //   if (selectedFilter === "Yêu thích") return item.name.includes("Yêu thích");
  //   if (selectedFilter === "Phổ biến") return item.name.includes("Phổ biến");
  //   if (selectedFilter === "Gần bạn") return item.location.includes("HCM");
  //   return false;
  // });

  return (
    <View>
      <View style={styles.jusSpace}>
        <Text style={styles.h4}>Khám phá các thành phố</Text>
        <TouchableOpacity>
          <Text>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <VerticalCard
        imageUrl={
          "https://media.vneconomy.vn/w800/images/upload/2021/10/10/bds5.png"
        }
        openHour={"3:00"}
        closeHour={"20:00"}
        placeName={"Nhà con nhộng Bình Thạnh giá rẻ"}
        minPrice={"300.000"}
        maxPrice={"1.200.000"}
        location={"Bình Thạnh, HCM"}
        ratingPoint={"5"}
        numberOfReview={"3.5k"}
        initFavourite={false}
        onFavouritePress={(isFav) => console.log("Yêu thích:", isFav)}
        onCardPress={() => console.log("Đã nhấn vào card")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  filterContainer: {
    // marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 10, // Khoảng cách giữa các nút
  },
  selectedFilter: {
    backgroundColor: "#4e72e3",
  },
  filterText: {
    color: "#000",
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  jusSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  h4: {
    fontSize: 18,
    fontWeight: 500,
  },
});
