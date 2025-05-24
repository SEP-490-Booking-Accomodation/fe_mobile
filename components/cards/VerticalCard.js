import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useAsyncStorage } from "../../context/AsyncStorageContext"; // Update path if needed

// Default placeholder image URL - use a reliable source
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/200x200?text=No+Image";

export default function VerticalCard({
  id,
  imageUrl,
  openHour = "00:00",
  closeHour = "23:59",
  placeName = "Địa điểm chưa xác định",
  minPrice = 0,
  maxPrice = 0,
  status = 0,
  location = "Không rõ",
  isOverNight = false,
  ratingPoint = 0,
  numberOfReview = 0,
  distance,
  initFavourite = false,
  onFavouritePress = () => {},
  onCardPress = () => {},
}) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useAsyncStorage();

  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if this item is in favorites
  const itemId = id;
  const [isFavouriteState, setIsFavouriteState] = useState(
    isFavorite ? isFavorite(itemId) : initFavourite
  );

  // Update favorite state when component mounts or when favorites change
  useEffect(() => {
    if (isFavorite && itemId) {
      setIsFavouriteState(isFavorite(itemId));
    }
  }, [isFavorite, itemId]);

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

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [openHourValue, openMinuteValue] = openHour.split(":").map(Number);
      const [closeHourValue, closeMinuteValue] = closeHour
        .split(":")
        .map(Number);

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
  }, [openHour, closeHour, isOverNight]);

  const handleFavouritePress = async (e) => {
    // Stop event propagation to prevent card press
    e.stopPropagation();
    e.preventDefault();

    try {
      // Create a complete item object to store in favorites
      const item = {
        _id: id,
        id: id,
        imageUrl: validImageUrl,
        placeName,
        openHour,
        closeHour,
        minPrice,
        maxPrice,
        location,
        ratingPoint,
        numberOfReview,
        status,
        isOverNight,
        distance,
      };

      let newFavoriteStatus;

      // Toggle favorite status
      if (toggleFavorite) {
        newFavoriteStatus = await toggleFavorite(item);
      } else {
        newFavoriteStatus = !isFavouriteState;
      }

      setIsFavouriteState(newFavoriteStatus);

      // Also call the original onFavouritePress if provided
      if (onFavouritePress) {
        onFavouritePress(newFavoriteStatus);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCardPress = () => {
    console.log("Card pressed, calling onCardPress for item:", id);
    if (onCardPress) {
      onCardPress();
    }
  };

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN");
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.97}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {isLoading && !imageError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4E72E3" />
          </View>
        )}

        <Image
          source={{
            uri: imageError ? DEFAULT_PLACEHOLDER : validImageUrl,
            headers: {
              Accept: "image/*",
            },
            cache: "force-cache",
          }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageError(true);
            console.log(`Failed to load image: ${validImageUrl}`);
          }}
        />

        {/* Favourite Button */}
        <TouchableOpacity
          style={styles.favouriteContainer}
          onPress={handleFavouritePress}
          activeOpacity={0.8}
        >
          <Icon
            name={isFavouriteState ? "favorite" : "favorite-border"}
            size={24}
            color={isFavouriteState ? "#FF4B26" : "#666666"}
          />
        </TouchableOpacity>

        {/* Opening Hours */}
        {status === 2 || status === 5 || status === 1 ? (
          <View style={styles.inactiveStatusContainer}>
            <Text style={styles.openHoursText}>{t("inactive_status")}</Text>
          </View>
        ) : status === 3 ? (
          <View
            style={
              isOpen
                ? styles.activeStatusContainer
                : styles.closedStatusContainer
            }
          >
            <Text style={styles.openHoursText}>
              {isOpen ? t("open_hr") : t("close_hr")} ({openHour} - {closeHour})
            </Text>
          </View>
        ) : status === 4 ? (
          <View style={styles.pauseStatusContainer}>
            <Text style={styles.openHoursText}>{t("paused_status")}</Text>
          </View>
        ) : (
          <View style={styles.notStatusContainer}>
            <Text style={styles.openHoursText}>{t("unknown_status")}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.title}>{placeName}</Text>
          {isOverNight ? (
            <Text style={styles.isOverNight}>{t("overnight")}</Text>
          ) : null}
        </View>
        <Text style={styles.priceRange}>
          {minPrice == maxPrice
            ? formatMoney(minPrice) + t("per_hour")
            : formatMoney(minPrice) +
              " - " +
              formatMoney(maxPrice) +
              t("per_hour")}
        </Text>

        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color={"#4e72e3"} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.locationText}
          >
            {location}
          </Text>
        </View>
        <View style={styles.distanceContainer}>
          {distance != null && (
            <Text style={styles.distanceText}>
              {t("distance_away", { distance: distance.toFixed(1) })}
            </Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color={"#ffc907"} />
          <Text style={styles.ratingText}>
            {ratingPoint} ({numberOfReview} {t("reviews_count")})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

VerticalCard.propTypes = {
  id: PropTypes.string,
  imageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openHour: PropTypes.string,
  closeHour: PropTypes.string,
  placeName: PropTypes.string,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  location: PropTypes.string,
  ratingPoint: PropTypes.number,
  numberOfReview: PropTypes.number,
  initFavourite: PropTypes.bool,
  onFavouritePress: PropTypes.func,
  onCardPress: PropTypes.func,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.1)",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(240, 240, 240, 0.7)",
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
  },
  distanceContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  isOverNight: {
    padding: 6,
    borderRadius: 20,
    color: "#fff",
    fontSize: 10,
    backgroundColor: "#666",
    fontWeight: 700,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
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
  activeStatusContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#12B347",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 13,
  },
  openHoursText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  inactiveStatusContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgb(209, 57, 27)",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 13,
  },
  pauseStatusContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgb(221, 188, 0)",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 13,
  },
  notStatusContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgb(40, 40, 40)",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 13,
  },
  inactiveText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  title: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "bold",
  },
  priceRange: {
    fontSize: 13,
    color: "#4e72e3",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    marginRight: 20,
    fontSize: 14,
    fontWeight: 400,
    color: "rgb(60, 60, 60)",
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
  closedStatusContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF4B26",
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 13,
  },
});
