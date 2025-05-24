import { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Keyboard } from "react-native";
import SearchField from "../search/SearchField";
import Dropdown from "../../components/DropDown";
import VerticalCard from "../../components/cards/VerticalCard";
import Filter from "../../components/Filter";
import { useGetAllRentalQuery } from "../../api/rentalLocationApi";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

const SearchResult = ({ route, navigation }) => {
  const { t } = useTranslation();
  const initialQuery = route?.params?.query || "";
  const [searchText, setSearchText] = useState(initialQuery);
  const [userLocation, setUserLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(!!initialQuery);
  const [appliedFilterParams, setAppliedFilterParams] = useState(null);

  const { data: rental, refetch: refetchRental } = useGetAllRentalQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(t("price_low_to_high"));

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log(t("location_permission_denied"));
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
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchRental();
    } catch (error) {
      console.error(t("data_refresh_error"), error);
    }
    setRefreshing(false);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    setIsSearching(false);
  };

  const handleSearchSubmit = () => {
    setAppliedFilterParams(null);
    setIsSearching(true);
    Keyboard.dismiss();
  };

  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    return Number.parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
  };

  const rentalDisplay = useMemo(() => {
    if (!rental?.data) return [];

    return rental.data
      .filter((item) => item.status === 3)
      .map((item) => {
        const distance =
          userLocation && item.latitude && item.longitude
            ? getDistanceFromLatLonInKm(
              userLocation.latitude,
              userLocation.longitude,
              item.latitude,
              item.longitude
            )
            : null;

        return {
          id: item._id,
          imageUrl: item.image?.[0] || `https://ui-avatars.com/api/?name=${item.name}&background=random`,
          openHour: item.openHour,
          closeHour: item.closeHour,
          placeName: item.name,
          isOverNight: item.isOverNight,
          status: item.status,
          minPrice: parsePrice(item.minPrice),
          maxPrice: parsePrice(item.maxPrice),
          address: item.address,
          ward: item.ward,
          district: item.district,
          city: item.city,
          location: `${item.address}, ${item.ward}, ${item.district}, ${item.city}`,
          ratingPoint: item.averageRating || 0,
          numberOfReview: item.totalFeedbacks,
          distance: distance,
          amenities: item.amenities || [],
        };
      });
  }, [rental, userLocation]);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = rentalDisplay;

    filteredData = filteredData.filter((item) => {
      const searchMatch = !isSearching ||
        item.placeName.toLowerCase().includes(searchText.toLowerCase());

      const filterMatch = appliedFilterParams
        ? (() => {
          const priceInRange =
            (item.minPrice >= appliedFilterParams.priceRange[0] &&
              item.minPrice <= appliedFilterParams.priceRange[1]) ||
            (item.maxPrice >= appliedFilterParams.priceRange[0] &&
              item.maxPrice <= appliedFilterParams.priceRange[1]) ||
            (item.minPrice <= appliedFilterParams.priceRange[0] &&
              item.maxPrice >= appliedFilterParams.priceRange[1]);

          const ratingMatch = appliedFilterParams.selectedRating !== null
            ? (item.ratingPoint || 0) >= (appliedFilterParams.selectedRating + 0.1)
            : true;

          const amenitiesMatch = appliedFilterParams.selectedAmenities.length > 0
            ? appliedFilterParams.selectedAmenities.every((amenity) =>
              item.amenities.includes(amenity)
            )
            : true;

          return priceInRange && ratingMatch && amenitiesMatch;
        })()
        : true;

      return searchMatch && filterMatch;
    });

    return filteredData.sort((a, b) => {
      if (selectedSortOption === t("price_low_to_high")) {
        return a.minPrice - b.minPrice;
      } else if (selectedSortOption === t("price_high_to_low")) {
        return b.minPrice - a.minPrice;
      } else if (selectedSortOption === t("nearest_you")) {
        return (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY);
      }
      return 0;
    });
  }, [searchText, isSearching, selectedSortOption, rentalDisplay, appliedFilterParams]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchField
        style={styles.mh}
        placeholder="search_destination"
        onPressBackIcon={() => navigation.goBack()}
        onPressFilterIcon={() => setIsFilterVisible(true)}
        value={searchText}
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchSubmit}
        enableSearch={true}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.textSort}>{t("sort_by")}</Text>
        <Dropdown
          data={[t("price_low_to_high"), t("price_high_to_low"), t("nearest_you")]}
          selectedValue={selectedSortOption}
          onSelect={setSelectedSortOption}
          placeholder={t("select_sort_method")}
          style={styles.dropdown}
        />
      </View>

      <ScrollView style={styles.padding} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredAndSortedData.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>
              {isSearching ? `${t("no_results_for")} "${searchText}"` : t("no_search_results")}
            </Text>
          </View>
        ) : (
          <>
            {isSearching && searchText && (
              <Text style={styles.searchResultsTitle}>
                {t("search_results_for")} "{searchText}"
                {appliedFilterParams && ` • ${t("filter_applied")}`}
                ({filteredAndSortedData.length})
              </Text>
            )}
            {filteredAndSortedData.map((item) => (
              <VerticalCard
                key={item.id}
                {...item}
                initFavourite={false}
                onFavouritePress={(isFav) => console.log(t("favorite_status"), isFav)}
                onCardPress={() => navigation.navigate("RentalDetail", { id: item.id })}
              />
            ))}
          </>
        )}
      </ScrollView>

      <Filter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(params) => {
          setAppliedFilterParams(params);
          setIsFilterVisible(false);
        }}
        rentalLocations={rental?.data || []}
        appliedFilters={appliedFilterParams}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  padding: { paddingHorizontal: 5 },
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
    marginTop: 50,
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
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

export default SearchResult;