import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapWithPopup from "../../components/MapWithPopup";
import CustomButton from "../../components/buttons/Button";
import Tag from "../../components/Tag";
import ImageViewing from "react-native-image-viewing";
import MultipleButtonNoSelect from "../../components/buttons/MultipleButtonNoSelect";
import { useGetAccommodationTypeByIdQuery } from "../../api/accommodationTypeApi";
import { useSelector } from "react-redux";

const AccomodationDetailScreen = ({ route, navigation }) => {
  const { accommodationTypeId, rentalData } = route.params;
  const authData = useSelector((state) => state.auth);
  const userId = authData.userId;
  console.log("ame " + accommodationTypeId);

  const { data, isLoading, isError } =
    useGetAccommodationTypeByIdQuery(accommodationTypeId);

  const [activeTab, setActiveTab] = useState(0);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState([]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E72E3" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Error loading accommodation data</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const accommodationType = data.data;
  const rentalLocation = accommodationType.rentalLocationId || {};

  const allServices =
    accommodationType.serviceIds?.map((service) => service.name) || [];

  const accommodationTypeData = {
    id: accommodationType._id,
    name: accommodationType.name,
    location: rentalLocation.name || "Unknown location",
    price: accommodationType.basePrice,
    overtimePrice: accommodationType.overtimeHourlyPrice,
    priceUnit: "h",
    rating: "4.5",
    reviewCount: "12",
    images:
      accommodationType.image?.length > 0
        ? accommodationType.image.map((img, index) => ({
            id: `img-${index}`,
            source: { uri: img },
          }))
        : [
            {
              id: "default-img",
              source: require("../../assets/images/banner.png"),
            },
          ],
    amenities: allServices || [],
    description: accommodationType.description || "No description available",
    maxPeople: accommodationType.maxPeopleNumber,
    reviews: [
      {
        userName: "John Doe",
        rating: 5,
        comment: "Great place to stay!",
        date: "2023-05-15",
        images: [],
      },
    ],
  };

  const handleBookNow = (accommodationType) => {
    if (!userId) {
      Alert.alert(
        "Bạn chưa đăng nhập",
        "Vui lòng đăng nhập để sử dụng tính năng này",
        [
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("Auth"),
          },
          { text: "Để sau" },
        ]
      );
      return;
    }
    navigation.navigate("ConfirmBooking", {
      accommodationTypeData: data,
      rentalData: rentalData,
    });
  };

  const openGalleryModal = (index) => {
    const imageSet = accommodationTypeData.images
      .map((img) => ({
        uri: img?.source?.uri || img.source,
      }))
      .filter((img) => img.uri);
    setCurrentImageSet(imageSet);
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const openReviewModal = (index) => {
    const imageSet = accommodationTypeData.reviews[0]?.images
      .map((img) => ({
        uri: img?.source ? img.source.uri : "",
      }))
      .filter((img) => img.uri);
    setCurrentImageSet(imageSet);
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const openSingleImageModal = (image) => {
    if (!image) return;
    setCurrentImageSet([{ uri: image.uri || image }]);
    setSelectedImageIndex(0);
    setImageModalVisible(true);
  };

  const handleMoreOptions = () => {
    Alert.alert("More Options", "Choose an action", [
      { text: "Share", onPress: () => console.log("Share pressed") },
      { text: "Report", onPress: () => console.log("Report pressed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMoreOptions}>
        <MaterialIcons name="more-vert" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderMainInfo = () => (
    <View style={styles.mainInfo}>
      <TouchableOpacity
        onPress={() =>
          openSingleImageModal(accommodationTypeData.images[0].source)
        }
      >
        <Image
          source={
            typeof accommodationTypeData.images[0].source === "string"
              ? { uri: accommodationTypeData.images[0].source }
              : accommodationTypeData.images[0].source
          }
          style={styles.mainImage}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.accommodationTypeHeader}>
          <Text style={styles.accommodationTypeName}>
            {accommodationTypeData.name}
          </Text>
          <Tag
            text={accommodationTypeData.location}
            backgroundColor="#E8EDFB"
            textColor="#4e72e3"
          />
        </View>
        <View style={styles.priceContainer}>
          <Text
            style={styles.priceText}
          >{`${accommodationTypeData.price}đ/${accommodationTypeData.priceUnit}`}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#4e72e3" />
          <Text style={styles.detailText}>
            Giá overtime: {accommodationTypeData.overtimePrice}đ/giờ
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="people" size={20} color="#4e72e3" />
          <Text style={styles.detailText}>
            Số người tối đa: {accommodationTypeData.maxPeople}
          </Text>
        </View>
        <View style={styles.reviewContainer}>
          <MaterialIcons name="star" size={20} color="#ffc907" />
          <Text style={styles.ratingText}>
            {`${accommodationTypeData.rating} (${accommodationTypeData.reviewCount} Reviews)`}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAmenities = () => (
    <View style={styles.amenitiesContainer}>
      <Text style={styles.sectionTitle}>Amenities</Text>
      {accommodationTypeData.amenities.length > 0 ? (
        <MultipleButtonNoSelect
          items={accommodationTypeData.amenities}
          containerStyle={styles.amenitiesContainer}
          buttonStyle={styles.amenityButton}
          textStyle={styles.amenityText}
          spacing={8}
          borderRadius={20}
        />
      ) : (
        <Text style={styles.noAmenitiesText}>No amenities listed</Text>
      )}
    </View>
  );

  const renderTabs = () => {
    const tabs = ["Chi tiết", "Ảnh", "Đánh giá"];
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPhotos = () => {
    if (accommodationTypeData.images.length === 0) {
      return (
        <View style={styles.noPhotosContainer}>
          <Text style={styles.noPhotosText}>No photos available</Text>
        </View>
      );
    }

    const numColumns = 3;
    const spacing = 8;
    const screenWidth = Dimensions.get("window").width;
    const contentPadding = 16;
    const totalSpacing = (numColumns - 1) * spacing;
    const totalPadding = contentPadding * 2;
    const imageWidth = (screenWidth - totalSpacing - totalPadding) / numColumns;

    return (
      <FlatList
        data={accommodationTypeData.images}
        numColumns={numColumns}
        contentContainerStyle={styles.photosContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openGalleryModal(index)}
            style={[
              styles.imageWrapper,
              {
                marginRight: (index + 1) % numColumns === 0 ? 0 : spacing,
                marginBottom: spacing,
              },
            ]}
          >
            <Image
              source={
                typeof item.source === "string"
                  ? { uri: item.source }
                  : item.source
              }
              style={[
                styles.gridImage,
                { width: imageWidth, height: imageWidth },
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const renderReviews = () => (
    <View style={styles.reviewsContainer}>
      <View style={styles.ratingSummaryContainer}>
        <View style={styles.ratingAverageContainer}>
          <Text style={styles.averageRating}>
            {accommodationTypeData.rating}
          </Text>
          <Text style={styles.totalReviews}>
            ({accommodationTypeData.reviewCount} Đánh giá)
          </Text>
        </View>
        <View style={styles.ratingBreakdownContainer}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <View key={rating} style={styles.ratingRow}>
              <Text style={styles.ratingNumber}>{rating}</Text>
              <View style={styles.ratingBarBackground}>
                <View
                  style={[styles.ratingBar, { width: `${rating * 20}%` }]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      {accommodationTypeData.reviews?.map((review, index) => (
        <View key={index} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image
              source={require("../../assets/images/banner.png")}
              style={styles.reviewerImage}
            />
            <View style={styles.reviewerDetails}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
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
          <Text style={styles.reviewText}>{review.comment}</Text>
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
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView>
            <Text style={styles.descriptionText}>
              {accommodationTypeData.description}
            </Text>
            {renderAmenities()}
          </ScrollView>
        );
      case 1:
        return renderPhotos();
      case 2:
        return <ScrollView>{renderReviews()}</ScrollView>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        {renderMainInfo()}
        {renderTabs()}
        {renderContent()}
      </View>
      <View style={styles.footer}>
        <CustomButton
          onPress={() => handleBookNow(accommodationTypeData)}
          title="Đặt ngay"
          style={styles.bookButton}
          backgroundColor="#101828"
        />
      </View>
      <ImageViewing
        images={currentImageSet}
        imageIndex={selectedImageIndex}
        visible={isImageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
        keyExtractor={(_, index) => `modal-image-${index}`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  backButton: {
    marginTop: 20,
    width: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  mainInfo: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 16,
  },
  accommodationTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accommodationTypeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    color: "#666",
  },
  priceContainer: {
    marginTop: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4e72e3",
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    color: "#555",
  },
  amenitiesContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noAmenitiesText: {
    color: "#666",
    fontStyle: "italic",
  },
  descriptionText: {
    padding: 16,
    color: "#666",
    lineHeight: 22,
  },
  locationSection: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4e72e3",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#4e72e3",
    fontWeight: "600",
  },
  photosContainer: {
    padding: 16,
  },
  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noPhotosText: {
    color: "#666",
    fontStyle: "italic",
  },
  imageWrapper: {
    overflow: "hidden",
  },
  gridImage: {
    borderRadius: 8,
  },
  reviewsContainer: {
    padding: 16,
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
  footer: {
    padding: 14,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    width: "100%",
  },
  amenityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  amenityText: {
    color: "#374151",
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#555",
  },
});

export default AccomodationDetailScreen;
