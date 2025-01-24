import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import HorizontalCardMedium from '../../components/cards/HorizontalCardMedium';
import IconButton from '../../components/buttons/IconButton';
import Filter from '../../components/Filter';

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: -6.2088,
    longitude: 106.8456,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [nearbyLocations, setNearbyLocations] = useState([
    {
      id: '1',
      coordinate: { latitude: -6.2141, longitude: 106.8405 },
      title: 'Imperial',
      imageUrlLogo: require('../../assets/images/beach.jpg'),
      placeName: 'Imperial Resort',
      openHour: '08:00',
      closeHour: '22:00',
      minPrice: '100.000',
      maxPrice: '500.000',
      location: 'Vũng Tàu',
      rating: '4.8',
      numOfReviews: '50',
      distance: '1',
    },
    {
      id: '2',
      coordinate: { latitude: -6.2073, longitude: 106.8458 },
      title: 'Sunset Beach',
      imageUrlLogo: require('../../assets/images/beach.jpg'),
      placeName: 'Sunset Beach',
      openHour: '09:00',
      closeHour: '18:00',
      minPrice: '200.000',
      maxPrice: '1.000.000',
      location: 'Phú Quốc',
      rating: '4.5',
      numOfReviews: '120',
      distance: '2.5',
    },
  ]);

  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={userLocation}
      >
        <Marker coordinate={userLocation} title="Vị trí của bạn" />
        {nearbyLocations.map((location) => (
          <Marker key={location.id} coordinate={location.coordinate} title={location.title} />
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm điểm đến của bạn"
          placeholderTextColor="#A0A4A8"
        />
        <IconButton
          iconName="filter"
          iconSize={24}
          iconColor="#4E72E3"
          buttonSize={40}
          buttonColor="#FFFFFF"
          onPress={() => setFilterVisible(true)}
        />
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Điểm đến gần nhất</Text>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {nearbyLocations.map((location) => (
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
            />
          ))}
        </ScrollView>
      </View>
      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(newFilters) => console.log(newFilters)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  map: {
    flex: 0.6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333333',
    fontSize: 14,
    paddingHorizontal: 8,
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
});

export default MapScreen;
