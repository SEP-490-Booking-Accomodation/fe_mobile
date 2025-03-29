// In DetailRentalLocationScreen.js
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MultiSelectButtonGroup from "../../components/buttons/MultiSelectButtonGroup";
import Tag from "../../components/Tag";
import SimpleVerticalCard from "../../components/cards/SimpleVerticalCard";
import { useGetRentalByIdQuery } from "../../api/rentalLocationApi";
import { Button } from "react-native-elements";

const DetailRentalLocationScreen = ({ route, navigation }) => {
  console.log("Route params:", route.params); 
  const { rentalId: locationId } = route.params; 
  console.log("Extracted locationId:", locationId);
  
  if (!locationId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy ID địa điểm</Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }
  const { data: rentalData, isLoading, isError } = useGetRentalByIdQuery(locationId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      const favoriteStatus = await AsyncStorage.getItem(`favoriteStatus_${locationId}`);
      if (favoriteStatus !== null) {
        setIsFavorite(JSON.parse(favoriteStatus));
      }
    };
    loadFavoriteStatus();
  }, [locationId]);

  const toggleFavorite = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    await AsyncStorage.setItem(`favoriteStatus_${locationId}`, JSON.stringify(newStatus));
  };

  const handleMoreOptions = () => {
    Alert.alert("More Options", "Choose an action", [
      { text: "Share", onPress: () => console.log("Share pressed") },
      { text: "Report", onPress: () => console.log("Report pressed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCardPress = (room) => {
    navigation.navigate("DetailAccomodation", { room });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E72E3" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !rentalData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text>Error loading rental location data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rental = rentalData.data;
  const rooms = []; 

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.fixedHeaderActions}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={toggleFavorite}>
              <Icon
                name={isFavorite ? "favorite" : "favorite-border"}
                size={24}
                color="red"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMoreOptions}>
              <Icon name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: rental.image?.[0] || "https://via.placeholder.com/300" }}
              style={styles.headerImage}
            />
            <View style={styles.headerDetails}>
              <View style={styles.destinationHeader}>
                <Text style={styles.destinationName}>{rental.name}</Text>
                <Tag
                  text={`${rental.openHour} - ${rental.closeHour}`}
                  backgroundColor="#4CAF50"
                  textColor="#fff"
                />
              </View>
              <View style={styles.locationContainer}>
                <Icon name="location-on" size={20} color="#4e72e3" />
                <Text style={styles.locationText}>
                  {rental.address}, {rental.ward}, {rental.district}, {rental.city}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="#ffc907" />
                <Text style={styles.ratingText}>
                  {/* You might want to add rating and reviews to your rental model */}
                  4.5 (120 Reviews)
                </Text>
              </View>
              <Text style={styles.description}>
                {isDescriptionExpanded
                  ? rental.description
                  : `${rental.description.slice(0, 90)}...`}
                <TouchableOpacity
                  onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  style={styles.readMoreContainer}
                >
                  <Text style={styles.readMoreText}>
                    {isDescriptionExpanded ? "Thu gọn" : "Đọc thêm"}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
          {/* Add amenities if needed */}
          {/* <View style={styles.multiSelectButtonGroup}>
            <MultiSelectButtonGroup
              items={amenities}
              activeButtonStyle={styles.activeButton}
              inactiveButtonStyle={styles.inactiveButton}
              activeTextStyle={styles.activeText}
              inactiveTextStyle={styles.inactiveText}
              onSelect={setSelectedAmenities}
            />
          </View> */}
          {rooms.map((room) => (
            <SimpleVerticalCard
              key={room.id}
              imageUrl={room.imageUrl}
              placeName={room.name}
              price={`${room.price}đ/${room.priceUnit}`}
              location={room.location}
              ratingPoint={room.rating}
              numberOfReview={room.reviewCount}
              onCardPress={() => handleCardPress(room)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fixedHeaderActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  headerDetails: {
    marginTop: 16,
  },
  destinationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flexShrink: 1,
    marginRight: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 8,
    color: "#555",
  },
  readMoreText: {
    color: "#4E72E3",
    fontWeight: "bold",
  },
  readMoreContainer: {
    marginLeft: 4,
    marginTop: 25,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    color: "#555",
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingTop: 12,
    paddingBottom: 12,
  },
  activeButton: {
    backgroundColor: "rgba(78, 114, 227, 0.33)",
    borderColor: "transparent",
  },
  inactiveButton: {
    backgroundColor: "white",
    borderColor: "#E5E7EB",
  },
  activeText: {
    color: "#4e72e3",
  },
  inactiveText: {
    color: "#374151",
  },
  multiSelectButtonGroup: {
    marginBottom: 16,
  },
});

export default DetailRentalLocationScreen;