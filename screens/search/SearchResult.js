import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import SearchField from "../search/SearchField";
import Dropdown from "../../components/DropDown"; // Import Dropdown component
import VerticalCard from "../../components/cards/VerticalCard";
import { dataCC } from "./data"; // Adjust path as needed

const SearchResult = ({ route, navigation }) => {
  const { query } = route.params;
  const [data, setData] = useState(dataCC); // Assume this data comes from an API or static list
  const [sortedData, setSortedData] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Giá từ thấp đến cao"
  );
  const [isNoResult, setIsNoResult] = useState(false); // Track if there are no results

  useEffect(() => {
    // Hàm lọc dữ liệu dựa trên từ khóa tìm kiếm
    const filterData = () => {
      const filtered = data.filter(
        (item) =>
          item.placeName.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    };

    // Lọc và sắp xếp lại dữ liệu sau khi thay đổi query hoặc sortOption
    const filteredData = filterData();
    if (filteredData.length === 0) {
      setIsNoResult(true); // Nếu không có kết quả, hiển thị thông báo không có kết quả
    } else {
      setIsNoResult(false); // Có kết quả tìm thấy
    }

    const sorted = filteredData.sort((a, b) =>
      selectedSortOption === "Giá từ thấp đến cao"
        ? a.minPrice - b.minPrice
        : b.minPrice - a.minPrice
    );

    setSortedData(sorted);
  }, [query, selectedSortOption, data]);

  const handleSortChange = (option) => {
    setSelectedSortOption(option); // Cập nhật giá trị sắp xếp
  };

  const renderCard = ({ item }) => (
    <VerticalCard
      imageUrl={item.imageUrl}
      openHour="18:00"
      closeHour="20:00"
      placeName={item.placeName}
      minPrice={String(item.minPrice)} // Chuyển minPrice thành string
      maxPrice={String(item.maxPrice)} // Chuyển maxPrice thành string
      location={item.location}
      ratingPoint={String(item.ratingPoint)} // Chuyển ratingPoint thành string
      numberOfReview={item.numberOfReview}
      initFavourite={false}
      onFavouritePress={(isFav) => console.log("Yêu thích:", isFav)}
      onCardPress={() => console.log("Đã nhấn vào card")}
    />
  );

  const sortOptions = ["Giá từ thấp đến cao", "Giá từ cao đến thấp"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <SearchField
          style={styles.mh}
          placeholder="Tìm kiếm điểm đến của bạn"
          onPressBackIcon={() => navigation.goBack()}
          value={query}
        />
      </View>

      {/* Dropdown for sorting */}
      <View style={styles.sortContainer}>
        <Text style={styles.textSort}>Sắp xếp theo</Text>
        <Dropdown
          data={sortOptions}
          selectedValue={selectedSortOption}
          onSelect={handleSortChange}
          placeholder="Chọn cách sắp xếp"
          style={styles.dropdown}
        />
      </View>

      {/* Display "no result" message if no data found */}
      {isNoResult ? (
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultText}>
            Không có kết quả tìm kiếm phù hợp!
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedData.length > 0 ? sortedData : data}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mh: {
    marginHorizontal: 10,
    marginVertical: 10,
  },

  dropdown: {
    // marginVertical: 10,
    // width: 300,
    zIndex: 999,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultText: {
    fontSize: 18,
    color: "gray",
  },
  textSort: {
    fontSize: 16,
    color: "#4E72E3",
  },
  sortContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});

export default SearchResult;
