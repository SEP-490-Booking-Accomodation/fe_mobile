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
import AsyncStorage, { useAsyncStorage } from "../../context/AsyncStorageContext";
import MultiSelectButtonGroup from "../../components/buttons/MultiSelectButtonGroup";
import Tag from "../../components/Tag";
import SimpleVerticalCard from "../../components/cards/SimpleVerticalCard";
import { Button } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { ensureUserInDatabaseWithoutAsyncStorage, newChat } from "../../lib/supabase";
import { useGetAllFeedbackByRentalIdQuery } from "../../api/feedbackApi";
import { useGetAverageFeedbackByRentalIdQuery } from "../../api/feedbackApi";
import { useGetRentalLocationByIdQuery } from "../../api/rentalLocationApi";
import { useGetAllAccommodationTypesQuery } from "../../api/accommodationTypeApi";

const DetailRentalLocationScreen = ({ route, navigation }) => {
  const [user, setUser] = useState({});
  const {loadIdChatPlatform} = useAsyncStorage();
  const { rentalId: locationId } = route.params;

  const {data: feedbackDataList} = useGetAllFeedbackByRentalIdQuery(locationId);
  const {data: feedbackAverage} = useGetAverageFeedbackByRentalIdQuery(locationId);
  
  const {
    data: rentalData,
    isLoading: isRentalLoading,
    isError: isRentalError
  } = useGetRentalLocationByIdQuery(locationId);

  const ownerId = rentalData?.data?.ownerId?._id;

  const {
    data: accommodationTypesData,
    isLoading: isAccommodationLoading,
    isError: isAccommodationError
  } = useGetAllAccommodationTypesQuery(ownerId || "");
  const isLoading = isRentalLoading || isAccommodationLoading;
  const isError = isRentalError || isAccommodationError;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loadIdChatPlatform();
        if (userData) {
          setUser(userData[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  if (!locationId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy ID địa điểm</Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const handleChatPress = async () => {
    try {
      const currentUser = user;
      console.log("Current User:", currentUser);  
      const ownerPlatformId = rentalData.data?.ownerId?.userId?._id;
      const locationId = rentalData.data?._id;
      
      const result = await newChat({
        ownerPlatformId,
        locationId,
        currentUser,
        rental: rentalData.data,
        navigation,
      });

      console.log(result);
    } catch (error) {
      console.error("Chat start error:", error);
    }
  };

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      const favoriteStatus = await AsyncStorage.getItem(
        `favoriteStatus_${locationId}`
      );
      if (favoriteStatus !== null) {
        setIsFavorite(JSON.parse(favoriteStatus));
      }
    };
    loadFavoriteStatus();
  }, [locationId]);
  useEffect(() => {
    if (accommodationTypesData?.data) {
      const services = new Set();
      accommodationTypesData.data.forEach((accommodation) => {
        if (accommodation.serviceIds) {
          accommodation.serviceIds.forEach((service) => {
            services.add(service.name);
          });
        }
      });
      setAllServices(Array.from(services));
    }
  }, [accommodationTypesData]);
  const toggleFavorite = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    await AsyncStorage.setItem(
      `favoriteStatus_${locationId}`,
      JSON.stringify(newStatus)
    );
  };


  const ratingCounts = (feedbackDataList || []).reduce((acc, review) => {
    const rating = review.rating; 
    console.log(acc); 
    if (rating >= 1 && rating <= 5) {
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {});




  const renderReview = () => {
    const totalReviews = feedbackDataList?.length || 1;
    return (
        <View style={styles.reviewsContainer}>
          <View style={styles.ratingSummaryContainer}>
            <View style={styles.ratingAverageContainer}>
              <Text style={styles.averageRating}>
                {feedbackAverage?.averageRating.toFixed(1)}
              </Text>
              <Text style={styles.totalReviews}>
                {feedbackAverage?.totalFeedbacks} lượt đánh giá
              </Text>
            </View>
            <View style={styles.ratingBreakdownContainer}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating] || 0;
                const percentage = (count / totalReviews) * 100;

                return (
                    <View key={rating} style={styles.ratingRow}>
                      <Text style={styles.ratingNumber}>{rating}</Text>
                      <View style={styles.ratingBarBackground}>
                        <View
                            style={[
                              styles.ratingBar,
                              { width: `${percentage}%` },
                            ]}
                        />
                      </View>
                      <Text style={styles.ratingCount}>{count} lượt</Text>
                    </View>
                );
              })}
            </View>
          </View>

          <ScrollView
              style={styles.commentsScrollView}
              nestedScrollEnabled={true}
          >
            {feedbackDataList?.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerDetails}>
                      <Text style={styles.reviewerName}>
                        {review.bookingId?.customerId?.userId?.fullName && review.bookingId?.customerId?.userId?.fullName.length <= 1
                            ? '*'
                            : `${review.bookingId?.customerId?.userId?.fullName
                                .slice(0, Math.floor(review.bookingId?.customerId?.userId?.fullName?.length / 2))
                                .replace(/./g, '*')}${review.bookingId?.customerId?.userId?.fullName?.slice(Math.floor(review.bookingId?.customerId?.userId?.fullName?.length / 2))}`}
                      </Text>

                      <View style={styles.starContainer}>
                        {Array(review.rating)
                            .fill(null)
                            .map((_, i) => (
                                <MaterialIcons
                                    key={i}
                                    name="star"
                                    size={16}
                                    color="#ffc907"
                                />
                            ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.content}</Text>
                  {review.images?.length > 0 && (
                      <View style={styles.reviewImagesContainer}>
                        {review.images.map((image, imgIndex) => (
                            <TouchableOpacity
                                key={imgIndex}
                                onPress={() => openReviewModal(imgIndex)}
                            >
                              <Image source={image.source} style={styles.reviewImage} />
                            </TouchableOpacity>
                        ))}
                      </View>
                  )}
                  <Text style={styles.reviewDate}>{review.createdAt}</Text>
                </View>
            ))}
          </ScrollView>
        </View>
    );
  }

  const handleMoreOptions = () => {
    Alert.alert("More Options", "Choose an action", [
      { text: "Share", onPress: () => console.log("Share pressed") },
      { text: "Report", onPress: () => console.log("Report pressed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCardPress = (accommodationType) => {
    console.log("accomdationType",accommodationType);

    navigation.navigate("DetailAccomodation", {
      accommodationTypeId: accommodationType._id,
      rentalData: rentalData,
      rentalName: rentalData?.data?.name
    });
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
  const accommodationTypes = rental.accommodationTypeIds.data || [];

  const filteredAccommodationTypes =
    selectedServices.length > 0
      ? (accommodationTypesData?.data || []).filter((accommodation) =>
          accommodation.serviceIds?.some((service) =>
            selectedServices.includes(service.name)
          )
        )
      : accommodationTypesData?.data || [];

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
            <TouchableOpacity onPress={handleChatPress}>
              <MaterialIcons name="chat" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMoreOptions}>
              <Icon name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {rentalData.data?.status === 4 && (
              <View style={[styles.banner, { backgroundColor: '#FFA500' }]}>
                <Text style={styles.bannerText}>Tạm thời căn hộ này đang tạm dừng</Text>
              </View>
          )}
          {rentalData.data?.status === 5 && (
              <View style={[styles.banner, { backgroundColor: '#ccc' }]}>
                <Text style={styles.bannerText}>Tạm thời căn hộ này ngừng hoạt động</Text>
              </View>
          )}
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: rental.image?.[0] || "https://via.placeholder.com/300",
              }}
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
                  {rental.address}, {rental.ward}, {rental.district},{" "}
                  {rental.city}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="#ffc907" />
                <Text style={styles.ratingText}>4.5 (120 Reviews)</Text>
              </View>
              <Text style={styles.description}>
                {isDescriptionExpanded
                  ? rental.description
                  : `${rental.description.slice(0, 90)}...`}
                <TouchableOpacity
                  onPress={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  style={styles.readMoreContainer}
                >
                  <Text style={styles.readMoreText}>
                    {isDescriptionExpanded ? "Thu gọn" : "Đọc thêm"}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
          {renderReview()}
          {allServices.length > 0 && (
            <View style={styles.multiSelectButtonGroup}>
              <MultiSelectButtonGroup
                items={allServices}
                selectedIndexes={allServices
                  .map((service) =>
                    selectedServices.includes(service)
                      ? allServices.indexOf(service)
                      : -1
                  )
                  .filter((index) => index !== -1)}
                onChange={(selectedIndexes) => {
                  setSelectedServices(
                    selectedIndexes.map((index) => allServices[index])
                  );
                }}
                activeButtonStyle={styles.activeButton}
                inactiveButtonStyle={styles.inactiveButton}
                activeTextStyle={styles.activeText}
                inactiveTextStyle={styles.inactiveText}
              />
            </View>
          )}
          <View style={styles.card}>
          {filteredAccommodationTypes.map((accommodationType) => (
            <SimpleVerticalCard
              key={accommodationType._id}
              imageUrl={accommodationType.image?.[0]}
              placeName={accommodationType.name}
              price={`${accommodationType.basePrice}đ/giờ`}
              location={`${rental.address}, ${rental.ward} , ${rental.district}, ${rental.city}`}
              onCardPress={() => handleCardPress(accommodationType)}
            />
          ))}

          </View>
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
  ratingCount : {
    marginLeft: 8,
  },
  mainContainer: {
    flex: 1,
    position: "relative",
    paddingTop: 72,
  },
  reviewsContainer: {
    padding: 16,
  },

  commentsScrollView: {
    maxHeight: 300,
    marginTop: 16,
  },
  ratingSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ratingAverageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  averageRating: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4e72e3",
  },
  totalReviews: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  ratingBreakdownContainer: {
    flex: 1,
    marginLeft: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingNumber: {
    width: 20,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  ratingBar: {
    height: 8,
    backgroundColor: "#ffc907",
    borderRadius: 4,
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  starContainer: {
    flexDirection: "row",
  },
  reviewText: {
    color: "#666",
    marginBottom: 8,
  },
  reviewImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
    gap: 8,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    alignSelf: "flex-end",
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
  banner: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerText: {
    color: '#000',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
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
    marginHorizontal: 8,
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
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  card: {
    marginBottom: 20
  }
});

export default DetailRentalLocationScreen;
