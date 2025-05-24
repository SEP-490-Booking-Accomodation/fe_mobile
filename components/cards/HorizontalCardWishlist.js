import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncStorage } from "../../context/AsyncStorageContext"; // Update path if needed

// Default placeholder image URL - use a reliable source
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/100x100?text=No+Image";

const HorizontalCardWishlist = ({
  item, // The entire item object
  onPress,
}) => {
  const { t } = useTranslation();
  const { toggleFavorite } = useAsyncStorage();
  const [isFavouriteState, setIsFavouriteState] = useState(true); // Always true in wishlist
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Extract properties from item with defaults
  const {
    _id,
    id,
    imageUrl,
    placeName,
    openHour = "00:00",
    closeHour = "23:59",
    minPrice = 0,
    maxPrice = 0,
    location = "Unknown location",
    rating = 0,
    numOfReviews = 0,
  } = item;

  // Validate and prepare image URL
  const getValidImageUrl = () => {
    if (!imageUrl) return DEFAULT_PLACEHOLDER;

    // Check if URL is valid
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch (e) {
      // If URL is invalid, try to fix common issues
      if (imageUrl.startsWith("//")) {
        return `https:${imageUrl}`;
      } else if (!imageUrl.startsWith("http")) {
        return `https://${imageUrl}`;
      }
      return DEFAULT_PLACEHOLDER;
    }
  };

  const validImageUrl = getValidImageUrl();

  const handleFavouritePress = async () => {
    try {
      // Remove from favorites
      await toggleFavorite(item);
      setIsFavouriteState(false);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        {isLoading && !imageError && (
          <ActivityIndicator
            size="small"
            color="#4E72E3"
            style={styles.loader}
          />
        )}
        <Image
          source={{
            uri: imageError ? DEFAULT_PLACEHOLDER : validImageUrl,
            headers: {
              Accept: "image/*",
            },
            cache: "force-cache",
          }}
          resizeMode="cover"
          style={styles.image}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageError(true);
            console.log(`Failed to load wishlist image: ${validImageUrl}`);
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{placeName}</Text>
        <View style={styles.openingHourContainer}>
          <Text style={styles.openHourText}>
            {t("open_hours")} ({openHour} - {closeHour})
          </Text>
        </View>
        <Text style={styles.priceRange}>
          {minPrice.toLocaleString("vi-VN")} {t("currency")} -{" "}
          {maxPrice.toLocaleString("vi-VN")} {t("currency")}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color="#4e72e3" />
          <Text
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#ffc907" />
          <Text style={styles.ratingText}>
            {rating} ({numOfReviews} {t("reviews_count")})
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favouriteContainer}
        onPress={handleFavouritePress}
        activeOpacity={0.8}
      >
        <Icon name="favorite" size={24} color="#FF4B26" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 16,
    shadowColor: "#000",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  title: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  openingHourContainer: {
    backgroundColor: "#12b347",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  openHourText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  priceRange: {
    color: "#4e72e3",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    color: "#00000066",
    marginLeft: 8,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#00000099",
  },
  favouriteContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 100,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    zIndex: 1,
  },
});

export default HorizontalCardWishlist;
