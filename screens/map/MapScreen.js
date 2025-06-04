import React, { useState, useEffect, useRef } from "react"
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Button, Keyboard, TouchableOpacity, Modal } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { FontAwesome5 } from "@expo/vector-icons"
import { useFocusEffect } from '@react-navigation/native'
import HorizontalCardMedium from "../../components/cards/HorizontalCardMedium"
import SearchField from "../../components/SearchField"
import Filter from "../../components/Filter"
import { useGetAllRentalQuery } from "../../api/rentalLocationApi"
import { useTranslation } from "react-i18next"

const MapScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const mapRef = useRef(null)

  const [userLocation, setUserLocation] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [locationError, setLocationError] = useState(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [100000, 100000000],
    selectedRating: null,
    selectedAmenities: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  
  const [selectedRadius, setSelectedRadius] = useState(5)
  const [radiusModalVisible, setRadiusModalVisible] = useState(false)
  const [hasSelectedCustomRadius, setHasSelectedCustomRadius] = useState(false)

  const { data: rentalLocations, isLoading, error, refetch } = useGetAllRentalQuery()

  // Radius options
  const radiusOptions = [
    { value: 1, label: "1 km" },
    { value: 2, label: "2 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 15, label: "15 km" },
    { value: 20, label: "20 km" },
    { value: 50, label: "50 km" },
    { value: 100, label: "100 km" },
  ]

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== "granted") {
          setLocationError(t("location_permission_required"))
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        if (!location.coords) {
          throw new Error("Không lấy được tọa độ")
        }

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
      } catch (error) {
        setLocationError(t("location_current_error"))
      }
    }

    checkLocationPermission()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      // Reset states when screen is focused
      setSelectedLocation(null)
      setSearchText("")
      setIsSearching(false)
      setFilters({
        priceRange: [100000, 100000000],
        selectedRating: null,
        selectedAmenities: [],
      })
      setHasAppliedFilters(false)
      setFilterVisible(false)
      
      // Reset map to user location if available
      if (mapRef.current && userLocation) {
        mapRef.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000)
      }
    }, [userLocation])
  )

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => deg * (Math.PI / 180)
    const R = 6371

    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const transformLocations = () => {
    if (!rentalLocations?.data) return []

    
    const filteredLocations = rentalLocations.data
      .filter((location) => {
        // Only show rentals with status 3 and has accommodationTypeIds
        if (location.status !== 3) {
          return false
        }
        if (!location.accommodationTypeIds?.length) {
          return false
        }
        
        if (!location.latitude || !location.longitude || 
            isNaN(Number.parseFloat(location.latitude)) || 
            isNaN(Number.parseFloat(location.longitude))) {
          return false
        }

        return true
      })
      .map((location) => {
        const lat = Number.parseFloat(location.latitude)
        const lng = Number.parseFloat(location.longitude)

        const services = location.accommodationTypeIds?.reduce((acc, type) => {
          if (type.serviceIds && Array.isArray(type.serviceIds)) {
            type.serviceIds.forEach(service => {
              if (service.name) {
                acc.add(service.name)
              }
            })
          }
          return acc
        }, new Set())


        return {
          id: location._id,
          coordinate: { latitude: lat, longitude: lng },
          title: location.name,
          imageUrlLogo: location.image?.[0] || "",
          placeName: location.name,
          openHour: location.openHour || "08:00",
          closeHour: location.closeHour || "22:00",
          minPrice: location?.minPrice ?? 0,
          maxPrice: location?.maxPrice ?? 0,
          location: `${location.address || ""}, ${location.ward || ""}, ${location.district || ""}, ${location.city || ""}`,
          rating: location.averageRating || "0",
          numOfReviews: location.totalFeedbacks || "0",
          distance: userLocation
            ? calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng).toFixed(1)
            : "N/A",
          destination: {
            ...location,
            services: Array.from(services)
          }
        }
      })

    return filteredLocations
  }

  const getAllLocations = () => {
    return transformLocations()
  }

  const isLocationOpen = (location) => {
    if (location.destination.isOverNight) return true;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    const [openHour, openMinute] = (location.openHour || "08:00").split(":").map(Number);
    const [closeHour, closeMinute] = (location.closeHour || "22:00").split(":").map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const getNearbyLocations = () => {
    const locations = transformLocations()

    if (selectedLocation) {
      return [selectedLocation]
    }

    const isUsingSearchOrFilter = (searchText && searchText.length > 0 && isSearching) || hasAppliedFilters

    if (isUsingSearchOrFilter) {
      const filtered = locations.filter((location) => {
        if (searchText && searchText.length > 0 && isSearching) {
          const searchLower = searchText.toLowerCase().trim()
          return (
            location.destination.name?.toLowerCase().includes(searchLower) ||
            location.destination.address?.toLowerCase().includes(searchLower) ||
            location.destination.ward?.toLowerCase().includes(searchLower) ||
            location.destination.district?.toLowerCase().includes(searchLower) ||
            location.destination.city?.toLowerCase().includes(searchLower)
          )
        }

        const min = typeof location.minPrice === 'number'
          ? location.minPrice
          : Number.parseFloat(location.minPrice ?? 100000);

        const max = typeof location.maxPrice === 'number'
          ? location.maxPrice
          : Number.parseFloat(location.maxPrice ?? 500000);

        const isInPriceRange =
          (min >= filters.priceRange[0] && min <= filters.priceRange[1]) ||
          (max >= filters.priceRange[0] && max <= filters.priceRange[1]) ||
          (min <= filters.priceRange[0] && max >= filters.priceRange[1]);

        let isRatingMatch = true
        if (filters.selectedRating !== null) {
          const rating = location.destination.averageRating || 0;

          const ratingRanges = [
            { min: 0, max: 1 },
            { min: 1, max: 2 },
            { min: 2, max: 3 },
            { min: 3, max: 4 },
            { min: 4, max: 5 }
          ]
          
          const selectedRange = ratingRanges[filters.selectedRating]
          isRatingMatch = rating >= selectedRange.min && rating <= selectedRange.max
        }

        let hasSelectedServices = true
        if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
          hasSelectedServices = filters.selectedAmenities.every(amenity => {
            const hasService = location.destination.services.includes(amenity);
            return hasService;
          })
        }

        return isInPriceRange && isRatingMatch && hasSelectedServices
      })

      return filtered.sort((a, b) => {
        // Sort by open/closed status first
        const aIsOpen = isLocationOpen(a);
        const bIsOpen = isLocationOpen(b);
        if (aIsOpen !== bIsOpen) return bIsOpen ? 1 : -1;

        // If both have same open status, sort by distance
        if (userLocation && a.distance !== "N/A" && b.distance !== "N/A") {
          return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        }
        return 0
      })
    } else {
      return locations.filter((location) => {
        if (userLocation && location.distance && location.distance !== "N/A") {
          const distance = Number.parseFloat(location.distance)
          return distance <= selectedRadius 
        }
        return false
      })
        .sort((a, b) => {
          // Sort by open/closed status first
          const aIsOpen = isLocationOpen(a);
          const bIsOpen = isLocationOpen(b);
          if (aIsOpen !== bIsOpen) return bIsOpen ? 1 : -1;

          // If both have same open status, sort by distance
          if (userLocation && a.distance !== "N/A" && b.distance !== "N/A") {
            return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
          }
          return 0
        })
    }
  }

  const allLocations = getAllLocations()
  const nearbyLocations = getNearbyLocations()

  const handleMarkerPress = (location) => {
    setSelectedLocation(location)
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      )
    }
  }

  const handleUserLocationPress = () => {
    setSelectedLocation(null)
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      )
    }
  }

  const handleMyLocationPress = () => {
    setSelectedLocation(null)
    setSearchText("")
    setIsSearching(false)
    setHasAppliedFilters(false)
    setFilters({
      priceRange: [100000, 100000000],
      selectedRating: null,
      selectedAmenities: [],
    })

    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      )
    }
  }

  const handleCardPress = (location) => {
    navigation.navigate("Map", {
      screen: "DetailRentalLocation",
      params: {
        rentalId: location.id,
        previousScreen: "Map",
      },
    })
  }

  const handleSearchChange = (text) => {
    setSearchText(text)
    setIsSearching(text.length > 0)
  }

  const handleSearchSubmit = () => {
    Keyboard.dismiss()
    setIsSearching(true)
  }

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters)

    const isFiltered =
      appliedFilters.priceRange[0] !== 100000 ||
      appliedFilters.priceRange[1] !== 100000000 ||
      appliedFilters.selectedRating !== null ||
      appliedFilters.selectedAmenities.length > 0

    setHasAppliedFilters(isFiltered)
  }

  const handleRadiusSelect = (radius) => {
    setSelectedRadius(radius)
    setHasSelectedCustomRadius(true)
    setRadiusModalVisible(false)
  }

  const handleRadiusReset = () => {
    setSelectedRadius(5)
    setHasSelectedCustomRadius(false)
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E72E3" />
        <Text>{t("loading_data")}</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("load_location_error")}</Text>
        <Text style={styles.errorSubText}>{t("check_network")}</Text>
        <Button title={t("retry")} onPress={() => refetch()} color="#4E72E3" />
      </View>
    )
  }

  if (!rentalLocations?.data?.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("no_location_data")}</Text>
        <Button title="Thử lại" onPress={() => refetch()} color="#4E72E3" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SearchField
        placeholder={t('search_destination')}
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchSubmit}
        value={searchText}
        backIcon={true}
        filterIcon={true}
        onPressBackIcon={() => {
          setSearchText("")
          setIsSearching(false)
          setFilters({
            priceRange: [100000, 100000000],
            selectedRating: null,
            selectedAmenities: [],
          })
          setHasAppliedFilters(false)
          navigation.goBack()
        }}
        onPressFilterIcon={() => setFilterVisible(true)}
        style={styles.searchContainer}
        enableSearch={true}
      />

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={handleMyLocationPress}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="location-arrow" size={20} color="#4E72E3" />
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={userLocation}
        showsUserLocation={false}
        followsUserLocation={true}
      >
        {userLocation && (
          <Marker coordinate={userLocation} onPress={handleUserLocationPress}>
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarkerCallout}>
                <Text style={styles.userMarkerText}>{t("your_location")}</Text>
              </View>
              <View style={styles.userMarkerIconContainer}>
                <View style={styles.userPinOuter}>
                  <View style={styles.userPinInner}>
                    <FontAwesome5 name="user" size={12} color="#4E72E3" />
                  </View>
                </View>
                <View style={styles.userPinTail}></View>
                <View style={styles.userPinShadow}></View>
              </View>
            </View>
          </Marker>
        )}

        {allLocations.map((location) => (
          <Marker key={location.id} coordinate={location.coordinate} onPress={() => handleMarkerPress(location)}>
            <View
              style={[
                styles.locationMarkerContainer,
                selectedLocation?.id === location.id && styles.selectedMarkerContainer,
              ]}
            >
              {selectedLocation?.id === location.id && (
                <View style={styles.selectedMarkerCallout}>
                  <Text style={styles.selectedMarkerText}>{location.placeName}</Text>
                </View>
              )}
              <View style={styles.locationPinOuter}>
                <View style={styles.locationPinInner}>
                  <FontAwesome5 name="map-pin" size={12} color="#FF6F61" />
                </View>
              </View>
              <View style={styles.locationPinTail}></View>
              <View style={styles.locationPinShadow}></View>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {isSearching && searchText
              ? `${t("search_results_for")} "${searchText}"`
              : hasAppliedFilters
                ? t("filtered_results")
                : hasSelectedCustomRadius
                  ? `Trong bán kính ${selectedRadius}km`
                  : t("nearest_destinations")}
          </Text>
          <View style={styles.headerActions}>
            {!isSearching && !hasAppliedFilters && (
              <TouchableOpacity
                style={styles.radiusButton}
                onPress={() => setRadiusModalVisible(true)}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="circle" size={14} color="#4E72E3" />
                <Text style={styles.radiusButtonText}>{selectedRadius}km</Text>
              </TouchableOpacity>
            )}
            {hasSelectedCustomRadius && !isSearching && !hasAppliedFilters && (
              <TouchableOpacity onPress={handleRadiusReset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Đặt lại</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
          {nearbyLocations.length === 0 ? (
            <Text style={styles.noResultsText}>
              {isSearching
                ? `${t("no_results_for")} "${searchText}"`
                : hasAppliedFilters
                  ? t("no_results_for")
                  : hasSelectedCustomRadius
                    ? `Không có địa điểm nào trong bán kính ${selectedRadius}km`
                    : t("no_results_location")}
            </Text>
          ) : (
            nearbyLocations.map((location) => (
              <HorizontalCardMedium
                key={location.id}
                imageUrlLogo={location.imageUrlLogo}
                placeName={location.placeName}
                openHour={location.openHour}
                closeHour={location.closeHour}
                minPrice={location.minPrice}
                maxPrice={location.maxPrice}
                location={location.location}
                rating={location.rating}
                numOfReviews={location.numOfReviews}
                distance={location.distance}
                style={styles.card}
                onPress={() => handleCardPress(location)}
                disabled={!isLocationOpen(location)}
                isOverNight={location.destination.isOverNight}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Radius Selection Modal */}
      <Modal
        visible={radiusModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRadiusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn bán kính tìm kiếm</Text>
              <TouchableOpacity
                onPress={() => setRadiusModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <FontAwesome5 name="times" size={18} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.radiusOptionsContainer}>
              {radiusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radiusOption,
                    selectedRadius === option.value && styles.selectedRadiusOption,
                  ]}
                  onPress={() => handleRadiusSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.radiusOptionText,
                      selectedRadius === option.value && styles.selectedRadiusOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedRadius === option.value && (
                    <FontAwesome5 name="check" size={16} color="#4E72E3" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        rentalLocations={rentalLocations?.data || []}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  myLocationButton: {
    position: "absolute",
    top: 110,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(78, 114, 227, 0.2)",
  },
  map: {
    flex: 0.6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radiusButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78, 114, 227, 0.2)",
  },
  radiusButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#4E72E3",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  modalCloseButton: {
    padding: 4,
  },
  radiusOptionsContainer: {
    paddingHorizontal: 20,
  },
  radiusOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  selectedRadiusOption: {
    backgroundColor: "rgba(78, 114, 227, 0.1)",
    borderWidth: 1,
    borderColor: "#4E72E3",
  },
  radiusOptionText: {
    fontSize: 16,
    color: "#333333",
  },
  selectedRadiusOptionText: {
    color: "#4E72E3",
    fontWeight: "600",
  },

  userMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerCallout: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(78, 114, 227, 0.3)",
  },
  userMarkerText: {
    color: "#4E72E3",
    fontSize: 14,
    fontWeight: "600",
  },
  userMarkerIconContainer: {
    alignItems: "center",
    position: "relative",
  },
  userPinOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#4E72E3",
  },
  userPinInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userPinTail: {
    width: 14,
    height: 14,
    backgroundColor: "#4E72E3",
    transform: [{ rotate: "45deg" }],
    marginTop: -7,
    zIndex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  userPinShadow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(78, 114, 227, 0.15)",
    position: "absolute",
    top: 16,
    zIndex: 0,
  },

  locationMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  selectedMarkerContainer: {
    zIndex: 2,
  },
  locationPinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FF6F61",
  },
  locationPinInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationPinTail: {
    width: 12,
    height: 12,
    backgroundColor: "#FF6F61",
    transform: [{ rotate: "45deg" }],
    marginTop: -6,
    zIndex: 1,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
  },
  locationPinShadow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 111, 97, 0.15)",
    position: "absolute",
    top: 14,
    zIndex: 0,
  },
  selectedMarkerCallout: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 8,
    position: "absolute",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 111, 97, 0.3)",
    minWidth: 100,
  },
  selectedMarkerText: {
    color: "#FF6F61",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default MapScreen