import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import MultiSelectButtonGroup from "../../components/buttons/MultiSelectButtonGroup";
import Tag from "../../components/Tag";
import SimpleVerticalCard from "../../components/cards/SimpleVerticalCard";
import { Button } from "react-native-elements";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { newChat } from "../../lib/supabase";
import { useGetAllFeedbackByRentalIdQuery } from "../../api/feedbackApi";
import { useGetAverageFeedbackByRentalIdQuery } from "../../api/feedbackApi";
import { useGetRentalLocationByIdQuery } from "../../api/rentalLocationApi";
import { useGetAllAccommodationTypesQuery } from "../../api/accommodationTypeApi";
import { useGetUserIdByOwnerIdQuery } from "../../api/ownerApi";
import { useTranslation } from "react-i18next";

// Import only the MoreOptionsModal component
import MoreOptionsModal from "../booking/modals/MoreOptionModal";

const DetailRentalLocationScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const { loadIdChatPlatform, isFavorite, toggleFavorite } = useAsyncStorage();
  const { rentalId: locationId } = route.params;
  const [activeTab, setActiveTab] = useState("accommodation_types");
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Modal visibility states
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);

  // State for the review image modal
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  // Function to open the review image modal
  const openReviewModal = (imageIndex, reviewImages) => {
    if (reviewImages && reviewImages[imageIndex]) {
      setSelectedReviewImage(reviewImages[imageIndex].source);
      setReviewModalVisible(true);
    }
  };

  const { data: feedbackDataList } =
    useGetAllFeedbackByRentalIdQuery(locationId);
  const { data: feedbackAverage } =
    useGetAverageFeedbackByRentalIdQuery(locationId);

  const {
    data: rentalData,
    isLoading: isRentalLoading,
    isError: isRentalError,
  } = useGetRentalLocationByIdQuery(locationId);

  const ownerId = rentalData?.data?.ownerId.id;
  const { data: userOwnerId } = useGetUserIdByOwnerIdQuery(ownerId);
  const {
    data: accommodationTypesData,
    isLoading: isAccommodationLoading,
    isError: isAccommodationError,
  } = useGetAllAccommodationTypesQuery(locationId || "");
  const isLoading = isRentalLoading || isAccommodationLoading;
  const isError = isRentalError || isAccommodationError;

  // Debug: Log route params on mount
  useEffect(() => {
   
  }, [route.params]);

  // Debug: Log rentalData and feedbackAverage when they change
  useEffect(() => {

  }, [rentalData]);
  useEffect(() => {

  }, [feedbackAverage]);

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

  const updateServices = () => {
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
  };

  useEffect(() => {
    const checkOpenStatus = () => {
      if (!rentalData?.data?.openHour || !rentalData?.data?.closeHour) {
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [openHourValue, openMinuteValue] = rentalData.data.openHour.split(':').map(Number);
      const [closeHourValue, closeMinuteValue] = rentalData.data.closeHour.split(':').map(Number);

      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const openTimeInMinutes = openHourValue * 60 + openMinuteValue;
      const closeTimeInMinutes = closeHourValue * 60 + closeMinuteValue;

      if (closeTimeInMinutes < openTimeInMinutes) {
        setIsOpen(
          currentTimeInMinutes >= openTimeInMinutes ||
          currentTimeInMinutes <= closeTimeInMinutes
        );
      } else {
        setIsOpen(
          currentTimeInMinutes >= openTimeInMinutes &&
          currentTimeInMinutes <= closeTimeInMinutes
        );
      }
    };

    checkOpenStatus();

    const intervalId = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(intervalId);
  }, [rentalData]);

  useEffect(() => {
    fetchUser();
    // Check if the location is in favorites
    setIsFavoriteState(isFavorite(locationId));
    updateServices();
  }, [locationId, isFavorite]);

  if (!locationId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{t("location_not_found")}</Text>
        <Button title={t("go_back")} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // Add this guard clause before using rentalData.data or feedbackAverage
  if (!rentalData || !rentalData.data || !feedbackAverage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E72E3" />
        </View>
      </SafeAreaView>
    );
  }

  const handleFavoritePress = async () => {
    try {
      // Check if rentalData is loaded
      if (!rentalData?.data) {
        console.warn('[DEBUG] rentalData is not loaded yet!');
        Alert.alert(
          t("error"),
          t("please_wait_loading"),
          [{ text: t("ok"), style: "default" }]
        );
        return;
      }

      const locationData = {
        id: locationId,
        imageUrl: rentalData.data.image?.[0] || "https://ui-avatars.com/api/?name=Place&background=random&color=fff&size=400",
        placeName: rentalData.data.name || t("unknown_place"),
        openHour: rentalData.data.openHour || "00:00",
        closeHour: rentalData.data.closeHour || "23:59",
        minPrice: rentalData.data.minPrice || 0,
        maxPrice: rentalData.data.maxPrice || 0,
        location: rentalData.data.address 
          ? `${rentalData.data.address}, ${rentalData.data.ward || ""}, ${rentalData.data.district || ""}, ${rentalData.data.city || ""}`
          : t("location_not_available"),
        ratingPoint: feedbackAverage?.averageRating || 0,
        numberOfReview: feedbackAverage?.totalFeedbacks || 0,
        status: rentalData.data.status || 3,
        isOverNight: rentalData.data.isOverNight || false,
      };

     
      const newFavoriteStatus = await toggleFavorite(locationData);
      setIsFavoriteState(newFavoriteStatus);
    } catch (error) {
      Alert.alert(
        t("error"),
        t("failed_to_update_favorite"),
        [{ text: t("ok"), style: "default" }]
      );
    }
  };

  const handleChatPress = async () => {
    try {
      const currentUser = user;
      const ownerPlatformId = userOwnerId?.userId;
      const locationId = rentalData.data?._id;

      const result = await newChat({
        ownerPlatformId,
        locationId,
        currentUser,
        rental: rentalData.data,
        navigation,
      });

      
    } catch (error) {
      console.error("Chat start error:", error);
    }
  };

  // Update the handleMoreOptions function to show the modal
  const handleMoreOptions = () => {
    setMoreOptionsModalVisible(true);
  };

  // Add these handler functions for the modal actions
  const handleShare = () => {
    // Implement your share functionality here
  };

  const ratingCounts = (feedbackDataList || []).reduce((acc, review) => {
    const rating = review.rating;
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
              {feedbackAverage?.averageRating?.toFixed(1) || "0.0"}
            </Text>
            <Text style={styles.totalReviews}>
              {feedbackAverage?.totalFeedbacks || 0} {t("reviews_count")}
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
                      style={[styles.ratingBar, { width: `${percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>
                    {count} {t("times")}
                  </Text>
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
                    {review.bookingId?.customerId?.userId?.fullName &&
                    review.bookingId?.customerId?.userId?.fullName.length <= 1
                      ? "*"
                      : `${review.bookingId?.customerId?.userId?.fullName
                          .slice(
                            0,
                            Math.floor(
                              review.bookingId?.customerId?.userId?.fullName
                                ?.length / 2
                            )
                          )
                          .replace(
                            /./g,
                            "*"
                          )}${review.bookingId?.customerId?.userId?.fullName?.slice(
                          Math.floor(
                            review.bookingId?.customerId?.userId?.fullName
                              ?.length / 2
                          )
                        )}`}
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
                      onPress={() => openReviewModal(imgIndex, review.images)}
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
  };

  const renderAccommodationTypes = () => {
    const filteredAccommodationTypes =
      selectedServices.length > 0
        ? (accommodationTypesData?.data || []).filter((accommodation) =>
            accommodation.serviceIds?.some((service) =>
              selectedServices.includes(service.name)
            )
          )
        : accommodationTypesData?.data || [];

    return (
      <View style={styles.accommodationContainer}>
        {allServices.length > 0 && (
          <View>
            <TouchableOpacity
              style={styles.servicesHeader}
              onPress={() => setIsServicesExpanded(!isServicesExpanded)}
            >
              <Text style={styles.servicesHeaderText}>{t("services")}</Text>
              <Icon
                name={
                  isServicesExpanded
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={24}
                color="#4e72e3"
              />
            </TouchableOpacity>

            {isServicesExpanded && (
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
          </View>
        )}
        <View style={styles.card}>
          {filteredAccommodationTypes.map((accommodationType) => (
            <SimpleVerticalCard
              key={accommodationType._id}
              imageUrl={accommodationType.image?.[0]}
              placeName={accommodationType.name}
              price={`${accommodationType.basePrice}${t("per_hour")}`}
              location={`${rentalData.data.address}, ${rentalData.data.ward} , ${rentalData.data.district}, ${rentalData.data.city}`}
              onCardPress={() => handleCardPress(accommodationType)}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleCardPress = (accommodationType) => {
    navigation.navigate("DetailAccomodation", {
      accommodationTypeId: accommodationType._id,
      rentalData: rentalData,
      rentalName: rentalData?.data?.name,
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
          <Text>{t("data_load_error")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rental = rentalData.data;
  const accommodationTypes = rental.accommodationTypeIds.data || [];

  const renderStatusIndicator = () => {
    if (rental.status === 2 || rental.status === 5 || rental.status === 1) {
      return (
        <View style={styles.inactiveStatusContainer}>
          <Text style={styles.statusText}>{t("inactive_status")}</Text>
        </View>
      );
    } else if (rental.status === 3) {
      return (
        <View style={isOpen ? styles.openStatusContainer : styles.closedStatusContainer}>
          <Text style={styles.statusText}>
            {isOpen ? t("open_hr") : t("close_hr")} ({rental.openHour} - {rental.closeHour})
          </Text>
        </View>
      );
    } else if (rental.status === 4) {
      return (
        <View style={styles.pauseStatusContainer}>
          <Text style={styles.statusText}>{t("paused_status")}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.unknownStatusContainer}>
          <Text style={styles.statusText}>{t("unknown_status")}</Text>
        </View>
      );
    }
  };

  // Update the favorite button in the render section
  const renderFavoriteButton = () => {
    if (isLoading) {
      return (
        <TouchableOpacity disabled>
          <ActivityIndicator size="small" color="#666666" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={handleFavoritePress}>
        <Icon
          name={isFavoriteState ? "favorite" : "favorite-border"}
          size={24}
          color={isFavoriteState ? "#FF4B26" : "#666666"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.fixedHeaderActions}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="#4E72E3" />
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            {renderFavoriteButton()}
            <TouchableOpacity onPress={handleChatPress}>
              <MaterialIcons name="chat" size={24} color="#4E72E3" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMoreOptions}>
              <Icon name="more-vert" size={24} color="#4E72E3" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {rentalData.data?.status === 4 && (
            <View style={[styles.banner, { backgroundColor: "#FFA500" }]}>
              <Text style={styles.bannerText}>{t("temporarily_paused")}</Text>
            </View>
          )}
          {rentalData.data?.status === 5 && (
            <View style={[styles.banner, { backgroundColor: "#ccc" }]}>
              <Text style={styles.bannerText}>{t("inactive")}</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: rental.image?.[0] || "https://via.placeholder.com/300",
                }}
                style={styles.headerImage}
              />
              {renderStatusIndicator()}
            </View>
            <View style={styles.headerDetails}>
              <View style={styles.destinationHeader}>
                <Text style={styles.destinationName}>{rental.name}</Text>
                <Tag
                  text={`${rental.openHour} - ${rental.closeHour}`}
                  backgroundColor={isOpen ? "#12B347" : "#FF4B26"}
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
                <Text style={styles.ratingText}>
                  {feedbackAverage?.averageRating?.toFixed(1) || "0.0"} (
                  {feedbackAverage?.totalFeedbacks || 0} {t("reviews_count")}
                  {")"}
                </Text>
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
                    {isDescriptionExpanded ? t("collapse") : t("read_more")}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "accommodation_types" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("accommodation_types")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "accommodation_types" && styles.activeTabText,
                ]}
              >
                {t("accommodation_types")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "reviews" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("reviews")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "reviews" && styles.activeTabText,
                ]}
              >
                {t("reviews")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "accommodation_types"
              ? renderAccommodationTypes()
              : renderReview()}
          </View>
        </ScrollView>

        {/* Modified MoreOptionsModal component without report option */}
        <MoreOptionsModal
          visible={moreOptionsModalVisible}
          onClose={() => setMoreOptionsModalVisible(false)}
          onShare={handleShare}
          t={t}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={reviewModalVisible}
          onRequestClose={() => setReviewModalVisible(false)}
        >
          <View style={styles.reviewModalOverlay}>
            <TouchableOpacity
              style={styles.reviewModalCloseButton}
              onPress={() => setReviewModalVisible(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={selectedReviewImage}
              style={styles.reviewModalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f8f9fa",
  },
  ratingCount: {
    marginLeft: 8,
  },
  mainContainer: {
    flex: 1,
    position: "relative",
    paddingTop: 72,
  },
  reviewsContainer: {
    padding: 8,
  },
  accommodationContainer: {
    padding: 8,
  },
  commentsScrollView: {
    maxHeight: 300,
    marginTop: 8,
  },
  ratingSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
    marginLeft: 8,
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
    padding: 8,
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
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    color: "#000",
    fontWeight: "bold",
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
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
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
    marginBottom: 20,
  },
  // Tab styles
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#4E72E3",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4E72E3",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
  // Services collapsible styles
  servicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },
  servicesHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewModalImage: {
    width: "90%",
    height: "80%",
    borderRadius: 8,
  },
  reviewModalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
});

export default DetailRentalLocationScreen;
