import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import VerticalCard from "../../components/cards/VerticalCard";
import ButtonGroup from "../../components/buttons/ButtonGroup";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import { useNavigation } from "@react-navigation/native";

// Default placeholder image URL
const DEFAULT_AVATAR_URL =
  "https://ui-avatars.com/api/?background=random&color=fff&size=200&font-size=0.5";

export default function LocationList({
  rentalData,
  onViewAllPress,
  navigation: propNavigation, // Rename to avoid conflict
}) {
  const { t } = useTranslation();
  const { isFavorite } = useAsyncStorage();
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredRentals, setFilteredRentals] = useState([]);

  // Get navigation from hook if not provided as prop
  const hookNavigation = useNavigation();
  const navigation = propNavigation || hookNavigation;

  // Define filters
  const filters = [
    t("all"),
    t("nearby"),
    t("favorite"),
    t("top_rated"),
    t("recent"),
  ];

  // Get user's current location
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

  // Calculate distance from user location to a place
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

  // Process rental data
  const processRentalData = () => {
    if (!rentalData || !rentalData.data) return [];

    return rentalData.data
      .filter((item) => item.status === 3)
      .map((item) => {
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

        const itemId = item._id;

        // Process image URL
        let imageUrl;
        if (item.image && item.image.length > 0 && item.image[0]) {
          imageUrl = item.image[0];
        } else {
          // Create a placeholder with the name
          imageUrl = `${DEFAULT_AVATAR_URL}&name=${encodeURIComponent(
            item.name || "Unknown"
          )}`;
        }

        return {
          id: itemId,
          imageUrl: imageUrl,
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
          ratingPoint: item.averageRating || 0,
          numberOfReview: item.totalFeedbacks || 0,
          distance: distance,
          latitude: latitude,
          longitude: longitude,
        };
      });
  };

  // Filter rentals based on selected filter
  useEffect(() => {
    const rentalList = processRentalData();
    let filtered;

    switch (selectedFilterIndex) {
      case 0: // All
        filtered = rentalList;
        break;
      case 1: // Nearby
        filtered = rentalList
          .filter((item) => item.distance !== null)
          .sort((a, b) => a.distance - b.distance);
        break;
      case 2: // Favorite
        filtered = rentalList.filter(
          (item) => isFavorite && isFavorite(item.id)
        );
        break;
      case 3: // Top rated
        filtered = rentalList
          .filter((item) => item.ratingPoint > 0)
          .sort((a, b) => b.ratingPoint - a.ratingPoint);
        break;
      case 4: // Recent
        filtered = rentalList.sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()) -
            new Date(a.createdAt || Date.now())
        );
        break;
      default:
        filtered = rentalList;
    }

    setFilteredRentals(filtered.slice(0, 5)); // Only take first 5 results
  }, [selectedFilterIndex, rentalData, userLocation, isFavorite]);

  // Handle card press - FIXED to work with your navigation structure
  const onLocationPress = (id) => {
    try {
      if (navigation) {
        // Navigate to DetailRentalLocation screen with the rental ID
        console.log("Navigating to DetailRentalLocation with rentalId:", id);

        // Based on your AppStack.js, this screen is in the HomeStack
        navigation.navigate("DetailRentalLocation", { rentalId: id });
      } else {
        console.log("Navigation is not available");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.jusSpace, styles.paddingVertical]}>
        <Text style={styles.h4}>{t("explore_cities")}</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>{t("view_all")}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter ButtonGroup */}
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

      {/* Location list */}
      <ScrollView style={styles.paddingVerticalCard}>
        {filteredRentals.length > 0 ? (
          filteredRentals.map((item) => (
            <VerticalCard
              key={item.id}
              {...item}
              onCardPress={() => {
                console.log("Card pressed for item:", item.id);
                onLocationPress(item.id);
              }}
            />
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{t("no_data_available")}</Text>
          </View>
        )}
      </ScrollView>

      {/* View All button at the bottom */}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
        <Text style={styles.viewAllButtonText}>{t("view_all")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flex: 1,
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
  paddingVerticalCard: {
    paddingHorizontal: 5,
    flex: 1,
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
  viewAllText: {
    color: "#4E72E3",
    fontWeight: "600",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
  },
  viewAllButton: {
    backgroundColor: "#4E72E3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  viewAllButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
