import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Button, Keyboard } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { FontAwesome5 } from "@expo/vector-icons"
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

  const { data: rentalLocations, isLoading, error, refetch } = useGetAllRentalQuery()

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
        console.error("Location error:", error)
        setLocationError(t("location_current_error"))
      }
    }

    checkLocationPermission()
  }, [])

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

    return rentalLocations.data
      .filter((location) => {
        return (
          location.latitude &&
          location.longitude &&
          !isNaN(Number.parseFloat(location.latitude)) &&
          !isNaN(Number.parseFloat(location.longitude))
        )
      })
      .map((location) => {
        const lat = Number.parseFloat(location.latitude)
        const lng = Number.parseFloat(location.longitude)

        return {
          id: location._id,
          coordinate: { latitude: lat, longitude: lng },
          title: location.name,
          imageUrlLogo: location.image?.[0] || "",
          placeName: location.name,
          openHour: location.openHour || "08:00",
          closeHour: location.closeHour || "22:00",
          minPrice: location?.minPrice || 100000,
          maxPrice: location?.maxPrice || 500000,
          location: `${location.address || ""}, ${location.ward || ""}, ${location.district || ""
            }, ${location.city || ""}`,
          rating: location.rating || "4.5",
          numOfReviews: location.numOfReviews || "10",
          distance: userLocation
            ? calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng).toFixed(1)
            : "N/A",
          destination: location,
        }
      })
  }

  const getAllLocations = () => {
    return transformLocations()
  }

  const getNearbyLocations = () => {
    const locations = transformLocations()

    if (selectedLocation) {
      return [selectedLocation]
    }

    return locations
      .filter((location) => {
        if (searchText && searchText.length > 0 && isSearching) {
          const searchLower = searchText.toLowerCase()
          const placeNameLower = location.placeName.toLowerCase()

          if (!placeNameLower.includes(searchLower)) {
            return false
          }
        }

        if (userLocation && location.distance && location.distance !== "N/A") {
          const distance = Number.parseFloat(location.distance)
          if (distance > 5) return false
        }

        const minPrice =
          typeof location.minPrice === "number" ? location.minPrice : Number.parseFloat(location.minPrice) || 100000
        const maxPrice =
          typeof location.maxPrice === "number" ? location.maxPrice : Number.parseFloat(location.maxPrice) || 500000

        const isInPriceRange =
          (minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]) ||
          (maxPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1]) ||
          (minPrice <= filters.priceRange[0] && maxPrice >= filters.priceRange[1])

        let isRatingMatch = true
        if (filters.selectedRating !== null) {
          const rating =
            typeof location.rating === "number"
              ? location.rating
              : Number.parseFloat(location.rating || location.averageRating || "0")

          const selectedRating = filters.selectedRating + 1
          const lowerBound = selectedRating - 0.9
          const upperBound = selectedRating + 0.9

          console.log(`Checking rating: ${rating}, selected: ${selectedRating}, bounds: ${lowerBound}-${upperBound}`)
          isRatingMatch = rating >= lowerBound && rating <= upperBound
        }

        return isInPriceRange && isRatingMatch
      })
      .sort((a, b) => {
        if (userLocation && a.distance !== "N/A" && b.distance !== "N/A") {
          return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        }
        return 0
      })
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

  const handleCardPress = (location) => {
    // Navigate to the HomeStack with a flag indicating we came from Map
    navigation.navigate("Home", {
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
        onPressBackIcon={() => navigation.goBack()}
        onPressFilterIcon={() => setFilterVisible(true)}
        style={styles.searchContainer}
        enableSearch={true}
      />

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
        <Text style={styles.listTitle}>
          {isSearching && searchText
            ? `${t("search_results_for")} "${searchText}"`
            : t("nearest_destinations")}
        </Text>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
          {nearbyLocations.length === 0 ? (
            <Text style={styles.noResultsText}>
              {isSearching
                ? `${t("no_results_for")} "${searchText}"`
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
              />
            ))
          )}
        </ScrollView>
      </View>

      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(appliedFilters) => setFilters(appliedFilters)}
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
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
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
