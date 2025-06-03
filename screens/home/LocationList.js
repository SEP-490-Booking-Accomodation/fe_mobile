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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationList({
  rentalData,
  onViewAllPress,
  navigation,
}) {
  const { t } = useTranslation();
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);

  // Định nghĩa filter
  const filters = [
    t("all"),
    t("nearby"),
    t("favorite"),
    t("top_rated"),
    t("recent"),
  ];

  // Lấy vị trí hiện tại của người dùng
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Lấy danh sách yêu thích từ AsyncStorage
  useEffect(() => {
    const getFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favoriteLocations");
        if (storedFavorites) {
          setFavoriteList(JSON.parse(storedFavorites));
        }
      } catch (error) {
      }
    };

    getFavorites();
  }, []);

  // Hàm tính khoảng cách từ vị trí người dùng đến địa điểm
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

  const processImageUrl = (imageData, placeName) => {
    if (Array.isArray(imageData) && imageData.length > 0) {
      const firstImage = imageData[0];
      if (typeof firstImage === 'string' && 
          (firstImage.startsWith('http://') || firstImage.startsWith('https://'))) {
        return firstImage;
      }
    }
    
    if (typeof imageData === 'string' && 
        (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
      return imageData;
    }
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(placeName)}&background=random&color=fff&size=400`;
  };

  // Xử lý dữ liệu địa điểm
  const processRentalData = () => {
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

        return {
          id: item._id,
          imageUrl: processImageUrl(item.image, item.name),
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
          isFavorite: favoriteList.includes(item._id),
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });
  };

  // Lọc theo filter được chọn
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
        filtered = rentalList.filter((item) => favoriteList.includes(item.id));
        // Show newest favorite first
        filtered = filtered.reverse();
        break;
      case 3: // Top rated
        filtered = rentalList
          .filter((item) => item.ratingPoint > 0)
          .sort((a, b) => b.ratingPoint - a.ratingPoint);
        break;
      case 4: // Recent
        filtered = rentalList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        filtered = rentalList;
    }

    setFilteredRentals(filtered.slice(0, 5)); 
  }, [selectedFilterIndex, rentalData, userLocation, favoriteList]);

  const handleFavoritePress = async (id, isFav) => {
    try {
      let updatedFavorites;
      if (isFav) {
        updatedFavorites = [...favoriteList, id];
      } else {
        updatedFavorites = favoriteList.filter((itemId) => itemId !== id);
      }

      setFavoriteList(updatedFavorites);
      await AsyncStorage.setItem(
        "favoriteLocations",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
     
    }
  };

  const onLocationPress = (id) => {
    if (navigation) {
      navigation.navigate("LocationDetail", { id });
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

      <ScrollView style={styles.paddingVerticalCard}>
        {filteredRentals.length > 0 ? (
          filteredRentals.map((item) => (
            <VerticalCard
              key={item.id}
              {...item}
              onFavouritePress={(isFav) => {
                handleFavoritePress(item.id, isFav);
              }}
              onCardPress={() => onLocationPress(item.id)}
              initFavourite={item.isFavorite}
            />
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{t("no_data_available")}</Text>
          </View>
        )}
      </ScrollView>

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
    borderRadius: 100,
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