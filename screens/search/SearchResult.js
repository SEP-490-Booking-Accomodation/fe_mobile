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
import * as Location from "expo-location";

const SearchResult = ({ route, navigation }) => {
  const query = route?.params?.query || "";
  const [userLocation, setUserLocation] = useState(null);

  const { data: rental, refetch: refetchRental } = useGetAllRentalQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Giá từ thấp đến cao"
  );

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

    return rental.data
    .filter((item) => item.status === 3)
    .map((item) => {
      console.log(item.latitude);
      console.log(item.longitude);

      const distance =
        userLocation && item.latitude && item.longitude
          ? getDistanceFromLatLonInKm(
              userLocation.latitude,
              userLocation.longitude,
              item.latitude, // latitude
              item.longitude // longitude
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
        distance: distance,
      };
    });
  }, [rental, userLocation]);

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

    return filteredData.sort((a, b) => {
      if (selectedSortOption === "Giá từ thấp đến cao") {
        return a.minPrice - b.minPrice;
      } else if (selectedSortOption === "Giá từ cao đến thấp") {
        return b.minPrice - a.minPrice;
      } else if (selectedSortOption === "Gần bạn nhất") {
        return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      }
      return 0;
    });
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
          data={["Giá từ thấp đến cao", "Giá từ cao đến thấp", "Gần bạn nhất"]}
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
          filteredAndSortedData.map((item) => {
            console.log(
              "Khoảng cách đến",
              item.placeName,
              "là:",
              item.distance
            );
            return (
              <VerticalCard
                key={item.id}
                {...item}
                initFavourite={false}
                onFavouritePress={(isFav) => console.log("Yêu thích:", isFav)}
                onCardPress={() => console.log("Đã nhấn vào card")}
              />
            );
          })
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
