import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import SearchField from "../search/SearchField";
import Dropdown from "../../components/DropDown";
import VerticalCard from "../../components/cards/VerticalCard";
import Filter from "../../components/Filter"; // Import Filter component
import { dataCC } from "./data";
// import BottomTabs from "../../components/BottomTabs";

const SearchResult = ({ route, navigation }) => {
  const { query } = route.params;
  const [data, setData] = useState(dataCC);
  const [sortedData, setSortedData] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Giá từ thấp đến cao"
  );
  const [isNoResult, setIsNoResult] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State quản lý modal filter
  const [filterParams, setFilterParams] = useState({
    priceRange: [100000, 100000000],
    selectedRating: null,
    selectedAmenities: [],
  });

  useEffect(() => {
    const filterData = () => {
      const filtered = data.filter((item) => {
        const matchesQuery =
          item.placeName.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase());

        const matchesPrice =
          item.minPrice >= filterParams.priceRange[0] &&
          item.minPrice <= filterParams.priceRange[1];

        const matchesRating =
          filterParams.selectedRating === null ||
          item.ratingPoint === filterParams.selectedRating;

        const matchesAmenities =
          filterParams.selectedAmenities.length === 0 ||
          filterParams.selectedAmenities.every((amenity) =>
            item.amenities.includes(amenity)
          );

        return (
          matchesQuery && matchesPrice && matchesRating && matchesAmenities
        );
      });

      return filtered;
    };

    const filteredData = filterData();
    if (filteredData.length === 0) {
      setIsNoResult(true);
    } else {
      setIsNoResult(false);
    }

    const sorted = filteredData.sort((a, b) =>
      selectedSortOption === "Giá từ thấp đến cao"
        ? a.minPrice - b.minPrice
        : b.minPrice - a.minPrice
    );

    setSortedData(sorted);
  }, [query, selectedSortOption, data, filterParams]);

  const handleSortChange = (option) => {
    setSelectedSortOption(option);
  };

  const handleApplyFilter = (filters) => {
    setFilterParams(filters);
    setIsFilterVisible(false);
  };

  const renderCard = ({ item }) => (
    <VerticalCard
      imageUrl={item.imageUrl}
      openHour="18:00"
      closeHour="20:00"
      placeName={item.placeName}
      minPrice={String(item.minPrice)}
      maxPrice={String(item.maxPrice)}
      location={item.location}
      ratingPoint={String(item.ratingPoint)}
      numberOfReview={item.numberOfReview}
      initFavourite={false}
      onFavouritePress={(isFav) => console.log("Yêu thích:", isFav)}
      onCardPress={() => console.log("Đã nhấn vào card")}
    />
  );

  const sortOptions = ["Giá từ thấp đến cao", "Giá từ cao đến thấp"];

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <SearchField
          style={styles.mh}
          placeholder="Tìm kiếm điểm đến của bạn"
          onPressBackIcon={() => navigation.goBack()}
          onPressFilterIcon={() => setIsFilterVisible(true)} // Hiển thị modal filter
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
          numColumns={1} // Nếu không cần dạng lưới, để mặc định là 1
        />
      )}

      {/* Filter modal */}
      <Filter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilter}
      />
      {/* <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomTabs navigation={navigation} />
      </View> */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});

export default SearchResult;
