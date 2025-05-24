import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//#region How to use this components
/**
 * @example
 * <HorizontalCardMedium
            imageUrlLogo = {require("./assets/images/horizontalCardImage.jpeg")}
            placeName = {"Nhà con nhộng giá rẻ Bình Tân"}
            openHour = {"3:00"}
            closeHour = {"23:00"}
            minPrice = {120000}
            maxPrice = {1400000}
            location = {"Bình Tân, HCM"}
            rating = {"5"}
            numOfReviews = {"12.5k"}
            distance = "22.4"
            status = {3}
            isOverNight = {false}
            ></HorizontalCardMedium>
 * @param {imageUrlLogo, placeName, openHour, closeHour, minPrice, maxPrice, location, rating, numOfReviews, distance, status, isOverNight, onPress} props 
 * @returns HorizontalCardMedium
 */
//#endregion

const HorizontalCardMedium = ({
  imageUrlLogo,
  placeName,
  openHour = "00:00",
  closeHour = "23:59",
  minPrice = 0,
  maxPrice = 0,
  location,
  rating,
  numOfReviews,
  distance,
  status = 3,
  isOverNight = false,
  onPress,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [openHourValue, openMinuteValue] = openHour.split(':').map(Number);
      const [closeHourValue, closeMinuteValue] = closeHour.split(':').map(Number);

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

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN");
  };

  const renderPriceRange = () => {
    return `${formatMoney(minPrice)} - ${formatMoney(maxPrice)}${t("per_hour") || "đ/giờ"}`;
  };

  const getStatusContainer = () => {
    if (status === 2 || status === 5 || status === 1) {
      return styles.inactiveStatusContainer;
    } else if (status === 3) {
      return isOpen ? styles.activeStatusContainer : styles.closedStatusContainer;
    } else if (status === 4) {
      return styles.pauseStatusContainer;
    } else {
      return styles.notStatusContainer;
    }
  };

  const getStatusText = () => {
    if (status === 2 || status === 5 || status === 1) {
      return t("inactive_status");
    } else if (status === 3) {
      return isOpen ? t("open_hr") : t("close_hr");
    } else if (status === 4) {
      return t("paused_status");
    } else {
      return t("unknown_status");
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: imageUrlLogo }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{placeName}</Text>
        <View style={[styles.openingHourContainer, getStatusContainer()]}>
          <Text style={styles.openHourText}>
            {getStatusText()} ({openHour} - {closeHour})
          </Text>
        </View>
        <Text style={styles.priceRange}>
          {renderPriceRange()}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color="#4e72e3" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#ffc907" />
          <Text style={styles.ratingText}>
            {rating} ({numOfReviews} {t("reviews_count")})
          </Text>
        </View>
      </View>
      <View style={styles.distanceContainer}>
        <Icon name="location-on" size={20} color="#979797" />
        <Text style={styles.distanceText}>{distance} km</Text>
      </View>
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
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  activeStatusContainer: {
    backgroundColor: "#12B347", 
  },
  closedStatusContainer: {
    backgroundColor: "#FF4B26", 
  },
  inactiveStatusContainer: {
    backgroundColor: "rgb(209, 57, 27)",
  },
  pauseStatusContainer: {
    backgroundColor: "rgb(221, 188, 0)", 
  },
  notStatusContainer: {
    backgroundColor: "rgb(40, 40, 40)",
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
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 22,
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#979797",
  },
});

export default HorizontalCardMedium;