import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import SearchField from "../search/SearchField";
import Dropdown from "../../components/DropDown";
import VerticalCard from "../../components/cards/VerticalCard";
import Filter from "../../components/Filter";
import { useGetAllRentalQuery } from "../../api/rentalLocationApi";

const SearchResult = ({ route, navigation }) => {
  const query = route?.params?.query || "";
  const { data: rental, refetch: refetchRental } = useGetAllRentalQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Giá từ thấp đến cao"
  );
  console.log(rental);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterParams, setFilterParams] = useState({
    priceRange: [100000, 100000000],
    selectedRating: null,
    selectedAmenities: [],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchRental();
    } catch (error) {
      console.error("Lỗi tải lại dữ liệu:", error);
    }
    setRefreshing(false);
  };

  const rentalDisplay = useMemo(() => {
    if (!rental?.data) return [];
    return rental.data.map((item) => ({
      id: item._id,
      imageUrl:
        item.image?.[0] ||
        `https://ui-avatars.com/api/?name=${item.name}&background=random`,
      openHour: item.openHour,
      closeHour: item.closeHour,
      placeName: item.name,
      isOverNight: item.isOverNight,
      // minPrice: item.minPrice,
      // maxPrice: item.maxPrice,
      address: item.address,
      ward: item.ward,
      district: item.district,
      city: item.city,
      status: item.status,
      location: `${item.address}, ${item.ward}, ${item.district}, ${item.city}`,
      // ratingPoint: item.ratingPoint,
      // numberOfReview: item.numberOfReview,
      // amenities: item.amenities || [],
    }));
  }, [rental]);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = rentalDisplay;

    if (query) {
      filteredData = filteredData.filter(
        (item) =>
          item.placeName.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // filteredData = filteredData.filter(
    //   (item) =>
    //     item.minPrice >= filterParams.priceRange[0] &&
    //     item.minPrice <= filterParams.priceRange[1]
    // );

    if (filterParams.selectedRating !== null) {
      filteredData = filteredData.filter(
        (item) => item.ratingPoint === filterParams.selectedRating
      );
    }

    if (filterParams.selectedAmenities.length > 0) {
      filteredData = filteredData.filter((item) =>
        filterParams.selectedAmenities.every((amenity) =>
          item.amenities.includes(amenity)
        )
      );
    }

    return filteredData.sort((a, b) =>
      selectedSortOption === "Giá từ thấp đến cao"
        ? a.minPrice - b.minPrice
        : b.minPrice - a.minPrice
    );
  }, [query, selectedSortOption, rentalDisplay, filterParams]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchField
        style={styles.mh}
        placeholder="Tìm kiếm điểm đến của bạn"
        onPressBack={() => navigation.goBack()}
        // onBackHome={() => navigation.}
        onPressFilterIcon={() => setIsFilterVisible(true)}
        value={query}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.textSort}>Sắp xếp theo</Text>
        <Dropdown
          data={["Giá từ thấp đến cao", "Giá từ cao đến thấp"]}
          selectedValue={selectedSortOption}
          onSelect={setSelectedSortOption}
          placeholder="Chọn cách sắp xếp"
          style={styles.dropdown}
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAndSortedData.length === 0 && query ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>
              Không có kết quả tìm kiếm phù hợp!
            </Text>
          </View>
        ) : (
          filteredAndSortedData.map((item) => (
            <VerticalCard
              key={item.id}
              imageUrl={item.imageUrl}
              openHour={item.openHour}
              closeHour={item.closeHour}
              placeName={item.placeName}
              minPrice={String(item.minPrice)}
              maxPrice={String(item.maxPrice)}
              isOverNight={item.isOverNight}
              location={item.location}
              status={item.status}
              ratingPoint={String(item.ratingPoint)}
              numberOfReview={item.numberOfReview}
              initFavourite={false}
              onFavouritePress={(isFav) => console.log("Yêu thích:", isFav)}
              onCardPress={() => console.log("Đã nhấn vào card")}
            />
          ))
        )}
      </ScrollView>

      <Filter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={setFilterParams}
      />
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
    paddingBottom: 10,
  },
});

export default SearchResult;
