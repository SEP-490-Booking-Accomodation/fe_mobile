import { useState, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Star, ChevronRight } from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RatingDetail from "./RatingDetail";
import { useSelector } from "react-redux";
import { useGetAllFeedbackByCustomerIdQuery } from "../../../../api/feedbackApi";
import { useGetAccommodationTypeByIdQuery } from "../../../../api/accommodationTypeApi";

export default function RatingList() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const customerId = useSelector((state) => state.auth.customerId);
  const [feedbacks, setFeedbacks] = useState([]);

  const {
    data: feedbacksData,
    isLoading,
    isError,
  } = useGetAllFeedbackByCustomerIdQuery(customerId);

  // Extract accommodationType IDs
  const accommodationTypeIds = useMemo(() => {
    const ids = new Set();
    feedbacksData?.forEach((fb) => {
      const id = fb?.bookingId?.accommodationId?.accommodationTypeId?.id;
      if (id) ids.add(id);
    });
    return [...ids];
  }, [feedbacksData]);

  // Store images per accommodationTypeId
  const [accommodationImages, setAccommodationImages] = useState({});
  console.log(accommodationImages);

  // Fetch accommodation type images
  useEffect(() => {
    const fetchImages = async () => {
      const promises = accommodationTypeIds.map(async (id) => {
        try {
          const { data } = await useGetAccommodationTypeByIdQuery(id, {
            skip: false,
          }).unwrap();
          return {
            id,
            image:
              data?.data?.image?.[0] ||
              "https://cf.bstatic.com/xdata/images/hotel/max1024x768/489661036.jpg?k=a619ecaaa7580fb2b2abb6d4da75cf199c9f97386c2f7d25dfff0847703b42fe&o=&hp=",
          };
        } catch (error) {
          return {
            id,
            image:
              "https://cf.bstatic.com/xdata/images/hotel/max1024x768/489661036.jpg?k=a619ecaaa7580fb2b2abb6d4da75cf199c9f97386c2f7d25dfff0847703b42fe&o=&hp=",
          };
        }
      });

      const results = await Promise.all(promises);
      const newImages = {};
      results.forEach(({ id, image }) => {
        newImages[id] = image;
      });
      setAccommodationImages(newImages);
    };

    if (accommodationTypeIds.length > 0) {
      fetchImages();
    }
  }, [accommodationTypeIds]);

  useEffect(() => {
    if (feedbacksData) {
      setFeedbacks(feedbacksData);
    }
  }, [feedbacksData]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleViewRatingDetail = (rating) => {
    setSelectedRating(rating);
  };

  const handleBackToList = () => {
    setSelectedRating(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#FFB800" : "transparent"}
          color={star <= rating ? "#FFB800" : "#D1D5DB"}
        />
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>Lịch sử đánh giá</Text>
    </View>
  );

  const renderRatingList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff385c" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    if (!feedbacks || feedbacks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có đánh giá nào</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff385c"]}
            tintColor="#ff385c"
          />
        }
      >
        {feedbacks.map((rating) => {
          const accommodationTypeId =
            rating?.bookingId?.accommodationId?.accommodationTypeId?.id;
          const imageUri =
            accommodationImages[accommodationTypeId] || "/placeholder.svg";

          return (
            <TouchableOpacity
              key={rating.id}
              style={styles.ratingCard}
              onPress={() => handleViewRatingDetail(rating)}
            >
              <View style={styles.ratingCardHeader}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.ratingCardImage}
                />
                <View style={styles.ratingCardInfo}>
                  <Text style={styles.ratingCardTitle} numberOfLines={1}>
                    {rating.bookingId?.accommodationId?.accommodationTypeId
                      ?.name || "Phòng"}
                  </Text>
                  <Text style={styles.ratingCardLocation} numberOfLines={1}>
                    {rating.bookingId?.accommodationId?.rentalLocationId
                      ?.city || "Địa điểm"}
                  </Text>
                  <View style={styles.ratingCardStars}>
                    {renderStars(rating.rating)}
                    <Text style={styles.ratingCardDate}>
                      {rating.createdAt}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedRating ? (
        <RatingDetail
          rating={selectedRating}
          onBack={handleBackToList}
          formatDate={formatDate}
          renderStars={renderStars}
        />
      ) : (
        <>
          {renderHeader()}
          {renderRatingList()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  ratingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  ratingCardInfo: {
    flex: 1,
  },
  ratingCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingCardLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  ratingCardStars: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingCardDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  ratingCardContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
