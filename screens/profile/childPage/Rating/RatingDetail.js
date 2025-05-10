// RatingDetail.jsx
"use client";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function RatingDetail({
  rating,
  onBack,
  formatDate,
  renderStars,
}) {
  const { t } = useTranslation(); 
  const navigation = useNavigation();

  const handleViewBooking = (bookingId) => {
    // Navigate to booking detail
    navigation.navigate("BookingDetail", { bookingId });
    console.log("Navigating to booking:", bookingId);
  };

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>{t('rating_details_title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accommodationCard}>
          <Image
            source={{
              uri:
                rating.bookingId?.accommodationId?.image?.[0] ||
                "/placeholder.svg?height=100&width=100",
            }}
            style={styles.accommodationImage}
          />
          <View style={styles.accommodationInfo}>
            <Text style={styles.accommodationName}>
              {rating.bookingId?.accommodationId?.accommodationTypeId?.name ||
                t('default_room_type')}
            </Text>
            <Text style={styles.accommodationLocation}>
              {rating.bookingId?.accommodationId?.rentalLocationId?.city ||
                t('default_location')}
            </Text>
            <View style={styles.ratingDateRow}>
              <AntDesign name="calendar" size={14} color="#6B7280" />
              <Text style={styles.ratingDate}>{rating.createdAt}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>{t('default_location')}</Text>
          <View style={styles.ratingBox}>
            <View style={styles.ratingHeader}>
              <Text style={styles.ratingValue}>{rating.rating.toFixed(1)}</Text>
              {renderStars(rating.rating)}
            </View>
            <Text style={styles.ratingContent}>{rating.content}</Text>

            {rating.images && rating.images.length > 0 && (
              <View style={styles.ratingImages}>
                <Text style={styles.imagesTitle}>{t('images_label')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {rating.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.ratingImage}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {rating.contentReply && (
          <View style={styles.replySection}>
            <Text style={styles.sectionTitle}>{t('host_response')}</Text>
            <View style={styles.replyBox}>
              <Text style={styles.replyContent}>{rating.contentReply}</Text>
              <Text style={styles.replyDate}>
                {rating.updatedAt && formatDate(rating.updatedAt)}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewBookingButton}
          onPress={() => handleViewBooking(rating.bookingId.id)}
        >
          <Text style={styles.viewBookingText}>{t('view_booking_button')}</Text>
          <AntDesign name="right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  detailContent: {
    flex: 1,
    padding: 16,
  },
  accommodationCard: {
    flexDirection: "row",
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
  accommodationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  accommodationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  accommodationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  accommodationLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  ratingDateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingDate: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  ratingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    color: "#FFB800",
  },
  ratingContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingImages: {
    marginTop: 8,
  },
  imagesTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  ratingImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  replySection: {
    marginBottom: 16,
  },
  replyBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
  },
  replyContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  replyDate: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },
  viewBookingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff385c",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  viewBookingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
});
