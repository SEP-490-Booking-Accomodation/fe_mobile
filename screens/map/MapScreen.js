import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import HorizontalCardMedium from '../../components/cards/HorizontalCardMedium';
import SearchField from '../../components/SearchField';
import Filter from '../../components/Filter';
import { mockData } from '../../data/mockData';

const MapScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [locationError, setLocationError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [100000, 100000000],
    selectedRating: null,
    selectedAmenities: [],
  });

  useEffect(() => {
    const checkLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Quyền truy cập vị trí bị từ chối');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        setLocationError('Không thể lấy vị trí hiện tại');
        console.error(error);
      }
    };

    checkLocationPermission();
  }, []);


  const nearbyLocations = mockData.destinations.map(destination => ({
    id: destination.id,
    coordinate: destination.coordinate || { latitude: 0, longitude: 0 },
    title: destination.name,
    imageUrlLogo: destination.rooms[0]?.imageUrl,
    placeName: destination.name,
    openHour: destination.openHours?.split(' ')[1] || '08:00',
    closeHour: destination.openHours?.split(' ')[2] || '22:00',
    minPrice: destination.rooms[0]?.price || '100.000',
    maxPrice: destination.rooms[0]?.price || '500.000',
    location: destination.location || 'Unknown location', 
    rating: destination.rating.toString(),
    numOfReviews: destination.reviews.toString(),
    distance: '1',
    destination: destination
  }));
  const filteredLocations = selectedLocation 
    ? [selectedLocation] 
    : nearbyLocations.filter((location) => {
        const isInPriceRange =
          parseInt(location.minPrice.replace(/\./g, '')) >= filters.priceRange[0] &&
          parseInt(location.maxPrice.replace(/\./g, '')) <= filters.priceRange[1];

        const isRatingMatch =
          !filters.selectedRating || parseInt(location.rating) === filters.selectedRating;
        const isAmenitiesMatch = true;

        return isInPriceRange && isRatingMatch && isAmenitiesMatch;
      });

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
  };

  const handleCardPress = (location) => {
    navigation.navigate('DetailRentalLocation', { 
      destination: location.destination,
      previousScreen: 'Map'
    });
  };

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchField
        placeholder="Tìm kiếm điểm đến của bạn"
        onChangeText={setSearchText}
        value={searchText}
        backIcon
        filterIcon
        onPressBackIcon={() => navigation.goBack()}
        onPressFilterIcon={() => setFilterVisible(true)}
        style={styles.searchContainer}
      />
      <MapView
        style={styles.map}
        region={userLocation}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.markerContainer}>
              <View style={styles.markerCallout}>
                <Text style={styles.markerText}>Vị trí của bạn</Text>
              </View>
              <View style={styles.markerIconContainer}>
                <View style={styles.pinCircle}>
                  <View style={styles.pinInnerCircle}></View>
                </View>
                <View style={styles.pinStick}></View>
                <View style={styles.rippleEffect}></View>
              </View>
            </View>
          </Marker>
        )}

        {filteredLocations.map((location) => (
          <Marker 
            key={location.id} 
            coordinate={location.coordinate}
            onPress={() => handleMarkerPress(location)}
          >
            <View style={styles.differentMarkerIconContainer}>
              <View style={styles.differentPinCircle}>
                <View style={styles.differentPinInnerCircle}></View>
              </View>
              <View style={styles.differentPinStick}></View>
              <View style={styles.differentRippleEffect}></View>
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Điểm đến gần nhất</Text>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
          {filteredLocations.map((location) => (
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
          ))}
        </ScrollView>
      </View>

      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(appliedFilters) => setFilters(appliedFilters)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  map: {
    flex: 0.6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCallout: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  markerText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  markerIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  pinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4E72E3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pinInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  pinStick: {
    width: 2,
    height: 20,
    backgroundColor: '#4E72E3',
    marginTop: -4,
    zIndex: 1,
  },
  rippleEffect: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 114, 227, 0.2)',
    position: 'absolute',
    top: 14,
    zIndex: 0,
  },
  differentMarkerIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  altPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6F61',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  altPinInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  altPinStick: {
    width: 2,
    height: 20,
    backgroundColor: '#FF6F61',
    marginTop: -4,
    zIndex: 1,
  },
  differentMarkerIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  differentPinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4E72E3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  differentPinInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  differentPinStick: {
    width: 2,
    height: 20,
    backgroundColor: '#4E72E3',
    marginTop: -4,
    zIndex: 1,
  },
  differentRippleEffect: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 114, 227, 0.2)',
    position: 'absolute',
    top: 14,
    zIndex: 0,
  },
});

export default MapScreen;
