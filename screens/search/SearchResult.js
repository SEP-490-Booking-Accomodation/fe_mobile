import { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Keyboard } from "react-native";
import SearchField from "../search/SearchField";
import Dropdown from "../../components/DropDown";
import VerticalCard from "../../components/cards/VerticalCard";
import Filter from "../../components/Filter";
import { useGetAllRentalQuery, useGetRentalLocationByIdQuery } from "../../api/rentalLocationApi";
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

    console.log('Total rentals from API:', rental.data.length);

    return rental.data
      .filter((item) => item.status === 3 && item.accommodationTypeIds && item.accommodationTypeIds.length > 0)
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

        // Extract all services from accommodationTypeIds
        const services = item.accommodationTypeIds?.reduce((acc, type) => {
          console.log('Processing accommodationType in Search:', type);
          if (type.serviceIds && Array.isArray(type.serviceIds)) {
            type.serviceIds.forEach(service => {
              console.log('Service found in Search:', service);
              if (service.name) {
                acc.add(service.name);
              }
            });
          }
          return acc;
        }, new Set());

        console.log('Extracted services for rental', item._id, ':', Array.from(services));

        // Calculate if the location is open
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const [openHourValue, openMinuteValue] = (item.openHour || "08:00").split(":").map(Number);
        const [closeHourValue, closeMinuteValue] = (item.closeHour || "22:00").split(":").map(Number);

        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const openTimeInMinutes = openHourValue * 60 + openMinuteValue;
        const closeTimeInMinutes = closeHourValue * 60 + closeMinuteValue;

        let isOpen = item.isOverNight ? true : false;
        if (!item.isOverNight) {
          if (closeTimeInMinutes < openTimeInMinutes) {
            isOpen = currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
          } else {
            isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
          }
        }

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
          isOpen: isOpen,
          services: Array.from(services),
          accommodationTypeIds: item.accommodationTypeIds
        };
      });
  }, [rental, userLocation]);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = rentalDisplay;

    console.log('Initial data count:', filteredData.length);

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
            ? (() => {
                const rating = parseFloat(item.ratingPoint || '0');
                const ratingRanges = [
                  { min: 0, max: 1 },
                  { min: 1, max: 2 },
                  { min: 2, max: 3 },
                  { min: 3, max: 4 },
                  { min: 4, max: 5 }
                ];
                const selectedRange = ratingRanges[appliedFilterParams.selectedRating];
                return rating >= selectedRange.min && rating <= selectedRange.max;
              })()
            : true;

          let hasSelectedServices = true;
          if (appliedFilterParams.selectedAmenities && appliedFilterParams.selectedAmenities.length > 0) {
            console.log('Selected amenities in Search:', appliedFilterParams.selectedAmenities);
            console.log('Item services:', item.services);
            hasSelectedServices = appliedFilterParams.selectedAmenities.every(amenity => {
              const hasService = item.services.includes(amenity);
              console.log(`Checking amenity ${amenity} in Search: ${hasService}`);
              return hasService;
            });
          }

          return priceInRange && ratingMatch && hasSelectedServices;
        })()
        : true;

      return searchMatch && filterMatch;
    });

    console.log('Filtered data count:', filteredData.length);

    // Sort by open/closed status first, then by the selected sort option
    return filteredData.sort((a, b) => {
      // First sort by open/closed status
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;

      // Then apply the selected sort option
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
                onCardPress={() => {
                  navigation.navigate("DetailRentalLocation", { 
                    rentalId: item.id
                  });
                }}
                disabled={!item.isOpen}
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